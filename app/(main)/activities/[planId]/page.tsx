import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { startPlanExecution } from '@/app/actions/executions'
import ActivityView from '@/components/activities/ActivityView'

export default async function ActivityPage({
  params,
}: {
  params: { planId: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get plan details
  const { data: plan, error: planError } = await supabase
    .from('plans')
    .select('*')
    .eq('id', params.planId)
    .single()

  if (planError || !plan) {
    redirect('/dashboard')
  }

  // Check if execution already exists
  const { data: existingExecution } = await supabase
    .from('plan_executions')
    .select('*')
    .eq('plan_id', params.planId)
    .eq('user_id', user.id)
    .single()

  let execution = existingExecution

  // Create execution if not exists
  if (!execution) {
    const result = await startPlanExecution(params.planId)
    if (result.error) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center px-4">
          <div className="bubble-card bg-gradient-to-br from-white to-pink-50/30 max-w-md text-center">
            <div className="text-4xl mb-4 emoji-bounce">😔</div>
            <h2 className="font-heading text-2xl font-bold text-gray-800 mb-3">Có lỗi xảy ra</h2>
            <p className="text-gray-600 font-light mb-6">{result.error}</p>
            <a
              href="/dashboard"
              className="btn-bubble btn-primary inline-block"
            >
              Về Dashboard
            </a>
          </div>
        </div>
      )
    }
    execution = result.execution || null
  }

  return <ActivityView plan={plan as any} execution={execution as any} />
}
