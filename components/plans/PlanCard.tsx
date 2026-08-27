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
    high: 'bg-orange-100 text-orange-700'
  }

  return (
    <>
      <div className="bubble-card bg-gradient-to-br from-white to-pink-50/20 hover:shadow-bubble-lg transition-all">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="badge-bubble badge-pink">
                ✨ Lựa chọn {plan.rank}
              </span>
              {plan.effort_level && (
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${effortColors[plan.effort_level] || 'bg-gray-100 text-gray-700'}`}>
                  {effortLabels[plan.effort_level] || plan.effort_level}
                </span>
              )}
              {plan.estimated_time_minutes && (
                <span className="badge-bubble badge-blue">
                  ⏱️ {plan.estimated_time_minutes} phút
                </span>
              )}
            </div>
            <h3 className="font-heading text-2xl font-bold text-gray-800 mb-2">
              {plan.plan_title_vi}
            </h3>
            <p className="text-gray-600 font-light">
              {plan.reasoning_vi}
            </p>
          </div>
        </div>

        {/* Steps Preview */}
        {plan.steps && Array.isArray(plan.steps) && plan.steps.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-pink-600 transition-colors mb-3"
            >
              {expanded ? '▼' : '▶'} Các bước thực hiện ({plan.steps.length} bước)
            </button>

            {expanded && (
              <div className="space-y-3 pl-6 border-l-2 border-pink-200">
                {plan.steps.map((step: any, index: number) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-bubble-pink flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                      {step.order || index + 1}
                    </div>
                    <p className="text-sm font-light text-gray-600 pt-1">
                      {step.instruction_vi}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Conversation Starters */}
        {expanded && plan.conversation_starters && Array.isArray(plan.conversation_starters) && plan.conversation_starters.length > 0 && (
          <div className="mb-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-[20px]">
            <h4 className="text-sm font-semibold text-purple-800 mb-2">
              💬 Câu hỏi gợi ý
            </h4>
            <ul className="space-y-2">
              {plan.conversation_starters.slice(0, 3).map((prompt: any, index: number) => (
                <li key={index} className="text-sm font-light text-purple-700">
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
            className="btn-bubble btn-primary flex-1"
          >
            {loading ? 'Đang xử lý...' : '🚀 Chọn kế hoạch này'}
          </button>
          <button
            onClick={() => setShowRejectDialog(true)}
            disabled={loading}
            className="btn-bubble bg-white border-2 border-gray-200 text-gray-700 hover:border-primary hover:bg-white px-6"
          >
            Bỏ qua
          </button>
        </div>
      </div>

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bubble-card bg-gradient-to-br from-white to-pink-50/30 max-w-md w-full">
            <h3 className="font-heading text-xl font-bold text-gray-800 mb-3">
              Tại sao bạn bỏ qua kế hoạch này?
            </h3>
            <p className="text-sm font-light text-gray-600 mb-4">
              Giúp chúng tôi cải thiện đề xuất cho lần sau
            </p>

            <div className="space-y-2 mb-6">
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
                  className={`w-full p-3 rounded-[20px] border-2 text-left text-sm transition-all ${
                    rejectReason === reason
                      ? 'border-primary bg-bubble-pink shadow-bubble'
                      : 'border-pink-200 bg-white hover:border-primary/50'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectDialog(false)}
                className="btn-bubble bg-white border-2 border-gray-200 text-gray-700 hover:border-primary hover:bg-white flex-1"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason || loading}
                className="btn-bubble btn-primary flex-1"
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
