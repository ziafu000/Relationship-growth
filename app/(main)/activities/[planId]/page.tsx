import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { startPlanExecution } from '@/app/actions/executions'
import ActivityView from '@/components/activities/ActivityView'
import {
  ACTIVITY_PHOTO_BUCKET,
  isOwnedActivityPhotoPath,
} from '@/lib/activity-photo'

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ planId: string }>
}) {
  const resolvedParams = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get plan details
  const { data: plan, error: planError } = await supabase
    .from('plans')
    .select('*')
    .eq('id', resolvedParams.planId)
    .single()

  if (planError || !plan) {
    redirect('/dashboard')
  }

  // Check if execution already exists
  const { data: existingExecution } = await supabase
    .from('plan_executions')
    .select('*')
    .eq('plan_id', resolvedParams.planId)
    .eq('user_id', user.id)
    .single()

  let execution = existingExecution

  // Create execution if not exists
  if (!execution) {
    const result = await startPlanExecution(resolvedParams.planId)
    if (result.error) {
      return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
          <div className="bg-white p-6 shadow-md border border-gray-200 max-w-md text-center transform -rotate-1">
            <div className="text-4xl mb-4 emoji-bounce">😔</div>
            <h2 className="font-handwriting text-3xl font-bold text-gray-800 mb-3">Có lỗi xảy ra</h2>
            <p className="text-gray-600 font-light mb-6 font-handwriting text-lg">{result.error}</p>
            <a
              href="/dashboard"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-handwriting text-xl py-3 px-6 shadow-md transition-colors w-full"
            >
              Về Dashboard
            </a>
          </div>
        </div>
      )
    }
    execution = result.execution || null
  }

  if (!execution) {
    redirect('/dashboard')
  }

  let initialPhotoUrl: string | null = null
  if (
    execution.activity_photo_path &&
    isOwnedActivityPhotoPath(
      execution.activity_photo_path,
      user.id,
      execution.id,
    )
  ) {
    const { data: signedPhoto, error: signedPhotoError } = await supabase.storage
      .from(ACTIVITY_PHOTO_BUCKET)
      .createSignedUrl(execution.activity_photo_path, 60 * 60)

    if (!signedPhotoError) {
      initialPhotoUrl = signedPhoto.signedUrl
    }
  }

  return (
    <ActivityView
      plan={plan}
      execution={execution}
      initialPhotoUrl={initialPhotoUrl}
    />
  )
}
