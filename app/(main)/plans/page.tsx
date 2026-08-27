import { createPlans } from '@/app/actions/plans'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function PlansPage({
  searchParams,
}: {
  searchParams: { goal_id?: string }
}) {
  const goalId = searchParams.goal_id

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

  // Generate plans
  const result = await createPlans(goalId)

  if (result.error) {
    return (
      <div className="min-h-screen bg-[#F7F4EF] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 border border-[#E7E1D7] max-w-md">
          <div className="text-center">
            <div className="text-4xl mb-4">😔</div>
            <h2 className="font-serif text-2xl text-[#1F2421] mb-3">
              Có lỗi xảy ra
            </h2>
            <p className="text-[#5C635D] font-light mb-6">
              {result.error}
            </p>
            <a
              href="/dashboard"
              className="inline-block px-6 py-3 bg-[#C4612F] text-white rounded-full font-light hover:bg-[#A94E22] transition-all"
            >
              Về Dashboard
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Redirect to plans view
  redirect(`/plans/${goalId}`)
}
