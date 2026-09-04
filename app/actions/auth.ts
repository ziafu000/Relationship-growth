'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAuthenticatedLandingPath } from '@/lib/auth-routing'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword(data)

  if (error || !authData.user) {
    return { error: error?.message || 'Không thể đăng nhập.' }
  }

  const { data: membership, error: membershipError } = await supabase
    .from('relationship_members')
    .select('relationship_id')
    .eq('user_id', authData.user.id)
    .limit(1)
    .maybeSingle()

  if (membershipError) {
    console.error('Membership lookup error after login:', membershipError)
    return { error: 'Không thể kiểm tra trạng thái onboarding. Vui lòng thử lại.' }
  }

  revalidatePath('/', 'layout')
  redirect(
    getAuthenticatedLandingPath(
      Boolean(membership),
      formData.get('redirect') as string | null,
    ),
  )
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  const data = {
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
      // Option A: Disable email confirmation completely (development)
      // data: { email_confirm: false }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  // Remove Option B block completely
  return { success: true }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
