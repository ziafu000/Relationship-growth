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
    <div className="min-h-screen bg-[#F7F4EF]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#E7E1D7]">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-xl tracking-tight text-[#1F2421]">
              Đang thực hiện
            </h1>
            <button
              onClick={() => setShowAbandonDialog(true)}
              className="text-sm font-light text-[#5C635D] hover:text-[#C4612F] transition-colors"
            >
              Thoát
            </button>
          </div>
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs font-light text-[#5C635D] mb-1">
              <span>Tiến độ</span>
              <span>{completedSteps.length} / {steps.length} bước</span>
            </div>
            <div className="h-1.5 bg-[#E7E1D7] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C4612F] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Title Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E7E1D7] mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-[#F2E3D6] text-[#C4612F] text-xs font-medium mb-3">
            {plan.estimated_time_minutes ? `${plan.estimated_time_minutes} phút` : 'Hoạt động'}
          </span>
          <h2 className="font-serif text-3xl tracking-tight text-[#1F2421] mb-3">
            {plan.plan_title_vi}
          </h2>
          <p className="text-[#5C635D] font-light">
            {plan.reasoning_vi}
          </p>
        </div>

        {/* Steps */}
        {steps.length > 0 && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E7E1D7] mb-6">
            <h3 className="font-serif text-xl text-[#1F2421] mb-6">Các bước thực hiện</h3>
            <div className="space-y-4">
              {steps.map((step: any, index: number) => {
                const stepOrder = step.order || index + 1
                const isCompleted = completedSteps.includes(stepOrder)

                return (
                  <button
                    key={index}
                    onClick={() => handleStepToggle(stepOrder)}
                    className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                      isCompleted
                        ? 'border-[#C4612F] bg-[#F2E3D6]'
                        : 'border-[#E7E1D7] bg-white hover:border-[#C4612F]/30'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      isCompleted
                        ? 'bg-[#C4612F] text-white'
                        : 'bg-[#E7E1D7] text-[#5C635D]'
                    }`}>
                      {isCompleted ? '✓' : stepOrder}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className={`font-light ${isCompleted ? 'text-[#1F2421]' : 'text-[#5C635D]'}`}>
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
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E7E1D7] mb-6">
            <h3 className="font-serif text-xl text-[#1F2421] mb-4">💬 Câu hỏi gợi ý</h3>
            <div className="space-y-3">
              {conversationStarters.map((prompt: any, index: number) => (
                <div key={index} className="p-4 bg-[#F7F4EF] rounded-xl">
                  <p className="font-light text-[#5C635D]">{prompt.prompt_vi}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        {tips && (tips.do || tips.dont) && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E7E1D7] mb-6">
            <h3 className="font-serif text-xl text-[#1F2421] mb-4">💡 Lưu ý</h3>

            {tips.do && Array.isArray(tips.do) && tips.do.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-green-700 mb-2">✓ Nên làm:</h4>
                <ul className="space-y-1">
                  {tips.do.map((tip: string, index: number) => (
                    <li key={index} className="text-sm font-light text-[#5C635D] pl-4">
                      • {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tips.dont && Array.isArray(tips.dont) && tips.dont.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-red-700 mb-2">✗ Không nên:</h4>
                <ul className="space-y-1">
                  {tips.dont.map((tip: string, index: number) => (
                    <li key={index} className="text-sm font-light text-[#5C635D] pl-4">
                      • {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Complete Button */}
        <div className="bg-white rounded-3xl p-6 border border-[#E7E1D7]">
          {allStepsCompleted ? (
            <>
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-lg font-serif text-[#1F2421] mb-2">Hoàn thành!</p>
                <p className="text-sm font-light text-[#5C635D]">
                  Chia sẻ trải nghiệm để nhận đề xuất tốt hơn lần sau
                </p>
              </div>
              <button
                onClick={handleComplete}
                disabled={loading}
                className="w-full px-6 py-3 bg-[#C4612F] text-white rounded-full font-light hover:bg-[#A94E22] transition-all hover:translate-y-[-2px] disabled:opacity-50"
              >
                {loading ? 'Đang xử lý...' : 'Gửi feedback'}
              </button>
            </>
          ) : (
            <div className="text-center">
              <p className="text-sm font-light text-[#5C635D] mb-3">
                Hoàn thành tất cả các bước để tiếp tục
              </p>
              <div className="text-2xl text-[#E7E1D7]">⬆️</div>
            </div>
          )}
        </div>
      </div>

      {/* Abandon Dialog */}
      {showAbandonDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full">
            <h3 className="font-serif text-xl text-[#1F2421] mb-3">
              Bạn có chắc muốn thoát?
            </h3>
            <p className="text-sm font-light text-[#5C635D] mb-6">
              Tiến độ của bạn sẽ không được lưu
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAbandonDialog(false)}
                className="flex-1 px-4 py-2 border border-[#E7E1D7] text-[#5C635D] rounded-full font-light"
              >
                Tiếp tục
              </button>
              <button
                onClick={handleAbandon}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-[#C4612F] text-white rounded-full font-light hover:bg-[#A94E22] transition-all disabled:opacity-50"
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
