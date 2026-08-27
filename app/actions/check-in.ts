'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function submitCheckIn(formData: FormData) {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'Không tìm thấy user. Vui lòng đăng nhập lại.' }
  }

  // Get user's relationship
  const { data: member, error: memberError } = await supabase
    .from('relationship_members')
    .select('relationship_id')
    .eq('user_id', user.id)
    .single()

  if (memberError || !member) {
    return { error: 'Không tìm thấy relationship. Vui lòng hoàn thành onboarding.' }
  }

  type RelationshipMember = {
    relationship_id: string
  }

  // Get form data
  const currentMood = formData.get('current_mood') as string
  const connectionLevel = parseInt(formData.get('connection_level') as string)
  const timeTogether = formData.get('time_together_recently') as string
  const recentChallenges = formData.getAll('recent_challenges') as string[]
  const whatMatters = formData.get('what_matters_now') as string
  const availableTime = formData.get('available_time') as string
  const budgetPreference = formData.get('budget_preference') as string
  const locationPreference = formData.get('location_preference') as string

  // Insert check-in
  const { data: checkIn, error: checkInError } = await supabase
    .from('check_ins')
    .insert({
      relationship_id: (member as RelationshipMember).relationship_id,
      user_id: user.id,
      current_mood: currentMood,
      connection_level: connectionLevel,
      time_together_recently: timeTogether,
      recent_challenges: recentChallenges,
      what_matters_now: whatMatters,
      available_time: availableTime,
      budget_preference: budgetPreference,
      location_preference: locationPreference,
      completed_at: new Date().toISOString()
    })
    .select()
    .single()

  if (checkInError) {
    console.error('Check-in error:', checkInError)
    return { error: 'Không thể lưu check-in. Vui lòng thử lại.' }
  }

  type CheckIn = { id: string; [key: string]: any }

  revalidatePath('/', 'layout')
  redirect(`/goals?check_in_id=${(checkIn as CheckIn).id}`)
}

export async function getLatestCheckIn() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  type RelationshipMember = { relationship_id: string }

  const { data: member } = await supabase
    .from('relationship_members')
    .select('relationship_id')
    .eq('user_id', user.id)
    .single()

  if (!member) return null

  const { data: checkIn } = await supabase
    .from('check_ins')
    .select('*')
    .eq('relationship_id', (member as RelationshipMember).relationship_id)
    .order('completed_at', { ascending: false })
    .limit(1)
    .single()

  return checkIn
}
