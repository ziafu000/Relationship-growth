'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  ACTIVITY_PHOTO_BUCKET,
  activityPhotoExtensionMatchesMime,
  isOwnedActivityPhotoPath,
  validateActivityPhoto,
} from '@/lib/activity-photo'
import { activityStepOrders, completedStepOrders } from '@/lib/execution-steps'

export async function startPlanExecution(planId: string) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'Không tìm thấy user.' }
  }

  type Plan = { relationship_id: string; [key: string]: any }

  // Get plan details
  const { data: plan, error: planError } = await supabase
    .from('plans')
    .select('*')
    .eq('id', planId)
    .single()

  if (planError || !plan) {
    return { error: 'Không tìm thấy plan.' }
  }

  const typedPlan = plan as Plan

  // Create plan execution
  const { data: execution, error: execError } = await supabase
    .from('plan_executions')
    .insert({
      plan_id: planId,
      relationship_id: typedPlan.relationship_id,
      user_id: user.id,
      status: 'started',
      started_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    } as any)
    .select()
    .single()

  if (execError) {
    console.error('Execution error:', execError)
    return { error: 'Không thể bắt đầu thực hiện.' }
  }

  return { execution }
}

export async function setStepCompletion(
  executionId: string,
  stepOrder: number,
  completed: boolean,
) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user || !Number.isInteger(stepOrder) || stepOrder < 1) {
    return { error: 'Không thể cập nhật bước.' }
  }

  const { data: execution, error: executionError } = await supabase
    .from('plan_executions')
    .select('id, plan_id')
    .eq('id', executionId)
    .eq('user_id', user.id)
    .single()

  if (executionError || !execution) {
    return { error: 'Không tìm thấy execution.' }
  }

  const { data: plan, error: planError } = await supabase
    .from('plans')
    .select('steps')
    .eq('id', execution.plan_id)
    .eq('user_id', user.id)
    .single()

  if (planError || !plan || !activityStepOrders(plan.steps).includes(stepOrder)) {
    return { error: 'Bước hoạt động không hợp lệ.' }
  }

  const { data, error } = await supabase.rpc(
    'set_plan_execution_step_completion',
    {
      p_execution_id: executionId,
      p_step_order: stepOrder,
      p_completed: completed,
    },
  )

  if (error) {
    console.error('Set step completion error:', error)
    return { error: 'Không thể cập nhật bước.' }
  }

  revalidatePath(`/activities/${execution.plan_id}`)
  return { success: true, completedSteps: completedStepOrders(data) }
}

export async function attachActivityPhoto(executionId: string, path: string) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'Vui lòng đăng nhập lại.' }
  }

  const { data: execution, error: executionError } = await supabase
    .from('plan_executions')
    .select('id, plan_id, activity_photo_path')
    .eq('id', executionId)
    .eq('user_id', user.id)
    .single()

  if (
    executionError ||
    !execution ||
    !isOwnedActivityPhotoPath(path, user.id, executionId)
  ) {
    return { error: 'Đường dẫn ảnh không hợp lệ.' }
  }

  const { data: fileInfo, error: fileInfoError } = await supabase.storage
    .from(ACTIVITY_PHOTO_BUCKET)
    .info(path)

  const contentType = fileInfo?.contentType || ''
  const validationError = fileInfoError || !fileInfo
    ? 'Không tìm thấy ảnh vừa tải lên.'
    : validateActivityPhoto({ type: contentType, size: fileInfo.size || 0 })

  if (
    validationError ||
    !activityPhotoExtensionMatchesMime(path, contentType)
  ) {
    return { error: validationError || 'Định dạng ảnh không hợp lệ.' }
  }

  const { error: updateError } = await supabase
    .from('plan_executions')
    .update({ activity_photo_path: path })
    .eq('id', executionId)
    .eq('user_id', user.id)

  if (updateError) {
    console.error('Attach activity photo error:', updateError)
    return { error: 'Không thể lưu ảnh hoạt động.' }
  }

  if (execution.activity_photo_path && execution.activity_photo_path !== path) {
    const { error: removeOldError } = await supabase.storage
      .from(ACTIVITY_PHOTO_BUCKET)
      .remove([execution.activity_photo_path])

    if (removeOldError) {
      console.error('Unable to remove replaced activity photo:', removeOldError)
    }
  }

  const { data: signedPhoto, error: signedPhotoError } = await supabase.storage
    .from(ACTIVITY_PHOTO_BUCKET)
    .createSignedUrl(path, 60 * 60)

  revalidatePath(`/activities/${execution.plan_id}`)
  return {
    success: true,
    photoUrl: signedPhotoError ? null : signedPhoto.signedUrl,
  }
}

export async function removeActivityPhoto(executionId: string) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'Vui lòng đăng nhập lại.' }
  }

  const { data: execution, error: executionError } = await supabase
    .from('plan_executions')
    .select('id, plan_id, activity_photo_path')
    .eq('id', executionId)
    .eq('user_id', user.id)
    .single()

  if (executionError || !execution) {
    return { error: 'Không tìm thấy execution.' }
  }

  const { error: updateError } = await supabase
    .from('plan_executions')
    .update({ activity_photo_path: null })
    .eq('id', executionId)
    .eq('user_id', user.id)

  if (updateError) {
    console.error('Remove activity photo reference error:', updateError)
    return { error: 'Không thể gỡ ảnh hoạt động.' }
  }

  if (execution.activity_photo_path) {
    const { error: storageError } = await supabase.storage
      .from(ACTIVITY_PHOTO_BUCKET)
      .remove([execution.activity_photo_path])

    if (storageError) {
      console.error('Remove activity photo object error:', storageError)
    }
  }

  revalidatePath(`/activities/${execution.plan_id}`)
  return { success: true }
}

export async function completePlanExecution(executionId: string) {
  const supabase = await createClient()

  const { error } = await (supabase
    .from('plan_executions') as any)
    .update({
      status: 'completed',
      completed_at: new Date().toISOString()
    })
    .eq('id', executionId)

  if (error) {
    console.error('Complete execution error:', error)
    return { error: 'Không thể hoàn thành.' }
  }

  revalidatePath('/', 'layout')
  redirect(`/feedback?execution_id=${executionId}`)
}

export async function abandonPlanExecution(executionId: string) {
  const supabase = await createClient()

  const { error } = await (supabase
    .from('plan_executions') as any)
    .update({
      status: 'abandoned',
      abandoned_at: new Date().toISOString()
    })
    .eq('id', executionId)

  if (error) {
    console.error('Abandon execution error:', error)
    return { error: 'Không thể hủy.' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
