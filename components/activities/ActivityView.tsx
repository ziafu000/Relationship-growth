'use client'

import { useState } from 'react'
import { completeStep, completePlanExecution, abandonPlanExecution } from '@/app/actions/executions'

interface ActivityViewProps {
  plan: any
  execution: any
}

export default function ActivityView({ plan, execution }: ActivityViewProps) {
  const [loading, setLoading] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>(
    execution.steps_completed?.map((s: any) => s.step_id) || []
  )
  const [showAbandonDialog, setShowAbandonDialog] = useState(false)

  const steps = Array.isArray(plan.steps) ? plan.steps : []
  const conversationStarters = Array.isArray(plan.conversation_starters) ? plan.conversation_starters : []
  const tips = plan.tips

  async function handleStepToggle(stepOrder: number) {
    if (completedSteps.includes(stepOrder)) {
      setCompletedSteps(completedSteps.filter(s => s !== stepOrder))
    } else {
      setCompletedSteps([...completedSteps, stepOrder])
      await completeStep(execution.id, stepOrder)
    }
  }

  async function handleComplete() {
    setLoading(true)
    await completePlanExecution(execution.id)
  }

  async function handleAbandon() {
    setLoading(true)
    await abandonPlanExecution(execution.id)
  }

  const progress = steps.length > 0 ? (completedSteps.length / steps.length) * 100 : 0
  const allStepsCompleted = steps.length > 0 && completedSteps.length === steps.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Floating Decorations */}
      <div className="fixed top-20 right-10 text-6xl opacity-20 float-animation">🌟</div>
      <div className="fixed bottom-32 left-10 text-5xl opacity-20 float-animation" style={{animationDelay: '1s'}}>💪</div>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b-2 border-green-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-heading text-xl font-bold text-gray-800">
              Đang thực hiện 🚀
            </h1>
            <button
              onClick={() => setShowAbandonDialog(true)}
              className="text-sm font-light text-gray-600 hover:text-primary transition-colors"
            >
              Thoát
            </button>
          </div>
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs font-light text-gray-600 mb-1">
              <span>Tiến độ</span>
              <span>{completedSteps.length} / {steps.length} bước</span>
            </div>
            <div className="h-2 bg-white/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent-purple transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Title Card */}
        <div className="bubble-card bg-gradient-to-br from-white to-green-50/30 mb-6">
          <span className="badge-bubble badge-green mb-3">
            ⏱️ {plan.estimated_time_minutes ? `${plan.estimated_time_minutes} phút` : 'Hoạt động'}
          </span>
          <h2 className="font-heading text-3xl font-bold text-gray-800 mb-3">
            {plan.plan_title_vi}
          </h2>
          <p className="text-gray-600 font-light">
            {plan.reasoning_vi}
          </p>
        </div>

        {/* Steps */}
        {steps.length > 0 && (
          <div className="bubble-card bg-gradient-to-br from-white to-blue-50/30 mb-6">
            <h3 className="font-heading text-xl font-bold text-gray-800 mb-6">Các bước thực hiện</h3>
            <div className="space-y-4">
              {steps.map((step: any, index: number) => {
                const stepOrder = step.order || index + 1
                const isCompleted = completedSteps.includes(stepOrder)

                return (
                  <button
                    key={index}
                    onClick={() => handleStepToggle(stepOrder)}
                    className={`w-full flex items-start gap-4 p-4 rounded-[20px] border-2 text-left transition-all ${
                      isCompleted
                        ? 'border-primary bg-bubble-green shadow-bubble'
                        : 'border-green-200 bg-white hover:border-primary/50 hover:shadow-bubble-md'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all font-bold ${
                      isCompleted
                        ? 'bg-primary text-white'
                        : 'bg-green-100 text-gray-600'
                    }`}>
                      {isCompleted ? '✓' : stepOrder}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className={`font-light ${isCompleted ? 'text-gray-800 line-through opacity-70' : 'text-gray-700'}`}>
                        {step.instruction_vi}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Conversation Starters */}
        {conversationStarters.length > 0 && (
          <div className="bubble-card bg-gradient-to-br from-white to-purple-50/30 mb-6">
            <h3 className="font-heading text-xl font-bold text-gray-800 mb-4">💬 Câu hỏi gợi ý</h3>
            <div className="space-y-3">
              {conversationStarters.map((prompt: any, index: number) => (
                <div key={index} className="p-4 bg-purple-50 border-2 border-purple-200 rounded-[20px]">
                  <p className="font-light text-purple-800">{prompt.prompt_vi}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        {tips && (tips.do || tips.dont) && (
          <div className="bubble-card bg-gradient-to-br from-white to-yellow-50/30 mb-6">
            <h3 className="font-heading text-xl font-bold text-gray-800 mb-4">💡 Lưu ý</h3>

            {tips.do && Array.isArray(tips.do) && tips.do.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-green-700 mb-2">✓ Nên làm:</h4>
                <ul className="space-y-1">
                  {tips.do.map((tip: string, index: number) => (
                    <li key={index} className="text-sm font-light text-gray-700 pl-4">
                      • {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tips.dont && Array.isArray(tips.dont) && tips.dont.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-red-700 mb-2">✗ Không nên:</h4>
                <ul className="space-y-1">
                  {tips.dont.map((tip: string, index: number) => (
                    <li key={index} className="text-sm font-light text-gray-700 pl-4">
                      • {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Complete Button */}
        <div className="bubble-card bg-gradient-to-br from-white to-pink-50/30">
          {allStepsCompleted ? (
            <>
              <div className="text-center mb-4">
                <div className="text-5xl mb-3 emoji-bounce">🎉</div>
                <p className="font-heading text-2xl font-bold text-gray-800 mb-2">Hoàn thành!</p>
                <p className="text-sm font-light text-gray-600">
                  Chia sẻ trải nghiệm để nhận đề xuất tốt hơn lần sau
                </p>
              </div>
              <button
                onClick={handleComplete}
                disabled={loading}
                className="btn-bubble btn-primary w-full"
              >
                {loading ? 'Đang xử lý...' : '💌 Gửi feedback'}
              </button>
            </>
          ) : (
            <div className="text-center">
              <p className="text-sm font-light text-gray-600 mb-3">
                Hoàn thành tất cả các bước để tiếp tục
              </p>
              <div className="text-2xl text-gray-300">⬆️</div>
            </div>
          )}
        </div>
      </div>

      {/* Abandon Dialog */}
      {showAbandonDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bubble-card bg-gradient-to-br from-white to-pink-50/30 max-w-md w-full">
            <h3 className="font-heading text-xl font-bold text-gray-800 mb-3">
              Bạn có chắc muốn thoát?
            </h3>
            <p className="text-sm font-light text-gray-600 mb-6">
              Tiến độ của bạn sẽ không được lưu
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAbandonDialog(false)}
                className="btn-bubble bg-white border-2 border-gray-200 text-gray-700 hover:border-primary hover:bg-white flex-1"
              >
                Tiếp tục
              </button>
              <button
                onClick={handleAbandon}
                disabled={loading}
                className="btn-bubble btn-primary flex-1"
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
