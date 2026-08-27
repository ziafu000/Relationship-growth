'use client'

import { useState, useEffect } from 'react'
import { selectGoal } from '@/app/actions/goals'
import { useSearchParams } from 'next/navigation'

const GOALS = [
  {
    id: 'understanding',
    title: 'Hiểu nhau sâu sắc hơn',
    description: 'Khám phá suy nghĩ, cảm xúc và mong muốn của nhau',
    icon: '🧠',
    color: 'bg-blue-50 border-blue-200',
  },
  {
    id: 'communication',
    title: 'Giao tiếp tốt hơn',
    description: 'Lắng nghe, chia sẻ và giải quyết xung đột hiệu quả',
    icon: '💬',
    color: 'bg-green-50 border-green-200',
  },
  {
    id: 'appreciation',
    title: 'Thể hiện sự trân trọng',
    description: 'Bày tỏ lòng biết ơn và công nhận giá trị của nhau',
    icon: '💝',
    color: 'bg-pink-50 border-pink-200',
  },
  {
    id: 'connection',
    title: 'Kết nối cảm xúc',
    description: 'Tăng cường sự gần gũi và thân mật',
    icon: '🤝',
    color: 'bg-purple-50 border-purple-200',
  },
  {
    id: 'novelty',
    title: 'Trải nghiệm mới',
    description: 'Cùng nhau khám phá và thử những điều chưa làm',
    icon: '✨',
    color: 'bg-yellow-50 border-yellow-200',
  },
  {
    id: 'repair',
    title: 'Hàn gắn và sửa chữa',
    description: 'Giải quyết vấn đề và củng cố mối quan hệ',
    icon: '🔧',
    color: 'bg-red-50 border-red-200',
  },
]

export default function GoalsPage() {
  const searchParams = useSearchParams()
  const checkInId = searchParams.get('check_in_id')

  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!checkInId) {
      window.location.href = '/check-in'
    }
  }, [checkInId])

  async function handleSubmit() {
    if (!selectedGoal || !checkInId) return

    setLoading(true)
    setError(null)

    const goal = GOALS.find(g => g.id === selectedGoal)
    if (!goal) return

    const formData = new FormData()
    formData.append('check_in_id', checkInId)
    formData.append('goal_type', goal.id)
    formData.append('goal_description', goal.description)

    const result = await selectGoal(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  if (!checkInId) return null

  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#E7E1D7]">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="font-serif text-xl tracking-tight text-[#1F2421]">
            Chọn mục tiêu
          </h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-8 border border-[#E7E1D7]">
          <span className="inline-block px-3 py-1 rounded-full bg-[#F2E3D6] text-[#C4612F] text-xs font-medium mb-4">
            Bước tiếp theo
          </span>
          <h2 className="font-serif text-3xl tracking-tight text-[#1F2421] mb-3">
            Bạn muốn cải thiện <span className="italic text-[#C4612F]">điều gì</span> nhất?
          </h2>
          <p className="text-[#5C635D] font-light mb-8">
            Chọn 1 mục tiêu để nhận 3 kế hoạch hành động được cá nhân hóa
          </p>

          <div className="grid gap-4 mb-8">
            {GOALS.map(goal => (
              <button
                key={goal.id}
                type="button"
                onClick={() => setSelectedGoal(goal.id)}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                  selectedGoal === goal.id
                    ? 'border-[#C4612F] bg-[#F2E3D6]'
                    : 'border-[#E7E1D7] bg-white hover:border-[#C4612F]/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{goal.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-serif text-lg text-[#1F2421] mb-1">
                      {goal.title}
                    </h3>
                    <p className="text-sm font-light text-[#5C635D]">
                      {goal.description}
                    </p>
                  </div>
                  {selectedGoal === goal.id && (
                    <div className="w-6 h-6 rounded-full bg-[#C4612F] flex items-center justify-center text-white text-sm">
                      ✓
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!selectedGoal || loading}
            className="w-full px-6 py-3 bg-[#C4612F] text-white rounded-full font-light hover:bg-[#A94E22] transition-all hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? 'Đang tạo kế hoạch...' : 'Tạo kế hoạch hành động'}
          </button>
        </div>
      </div>
    </div>
  )
}
