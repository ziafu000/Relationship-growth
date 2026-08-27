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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center px-4">
        <div className="bubble-card bg-gradient-to-br from-white to-pink-50/30 max-w-md">
          <div className="text-center">
            <div className="text-4xl mb-4 emoji-bounce">😔</div>
            <h2 className="font-heading text-2xl font-bold text-gray-800 mb-3">
              Có lỗi xảy ra
            </h2>
            <p className="text-gray-600 font-light mb-6">
              {result.error}
            </p>
            <a
              href="/dashboard"
              className="btn-bubble btn-primary inline-block"
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
