'use client'

import { useRef, useState, useTransition } from 'react'
import {
  setStepCompletion,
  completePlanExecution,
  abandonPlanExecution,
  attachActivityPhoto,
  removeActivityPhoto,
} from '@/app/actions/executions'
import {
  ACTIVITY_PHOTO_BUCKET,
  ACTIVITY_PHOTO_MAX_BYTES,
  ACTIVITY_PHOTO_MIME_TYPES,
  createActivityPhotoPath,
  validateActivityPhoto,
} from '@/lib/activity-photo'
import { createClient } from '@/lib/supabase/client'
import {
  completedStepOrders,
  createStepCompletionController,
} from '@/lib/execution-steps'
import type { Database } from '@/types/database'
import { Timeline, TimelineItem } from '@/components/ui/timeline'
import { PolaroidCard } from '@/components/ui/polaroid-card'

type Plan = Database['public']['Tables']['plans']['Row']
type Execution = Database['public']['Tables']['plan_executions']['Row']
type ActivityStep = { order?: number; instruction_vi?: string }
type ConversationStarter = { prompt_vi?: string }
type ActivityTips = { do?: string[]; dont?: string[] }

interface ActivityViewProps {
  plan: Plan
  execution: Execution
  initialPhotoUrl: string | null
}

export default function ActivityView({
  plan,
  execution,
  initialPhotoUrl,
}: ActivityViewProps) {
  const [loading, setLoading] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>(
    completedStepOrders(execution.steps_completed),
  )
  const [showAbandonDialog, setShowAbandonDialog] = useState(false)
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhotoUrl)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [photoLoading, setPhotoLoading] = useState(false)
  const [, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const stepControllerRef = useRef<ReturnType<typeof createStepCompletionController> | null>(null)

  if (!stepControllerRef.current) {
    stepControllerRef.current = createStepCompletionController(
      completedStepOrders(execution.steps_completed),
      (stepOrder, completed) => setStepCompletion(execution.id, stepOrder, completed),
      setCompletedSteps,
    )
  }

  const steps = Array.isArray(plan.steps) ? plan.steps as ActivityStep[] : []
  const conversationStarters = Array.isArray(plan.conversation_starters)
    ? plan.conversation_starters as ConversationStarter[]
    : []
  const tips = plan.tips && typeof plan.tips === 'object'
    ? plan.tips as ActivityTips
    : null

  function handleStepToggle(stepOrder: number) {
    void stepControllerRef.current?.toggle(stepOrder)
  }

  async function handleComplete() {
    setLoading(true)
    await completePlanExecution(execution.id)
  }

  async function handleAbandon() {
    setLoading(true)
    await abandonPlanExecution(execution.id)
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setPhotoError(null)
    const validationError = validateActivityPhoto({ type: file.type, size: file.size })
    if (validationError) {
      setPhotoError(validationError)
      e.target.value = ''
      return
    }

    setPhotoLoading(true)
    try {
      const supabase = createClient()
      const objectId = crypto.randomUUID()
      const path = createActivityPhotoPath(execution.user_id, execution.id, file.type, objectId)

      const { error: uploadError } = await supabase.storage
        .from(ACTIVITY_PHOTO_BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false })

      if (uploadError) {
        setPhotoError('Không thể tải ảnh lên. Vui lòng thử lại.')
        return
      }

      const result = await attachActivityPhoto(execution.id, path)
      if (result?.error) {
        setPhotoError(result.error)
        // Best-effort cleanup of orphaned object
        startTransition(() => {
          supabase.storage.from(ACTIVITY_PHOTO_BUCKET).remove([path])
        })
      } else {
        setPhotoUrl(result.photoUrl ?? null)
      }
    } finally {
      setPhotoLoading(false)
      e.target.value = ''
    }
  }

  async function handleRemovePhoto() {
    setPhotoLoading(true)
    const result = await removeActivityPhoto(execution.id)
    if (!result?.error) {
      setPhotoUrl(null)
    }
    setPhotoLoading(false)
  }

  const progress = steps.length > 0 ? (completedSteps.length / steps.length) * 100 : 0
  const allStepsCompleted = steps.length > 0 && completedSteps.length === steps.length

  const acceptMimes = ACTIVITY_PHOTO_MIME_TYPES.join(',')
  const maxMB = Math.round(ACTIVITY_PHOTO_MAX_BYTES / (1024 * 1024))

  return (
    <div className="min-h-screen bg-orange-50 font-handwriting">
      {/* Floating Decorations */}
      <div className="fixed top-20 right-10 text-6xl opacity-20 float-animation">🌟</div>
      <div className="fixed bottom-32 left-10 text-5xl opacity-20 float-animation" style={{animationDelay: '1s'}}>💪</div>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b-2 border-orange-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-handwriting text-2xl font-bold text-gray-800">
              Đang thực hiện 🚀
            </h1>
            <button
              onClick={() => setShowAbandonDialog(true)}
              className="text-lg font-light text-gray-600 hover:text-orange-700 transition-colors"
            >
              Thoát
            </button>
          </div>
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-lg font-light text-gray-600 mb-1">
              <span>Tiến độ</span>
              <span>{completedSteps.length} / {steps.length} bước</span>
            </div>
            <div className="h-3 bg-gray-200 shadow-inner overflow-hidden border border-gray-300">
              <div
                className="h-full bg-orange-700 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Title Card as Polaroid with photo upload */}
        <div className="flex flex-col items-center mb-10 gap-4">
          <PolaroidCard
            caption={plan.plan_title_vi}
            subcaption={plan.estimated_time_minutes ? `⏱️ ${plan.estimated_time_minutes} phút` : 'Hoạt động'}
            tilt="left"
            imageUrl={photoUrl}
          />

          {/* Photo upload controls */}
          <div className="flex flex-col items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptMimes}
              onChange={handlePhotoChange}
              className="sr-only"
              aria-label="Chọn ảnh hoạt động"
              id="activity-photo-input"
            />
            {photoUrl ? (
              <button
                onClick={handleRemovePhoto}
                disabled={photoLoading}
                className="text-sm text-red-600 hover:text-red-800 underline transition-colors disabled:opacity-50"
              >
                {photoLoading ? 'Đang xử lý...' : '🗑️ Xoá ảnh'}
              </button>
            ) : (
              <label
                htmlFor="activity-photo-input"
                className={`cursor-pointer inline-block bg-white border-2 border-orange-300 hover:border-orange-500 text-orange-700 font-handwriting text-sm py-2 px-4 shadow-sm transition-colors ${photoLoading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {photoLoading ? 'Đang tải ảnh...' : '📷 Thêm ảnh kỷ niệm'}
              </label>
            )}
            <p className="text-xs text-gray-500">JPEG, PNG hoặc WebP · tối đa {maxMB} MB</p>
            {photoError && (
              <p className="text-sm text-red-600" role="alert">{photoError}</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 shadow-md border border-gray-200 mb-8 transform rotate-1">
          <p className="text-gray-600 font-light text-xl text-center">
            {plan.reasoning_vi}
          </p>
        </div>

        {/* Steps */}
        {steps.length > 0 && (
          <div className="mb-10">
            <h3 className="font-handwriting text-2xl font-bold text-gray-800 mb-6 text-center">Các bước thực hiện</h3>
            <div className="bg-white p-6 shadow-md border border-gray-200 transform -rotate-1">
              <Timeline>
                {steps.map((step, index) => {
                  const stepOrder = step.order || index + 1
                  const isCompleted = completedSteps.includes(stepOrder)

                  return (
                    <TimelineItem
                      key={index}
                      isFirst={index === 0}
                      isLast={index === steps.length - 1}
                      start={
                        <button
                          onClick={() => handleStepToggle(stepOrder)}
                          aria-pressed={isCompleted}
                          aria-label={`Bước ${stepOrder}: ${isCompleted ? 'đã hoàn thành, nhấn để bỏ chọn' : 'chưa hoàn thành, nhấn để đánh dấu'}`}
                          className={`w-12 h-12 flex items-center justify-center text-xl font-bold shadow-sm border transition-colors md:ml-auto ${
                            isCompleted ? 'bg-orange-700 text-white border-orange-800' : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          {isCompleted ? '✓' : stepOrder}
                        </button>
                      }
                      end={
                        <div className="ml-4 p-3 bg-orange-50 border border-orange-100 shadow-sm">
                          <p className={`text-xl ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                            {step.instruction_vi}
                          </p>
                        </div>
                      }
                    />
                  )
                })}
              </Timeline>
            </div>
          </div>
        )}

        {/* Conversation Starters */}
        {conversationStarters.length > 0 && (
          <div className="bg-white p-6 shadow-md border border-gray-200 mb-8 transform rotate-1">
            <h3 className="font-handwriting text-2xl font-bold text-gray-800 mb-4 text-center">💬 Câu hỏi gợi ý</h3>
            <div className="space-y-4">
              {conversationStarters.map((prompt, index) => (
                <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 shadow-sm">
                  <p className="text-xl text-yellow-800">{prompt.prompt_vi}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        {tips && (tips.do || tips.dont) && (
          <div className="bg-white p-6 shadow-md border border-gray-200 mb-8 transform -rotate-1">
            <h3 className="font-handwriting text-2xl font-bold text-gray-800 mb-4 text-center">💡 Lưu ý</h3>

            {tips.do && Array.isArray(tips.do) && tips.do.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xl font-bold text-green-700 mb-2">✓ Nên làm:</h4>
                <ul className="space-y-2">
                  {tips.do.map((tip: string, index: number) => (
                    <li key={index} className="text-xl text-gray-700 pl-4 border-l-2 border-green-500">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tips.dont && Array.isArray(tips.dont) && tips.dont.length > 0 && (
              <div>
                <h4 className="text-xl font-bold text-red-700 mb-2">✗ Không nên:</h4>
                <ul className="space-y-2">
                  {tips.dont.map((tip: string, index: number) => (
                    <li key={index} className="text-xl text-gray-700 pl-4 border-l-2 border-red-500">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Complete Button */}
        <div className="bg-white p-8 shadow-md border border-gray-200 mt-10">
          {allStepsCompleted ? (
            <>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4 emoji-bounce">🎉</div>
                <p className="font-handwriting text-3xl font-bold text-gray-800 mb-2">Hoàn thành!</p>
                <p className="text-xl text-gray-600">
                  Chia sẻ trải nghiệm để nhận đề xuất tốt hơn lần sau
                </p>
              </div>
              <button
                onClick={handleComplete}
                disabled={loading}
                className="w-full bg-orange-700 hover:bg-orange-800 text-white font-handwriting text-2xl py-4 px-6 shadow-md transition-colors"
              >
                {loading ? 'Đang xử lý...' : '💌 Gửi feedback'}
              </button>
            </>
          ) : (
            <div className="text-center">
              <p className="text-xl text-gray-600 mb-4">
                Hoàn thành tất cả các bước để tiếp tục
              </p>
              <div className="text-3xl text-gray-300">⬆️</div>
            </div>
          )}
        </div>
      </div>

      {/* Abandon Dialog */}
      {showAbandonDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 shadow-lg border border-gray-200 max-w-md w-full transform rotate-1">
            <h3 className="font-handwriting text-2xl font-bold text-gray-800 mb-3">
              Bạn có chắc muốn thoát?
            </h3>
            <p className="text-xl text-gray-600 mb-6">
              Tiến độ của bạn sẽ không được lưu
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowAbandonDialog(false)}
                className="flex-1 border-2 border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-handwriting text-xl py-3 px-6 transition-colors"
              >
                Tiếp tục
              </button>
              <button
                onClick={handleAbandon}
                disabled={loading}
                className="flex-1 bg-orange-700 hover:bg-orange-800 text-white font-handwriting text-xl py-3 px-6 shadow-md transition-colors"
              >
                Thoát
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
