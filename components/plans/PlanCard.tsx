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
      <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-[#E7E1D7] hover:border-[#C4612F] transition-all">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block px-2 py-1 rounded-full bg-[#F2E3D6] text-[#C4612F] text-xs font-medium">
                Lựa chọn {plan.rank}
              </span>
              {plan.effort_level && (
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${effortColors[plan.effort_level] || 'bg-gray-100 text-gray-700'}`}>
                  {effortLabels[plan.effort_level] || plan.effort_level}
                </span>
              )}
              {plan.estimated_time_minutes && (
                <span className="inline-block px-2 py-1 rounded-full bg-[#E7E1D7] text-[#5C635D] text-xs font-medium">
                  {plan.estimated_time_minutes} phút
                </span>
              )}
            </div>
            <h3 className="font-serif text-2xl tracking-tight text-[#1F2421] mb-2">
              {plan.plan_title_vi}
            </h3>
            <p className="text-[#5C635D] font-light">
              {plan.reasoning_vi}
            </p>
          </div>
        </div>

        {/* Steps Preview */}
        {plan.steps && Array.isArray(plan.steps) && plan.steps.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-sm font-medium text-[#C4612F] hover:text-[#A94E22] transition-colors mb-3"
            >
              {expanded ? '▼' : '▶'} Các bước thực hiện ({plan.steps.length} bước)
            </button>

            {expanded && (
              <div className="space-y-3 pl-6 border-l-2 border-[#E7E1D7]">
                {plan.steps.map((step: any, index: number) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#F2E3D6] flex items-center justify-center text-[#C4612F] text-xs font-medium flex-shrink-0">
                      {step.order || index + 1}
                    </div>
                    <p className="text-sm font-light text-[#5C635D] pt-1">
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
          <div className="mb-6 p-4 bg-[#F7F4EF] rounded-xl">
            <h4 className="text-sm font-medium text-[#1F2421] mb-2">
              💬 Câu hỏi gợi ý
            </h4>
            <ul className="space-y-2">
              {plan.conversation_starters.slice(0, 3).map((prompt: any, index: number) => (
                <li key={index} className="text-sm font-light text-[#5C635D]">
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
            className="flex-1 px-6 py-3 bg-[#C4612F] text-white rounded-full font-light hover:bg-[#A94E22] transition-all hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? 'Đang xử lý...' : 'Chọn kế hoạch này'}
          </button>
          <button
            onClick={() => setShowRejectDialog(true)}
            disabled={loading}
            className="px-6 py-3 border border-[#E7E1D7] text-[#5C635D] rounded-full font-light hover:border-[#C4612F] transition-all disabled:opacity-50"
          >
            Bỏ qua
          </button>
        </div>
      </div>

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full">
            <h3 className="font-serif text-xl text-[#1F2421] mb-3">
              Tại sao bạn bỏ qua kế hoạch này?
            </h3>
            <p className="text-sm font-light text-[#5C635D] mb-4">
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
                  className={`w-full p-3 rounded-xl border-2 text-left text-sm transition-all ${
                    rejectReason === reason
                      ? 'border-[#C4612F] bg-[#F2E3D6]'
                      : 'border-[#E7E1D7] bg-white hover:border-[#C4612F]/30'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectDialog(false)}
                className="flex-1 px-4 py-2 border border-[#E7E1D7] text-[#5C635D] rounded-full font-light"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason || loading}
                className="flex-1 px-4 py-2 bg-[#C4612F] text-white rounded-full font-light hover:bg-[#A94E22] transition-all disabled:opacity-50"
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
