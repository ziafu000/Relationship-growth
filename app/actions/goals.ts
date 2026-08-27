'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function selectGoal(formData: FormData) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'Không tìm thấy user. Vui lòng đăng nhập lại.' }
  }

  const { data: member } = await supabase
    .from('relationship_members')
    .select('relationship_id')
    .eq('user_id', user.id)
    .single()

  if (!member) {
    return { error: 'Không tìm thấy relationship.' }
  }

  const checkInId = formData.get('check_in_id') as string
  const goalType = formData.get('goal_type') as string
  const goalDescription = formData.get('goal_description') as string

  const { data: goal, error: goalError } = await supabase
    .from('goals')
    .insert({
      relationship_id: member.relationship_id,
      check_in_id: checkInId,
      goal_type: goalType,
      goal_description_vi: goalDescription,
      selected_at: new Date().toISOString()
    })
    .select()
    .single()

  if (goalError) {
    console.error('Goal error:', goalError)
    return { error: 'Không thể lưu goal. Vui lòng thử lại.' }
  }

  revalidatePath('/', 'layout')
  redirect(`/plans?goal_id=${goal.id}`)
}
