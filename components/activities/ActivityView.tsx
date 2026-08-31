'use client'

import { useState } from 'react'
import { completeStep, completePlanExecution, abandonPlanExecution } from '@/app/actions/executions'

import { Timeline, TimelineItem } from '@/components/ui/timeline'
import { PolaroidCard } from '@/components/ui/polaroid-card'

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
              className="text-lg font-light text-gray-600 hover:text-orange-500 transition-colors"
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
                className="h-full bg-orange-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Title Card as Polaroid */}
        <div className="flex justify-center mb-10">
          <PolaroidCard
            caption={plan.plan_title_vi}
            subcaption={plan.estimated_time_minutes ? `⏱️ ${plan.estimated_time_minutes} phút` : 'Hoạt động'}
            tilt="left"
            imageUrl={plan.image_url}
          />
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
                {steps.map((step: any, index: number) => {
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
                          className={`w-12 h-12 flex items-center justify-center text-xl font-bold shadow-sm border transition-colors md:ml-auto ${
                            isCompleted ? 'bg-orange-500 text-white border-orange-600' : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
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
              {conversationStarters.map((prompt: any, index: number) => (
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
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-handwriting text-2xl py-4 px-6 shadow-md transition-colors"
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
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-handwriting text-xl py-3 px-6 shadow-md transition-colors"
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
