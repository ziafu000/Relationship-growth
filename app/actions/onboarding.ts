'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function createRelationship(formData: FormData) {
  const supabase = await createClient()

  // Auth check
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Không tìm thấy user. Vui lòng đăng nhập lại.' }
  }

  const relationshipType = formData.get('relationship_type') as string
  const city = formData.get('city') as string
  const loveLanguages = formData.getAll('love_languages') as string[]
  const interests = formData.getAll('interests') as string[]

  // Check if user already has an active relationship to avoid duplicates
  const { data: existingMember } = await supabase
    .from('relationship_members')
    .select('relationship_id')
    .eq('user_id', user.id)
    .limit(1)

  if (existingMember && existingMember.length > 0) {
    redirect('/dashboard')
  }

  // Transactional RPC call to create relationship, member, passport, and update user
  const rpcArgs: any = {
    p_user_id: user.id,
    p_relationship_type: relationshipType,
    p_city: city,
    p_love_languages: loveLanguages,
    p_interests: interests,
    p_user_email: user.email,
    p_user_name: user.user_metadata?.name || ''
  }

  const { error: rpcError } = await (supabase.rpc as any)('create_solo_relationship', rpcArgs)

  if (rpcError) {
    console.error('RPC error:', rpcError)
    return { error: 'Không thể tạo relationship. Vui lòng thử lại.' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
