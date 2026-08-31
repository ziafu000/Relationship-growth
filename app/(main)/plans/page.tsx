import { createPlans } from '@/app/actions/plans'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function PlansPage({
  searchParams,
}: {
  searchParams: Promise<{ goal_id?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const goalId = resolvedSearchParams.goal_id

  if (!goalId) {
    redirect('/check-in')
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if plans already exist for this goal
  const { data: existingPlans } = await supabase
    .from('plans')
    .select('*')
    .eq('goal_id', goalId)
    .order('rank', { ascending: true })

  if (existingPlans && existingPlans.length > 0) {
    // Plans already generated, show them
    redirect(`/plans/${goalId}`)
  }

  // If plans don't exist, provide a CTA to generate them securely via form POST
  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="bg-white p-6 shadow-md border border-gray-200 max-w-md text-center transform rotate-1">
        <h2 className="font-handwriting text-3xl font-bold text-gray-800 mb-3">
          Sẵn sàng tạo kế hoạch?
        </h2>
        <p className="text-gray-600 font-light mb-6 font-handwriting text-lg">
          Nhấn nút bên dưới để tạo các kế hoạch hành động.
        </p>
        <form action={async () => {
          'use server'
          const res = await createPlans(goalId)
          if (res.error) {
            redirect(`/dashboard?error=${encodeURIComponent(res.error)}`)
          }
          redirect(`/plans/${goalId}`)
        }}>
          <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-handwriting text-xl py-3 px-6 shadow-md transition-colors w-full">
            Tạo kế hoạch
          </button>
        </form>
      </div>
    </div>
  )
}
