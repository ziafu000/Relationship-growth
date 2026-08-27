'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function createRelationship(formData: FormData) {
  const supabase = await createClient()
  const admin = createAdminClient()

  // Auth check — dùng user client
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Không tìm thấy user. Vui lòng đăng nhập lại.' }
  }

  const relationshipType = formData.get('relationship_type') as string
  const city = formData.get('city') as string
  const loveLanguages = formData.getAll('love_languages') as string[]
  const interests = formData.getAll('interests') as string[]

  // DB writes — dùng admin client (bypasses RLS)
  const { data: relationship, error: relationshipError } = await admin
    .from('relationships')
    .insert({ relationship_type: relationshipType, mode: 'solo', status: 'active' })
    .select()
    .single()

  if (relationshipError) {
    console.error('Relationship error:', relationshipError)
    return { error: 'Không thể tạo relationship. Vui lòng thử lại.' }
  }

  const { error: memberError } = await admin
    .from('relationship_members')
    .insert({
      relationship_id: relationship.id,
      user_id: user.id,
      role: 'owner',
      joined_at: new Date().toISOString()
    })

  if (memberError) {
    console.error('Member error:', memberError)
    return { error: 'Không thể tạo relationship member.' }
  }

  const { error: passportError } = await admin
    .from('relationship_passports')
    .insert({
      relationship_id: relationship.id,
      partner1_love_languages: loveLanguages,
      partner1_interests: interests
    })

  if (passportError) {
    console.error('Passport error:', passportError)
    return { error: 'Không thể tạo relationship passport.' }
  }

  // Upsert user profile
  const { error: upsertUserError } = await admin
    .from('users')
    .upsert({
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || '',
      city: city
    }, { onConflict: 'id' })

  if (upsertUserError) {
    console.error('Upsert user error:', upsertUserError)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
