'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createRelationship(formData: FormData) {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'Không tìm thấy user. Vui lòng đăng nhập lại.' }
  }

  // Get form data
  const relationshipType = formData.get('relationship_type') as string
  const city = formData.get('city') as string
  const loveLanguages = formData.getAll('love_languages') as string[]
  const interests = formData.getAll('interests') as string[]

  // Create relationship
  const { data: relationship, error: relationshipError } = await supabase
    .from('relationships')
    .insert({
      relationship_type: relationshipType,
      mode: 'solo',
      status: 'active'
    })
    .select()
    .single()

  if (relationshipError) {
    console.error('Relationship error:', relationshipError)
    return { error: 'Không thể tạo relationship. Vui lòng thử lại.' }
  }

  // Create relationship member
  const { error: memberError } = await supabase
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

  // Create relationship passport
  const { error: passportError } = await supabase
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

  // Update user city
  const { error: updateError } = await supabase
    .from('users')
    .update({ city })
    .eq('id', user.id)

  if (updateError) {
    console.error('Update user error:', updateError)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
