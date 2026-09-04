'use client'

import { useState, useEffect } from 'react'
import { selectPlan, rejectPlan, markPlanViewed } from '@/app/actions/plans'

interface Plan {
  id: string
  plan_title_vi: string
  reasoning_vi: string
  estimated_time_minutes: number | null
  effort_level: string | null
  steps: any
  conversation_starters: any | null
  tips: any | null
  rank: number
}

import { Timeline, TimelineItem } from '@/components/ui/timeline'

export default function PlanCard({ plan, isActive }: { plan: Plan, isActive: boolean }) {
  const [loading, setLoading] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (isActive) {
      markPlanViewed(plan.id)
    }
  }, [isActive, plan.id])

  async function handleSelect() {
    setLoading(true)
    await selectPlan(plan.id)
  }

  async function handleReject() {
    if (!rejectReason.trim()) return

    setLoading(true)
    const result = await rejectPlan(plan.id, rejectReason)

    if (result.success) {
      setShowRejectDialog(false)
      window.location.reload()
    }
    setLoading(false)
  }

  const effortLabels: Record<string, string> = {
    low: 'Dễ',
    medium: 'Vừa',
    high: 'Cần chuẩn bị'
  }

  const effortColors: Record<string, string> = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-pink-100 text-pink-700'
  }

  return (
    <>
      <div className={`bg-white p-6 shadow-md border border-gray-200 transition-transform ${isActive ? 'ring-4 ring-orange-400 rotate-0' : 'rotate-1'}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap font-handwriting">
              <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 text-sm transform -rotate-2">
                ✨ Lựa chọn {plan.rank}
              </span>
              {plan.effort_level && (
                <span className={`inline-block px-3 py-1 text-xs border ${effortColors[plan.effort_level] || 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                  {effortLabels[plan.effort_level] || plan.effort_level}
                </span>
              )}
              {plan.estimated_time_minutes && (
                <span className="inline-block bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 text-xs transform rotate-2">
                  ⏱️ {plan.estimated_time_minutes} phút
                </span>
              )}
            </div>
            <h3 className="font-handwriting text-2xl font-bold text-gray-800 mb-2">
              {plan.plan_title_vi}
            </h3>
            <p className="text-gray-600 font-light font-handwriting text-lg">
              {plan.reasoning_vi}
            </p>
          </div>
        </div>

        {/* Steps Preview */}
        {plan.steps && Array.isArray(plan.steps) && plan.steps.length > 0 && (
          <div className="mb-6 font-handwriting">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-lg text-orange-700 hover:text-orange-800 transition-colors mb-4"
            >
              {expanded ? '▼' : '▶'} Các bước thực hiện ({plan.steps.length} bước)
            </button>

            {expanded && (
              <Timeline>
                {plan.steps.map((step: any, index: number) => (
                  <TimelineItem 
                    key={index} 
                    isFirst={index === 0}
                    isLast={index === plan.steps.length - 1}
                    end={
                      <p className="text-lg text-gray-700 bg-orange-50 p-3 shadow-sm border border-orange-100 ml-4">
                        {step.instruction_vi}
                      </p>
                    }
                  />
                ))}
              </Timeline>
            )}
          </div>
        )}

        {/* Conversation Starters */}
        {expanded && plan.conversation_starters && Array.isArray(plan.conversation_starters) && plan.conversation_starters.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 shadow-sm font-handwriting transform -rotate-1">
            <h4 className="text-lg font-bold text-yellow-800 mb-2">
              💬 Câu hỏi gợi ý
            </h4>
            <ul className="space-y-2">
              {plan.conversation_starters.slice(0, 3).map((prompt: any, index: number) => (
                <li key={index} className="text-lg text-yellow-700">
                  • {prompt.prompt_vi}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSelect}
            disabled={loading}
            className="flex-1 bg-orange-700 hover:bg-orange-800 text-white font-handwriting text-xl py-3 px-6 shadow-md transition-colors"
          >
            {loading ? 'Đang xử lý...' : '🚀 Chọn kế hoạch này'}
          </button>
          <button
            onClick={() => setShowRejectDialog(true)}
            disabled={loading}
            className="border-2 border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-handwriting text-lg py-3 px-6 transition-colors"
          >
            Bỏ qua
          </button>
        </div>
      </div>

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 shadow-lg border border-gray-200 max-w-md w-full transform rotate-1">
            <h3 className="font-handwriting text-2xl font-bold text-gray-800 mb-3">
              Tại sao bạn bỏ qua kế hoạch này?
            </h3>
            <p className="text-lg font-light text-gray-600 mb-4 font-handwriting">
              Giúp chúng tôi cải thiện đề xuất cho lần sau
            </p>

            <div className="space-y-3 mb-6 font-handwriting">
              {[
                'Không có thời gian',
                'Quá tốn kém',
                'Không phù hợp sở thích',
                'Quá phức tạp',
                'Đã làm rồi',
              ].map(reason => (
                <button
                  key={reason}
                  onClick={() => setRejectReason(reason)}
                  className={`w-full p-3 border-2 text-left text-lg transition-colors ${
                    rejectReason === reason
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-white hover:border-orange-300'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectDialog(false)}
                className="flex-1 border-2 border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-handwriting text-lg py-3 px-6 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason || loading}
                className="flex-1 bg-orange-700 hover:bg-orange-800 text-white font-handwriting text-lg py-3 px-6 shadow-md transition-colors disabled:opacity-50"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
