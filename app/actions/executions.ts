'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function startPlanExecution(planId: string) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'Không tìm thấy user.' }
  }

  type Plan = { relationship_id: string; [key: string]: any }

  // Get plan details
  const { data: plan, error: planError } = await supabase
    .from('plans')
    .select('*')
    .eq('id', planId)
    .single()

  if (planError || !plan) {
    return { error: 'Không tìm thấy plan.' }
  }

  const typedPlan = plan as Plan

  // Create plan execution
  const { data: execution, error: execError } = await supabase
    .from('plan_executions')
    .insert({
      plan_id: planId,
      relationship_id: typedPlan.relationship_id,
      user_id: user.id,
      status: 'started',
      started_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    } as any)
    .select()
    .single()

  if (execError) {
    console.error('Execution error:', execError)
    return { error: 'Không thể bắt đầu thực hiện.' }
  }

  return { execution }
}

export async function completeStep(executionId: string, stepOrder: number) {
  const supabase = await createClient()

  type Execution = { steps_completed: any[]; [key: string]: any }

  // Get current execution
  const { data: execution } = await supabase
    .from('plan_executions')
    .select('*')
    .eq('id', executionId)
    .single()

  if (!execution) {
    return { error: 'Không tìm thấy execution.' }
  }

  const typedExecution = execution as Execution

  const stepsCompleted = typedExecution.steps_completed || []
  const newStep = {
    step_id: stepOrder,
    completed_at: new Date().toISOString()
  }

  const { error } = await (supabase
    .from('plan_executions') as any)
    .update({
      steps_completed: [...stepsCompleted, newStep]
    })
    .eq('id', executionId)

  if (error) {
    console.error('Complete step error:', error)
    return { error: 'Không thể cập nhật.' }
  }

  return { success: true }
}

export async function completePlanExecution(executionId: string) {
  const supabase = await createClient()

  const { error } = await (supabase
    .from('plan_executions') as any)
    .update({
      status: 'completed',
      completed_at: new Date().toISOString()
    })
    .eq('id', executionId)

  if (error) {
    console.error('Complete execution error:', error)
    return { error: 'Không thể hoàn thành.' }
  }

  revalidatePath('/', 'layout')
  redirect(`/feedback?execution_id=${executionId}`)
}

export async function abandonPlanExecution(executionId: string) {
  const supabase = await createClient()

  const { error } = await (supabase
    .from('plan_executions') as any)
    .update({
      status: 'abandoned',
      abandoned_at: new Date().toISOString()
    })
    .eq('id', executionId)

  if (error) {
    console.error('Abandon execution error:', error)
    return { error: 'Không thể hủy.' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
