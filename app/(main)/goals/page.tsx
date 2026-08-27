'use client'

import { useState, useEffect, Suspense } from 'react'
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

function GoalsForm() {
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Floating Decorations */}
      <div className="fixed top-20 right-10 text-6xl opacity-20 float-animation">💕</div>
      <div className="fixed bottom-32 left-10 text-5xl opacity-20 float-animation" style={{animationDelay: '1s'}}>✨</div>
      <div className="fixed top-40 left-1/4 text-4xl opacity-20 float-animation" style={{animationDelay: '2s'}}>🌟</div>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b-2 border-pink-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-heading text-xl font-bold text-gray-800">
            Chọn mục tiêu 🎯
          </h1>
          <div className="flex gap-1.5">
            <div className="progress-dot progress-dot-active"></div>
            <div className="progress-dot progress-dot-active"></div>
            <div className="progress-dot progress-dot-inactive"></div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bubble-card bg-gradient-to-br from-white to-pink-50/30">
          <span className="badge-bubble badge-pink">
            ✨ Bước tiếp theo
          </span>
          <h2 className="font-heading text-3xl font-bold text-gray-800 mt-4 mb-3">
            Bạn muốn cải thiện <span className="text-primary">điều gì</span> nhất?
          </h2>
          <p className="text-gray-600 font-light mb-8">
            Chọn 1 mục tiêu để nhận 3 kế hoạch hành động được cá nhân hóa 🎁
          </p>

          <div className="grid gap-4 mb-8">
            {GOALS.map((goal, index) => (
              <button
                key={goal.id}
                type="button"
                onClick={() => setSelectedGoal(goal.id)}
                style={{animationDelay: `${index * 0.1}s`}}
                className={`w-full p-5 rounded-[24px] border-3 text-left transition-all duration-300 ${
                  selectedGoal === goal.id
                    ? 'border-primary bg-gradient-to-br from-pink-50 to-purple-50 shadow-bubble-lg scale-[1.02]'
                    : 'border-transparent bg-white hover:border-pink-200 hover:shadow-bubble-md hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="icon-bubble bg-gradient-to-br from-white to-pink-50 border-2 border-pink-100 flex-shrink-0">
                    <span className="text-3xl">{goal.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-lg font-semibold text-gray-800 mb-1">
                      {goal.title}
                    </h3>
                    <p className="text-sm font-light text-gray-600">
                      {goal.description}
                    </p>
                  </div>
                  {selectedGoal === goal.id && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-white text-lg font-bold shadow-bubble flex-shrink-0">
                      ✓
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-[20px]">
              <p className="text-sm text-red-600 font-medium">⚠️ {error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!selectedGoal || loading}
            className="btn-bubble btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? '✨ Đang tạo kế hoạch...' : '🚀 Tạo kế hoạch hành động'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function GoalsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-gray-600 font-light">Đang tải...</div>
      </div>
    }>
      <GoalsForm />
    </Suspense>
  )
}
