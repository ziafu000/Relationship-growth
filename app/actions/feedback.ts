'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function submitFeedback(formData: FormData) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'Không tìm thấy user.' }
  }

  const executionId = formData.get('execution_id') as string
  const outcome = formData.get('outcome') as string
  const whatWorked = formData.getAll('what_worked') as string[]
  const whatDidntWork = formData.getAll('what_didnt_work') as string[]
  const partnerReaction = formData.get('partner_reaction') as string
  const wouldRepeat = formData.get('would_repeat') === 'true'
  const notes = formData.get('notes') as string

  // Get execution details
  const { data: execution, error: execError } = await supabase
    .from('plan_executions')
    .select('*')
    .eq('id', executionId)
    .single()

  if (execError || !execution) {
    return { error: 'Không tìm thấy execution.' }
  }

  // Insert feedback
  const { error: feedbackError } = await supabase
    .from('feedback')
    .insert({
      plan_execution_id: executionId,
      relationship_id: execution.relationship_id,
      user_id: user.id,
      outcome,
      what_worked: whatWorked,
      what_didnt_work: whatDidntWork,
      partner_reaction: partnerReaction,
      would_repeat: wouldRepeat,
      notes,
      submitted_at: new Date().toISOString()
    })

  if (feedbackError) {
    console.error('Feedback error:', feedbackError)
    return { error: 'Không thể lưu feedback.' }
  }

  // TODO: Process feedback into relationship memory
  // This would be Phase 8, for now just save the feedback

  revalidatePath('/', 'layout')
  redirect('/dashboard?feedback_submitted=true')
}
