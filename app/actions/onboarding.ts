'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { relationshipSetupSchema } from '@/lib/onboarding'

export async function createRelationship(formData: FormData) {
  const supabase = await createClient()

  // Auth check
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Không tìm thấy user. Vui lòng đăng nhập lại.' }
  }

  const setup = relationshipSetupSchema.safeParse({
    relationshipType: formData.get('relationship_type'),
    city: formData.get('city'),
    loveLanguages: formData.getAll('love_languages'),
    interests: formData.getAll('interests'),
  })

  if (!setup.success) {
    return { error: 'Vui lòng chọn 1-3 ngôn ngữ yêu thương và 3-5 sở thích.' }
  }

  // Check actual membership before invoking the idempotent RPC.
  const { data: existingMember, error: membershipError } = await supabase
    .from('relationship_members')
    .select('relationship_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  if (membershipError) {
    console.error('Membership lookup error:', membershipError)
    return { error: 'Không thể kiểm tra trạng thái onboarding. Vui lòng thử lại.' }
  }

  if (existingMember) {
    redirect('/dashboard')
  }

  // Transactional RPC call to create relationship, member, passport, and update user.
  // The database function independently verifies auth.uid() and all input bounds.
  const { error: rpcError } = await supabase.rpc('create_solo_relationship', {
    p_user_id: user.id,
    p_relationship_type: setup.data.relationshipType,
    p_city: setup.data.city,
    p_love_languages: setup.data.loveLanguages,
    p_interests: setup.data.interests,
    p_user_email: user.email || '',
    p_user_name: user.user_metadata?.name || '',
  })

  if (rpcError) {
    console.error('RPC error:', rpcError)
    return { error: 'Không thể tạo relationship. Vui lòng thử lại.' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
