'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { generatePlans } from '@/lib/engines/growth-plan-engine'

export async function createPlans(goalId: string) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'Không tìm thấy user.' }
  }

  type Goal = {
    relationship_id: string
    goal_type: string
    check_ins: any
    relationships: { relationship_type: string }
    [key: string]: any
  }

  type User = {
    city: string | null
    [key: string]: any
  }

  // Get goal details
  const { data: goal, error: goalError } = await supabase
    .from('goals')
    .select('*, check_ins(*), relationships(*)')
    .eq('id', goalId)
    .single()

  if (goalError || !goal) {
    return { error: 'Không tìm thấy goal.' }
  }

  const typedGoal = goal as Goal

  // Get passport
  const { data: passport } = await supabase
    .from('relationship_passports')
    .select('*')
    .eq('relationship_id', typedGoal.relationship_id)
    .single()

  // Get user's city
  const { data: userData } = await supabase
    .from('users')
    .select('city')
    .eq('id', user.id)
    .single()

  const typedUser = userData as User | null

  // Generate plans using the engine
  const generatedPlans = await generatePlans({
    goalType: typedGoal.goal_type as any,
    checkIn: typedGoal.check_ins,
    passport: passport,
    relationshipType: typedGoal.relationships.relationship_type as any,
    city: typedUser?.city || null
  })

  // Save plans to database
  const plansToInsert = generatedPlans.map(plan => ({
    relationship_id: typedGoal.relationship_id,
    goal_id: goalId,
    user_id: user.id,
    plan_title_vi: plan.plan_title_vi,
    reasoning_vi: plan.reasoning_vi,
    activity_id: plan.activity_id,
    estimated_time_minutes: plan.estimated_time_minutes,
    effort_level: plan.effort_level,
    steps: plan.steps,
    conversation_starters: plan.conversation_starters,
    tips: plan.tips,
    scoring_metadata: plan.scoring_metadata,
    rank: plan.rank,
    created_at: new Date().toISOString()
  }))

  const { data: savedPlans, error: saveError } = await supabase
    .from('plans')
    .insert(plansToInsert as any)
    .select()

  if (saveError) {
    console.error('Error saving plans:', saveError)
    return { error: 'Không thể lưu plans.' }
  }

  return { plans: savedPlans }
}

export async function selectPlan(planId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('plans')
    .update({
      selected_at: new Date().toISOString(),
      viewed_at: new Date().toISOString()
    } as any)
    .eq('id', planId)

  if (error) {
    console.error('Error selecting plan:', error)
    return { error: 'Không thể chọn plan.' }
  }

  revalidatePath('/', 'layout')
  redirect(`/activities/${planId}`)
}

export async function rejectPlan(planId: string, reason: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('plans')
    .update({
      rejected_at: new Date().toISOString(),
      rejection_reason: reason
    } as any)
    .eq('id', planId)

  if (error) {
    console.error('Error rejecting plan:', error)
    return { error: 'Không thể reject plan.' }
  }

  return { success: true }
}

export async function markPlanViewed(planId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('plans')
    .update({ viewed_at: new Date().toISOString() } as any)
    .eq('id', planId)

  if (error) {
    console.error('Error marking viewed:', error)
  }

  return { success: true }
}
