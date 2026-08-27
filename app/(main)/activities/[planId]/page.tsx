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
        <div className="min-h-screen bg-[#F7F4EF] flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl p-8 border border-[#E7E1D7] max-w-md text-center">
            <div className="text-4xl mb-4">😔</div>
            <h2 className="font-serif text-2xl text-[#1F2421] mb-3">Có lỗi xảy ra</h2>
            <p className="text-[#5C635D] font-light mb-6">{result.error}</p>
            <a
              href="/dashboard"
              className="inline-block px-6 py-3 bg-[#C4612F] text-white rounded-full font-light hover:bg-[#A94E22] transition-all"
            >
              Về Dashboard
            </a>
          </div>
        </div>
      )
    }
    execution = result.execution
  }

  return <ActivityView plan={plan} execution={execution} />
}
