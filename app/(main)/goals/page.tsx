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
    <div className="min-h-screen bg-orange-50">
      {/* Floating Decorations */}
      <div className="fixed top-20 right-10 text-6xl opacity-20 float-animation">📷</div>
      <div className="fixed bottom-32 left-10 text-5xl opacity-20 float-animation" style={{animationDelay: '1s'}}>✨</div>
      <div className="fixed top-40 left-1/4 text-4xl opacity-20 float-animation" style={{animationDelay: '2s'}}>🌟</div>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b-2 border-orange-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-handwriting text-2xl font-bold text-gray-800">
            Chọn mục tiêu 🎯
          </h1>
          <div className="flex gap-1.5">
            <div className="progress-dot bg-orange-500"></div>
            <div className="progress-dot bg-orange-500"></div>
            <div className="progress-dot bg-gray-200"></div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white p-6 shadow-md border border-gray-200 relative mb-8">
          <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 text-sm font-handwriting mb-4 transform -rotate-1">
            ✨ Bước tiếp theo
          </span>
          <h2 className="font-handwriting text-3xl font-bold text-gray-800 mt-4 mb-3">
            Bạn muốn cải thiện <span className="text-orange-500">điều gì</span> nhất?
          </h2>
          <p className="text-gray-600 font-light mb-8 font-handwriting text-lg">
            Chọn 1 mục tiêu để nhận 3 kế hoạch hành động được cá nhân hóa 🎁
          </p>

          <div className="grid gap-6 sm:grid-cols-2 mb-8">
            {GOALS.map((goal, index) => (
              <button
                key={goal.id}
                type="button"
                onClick={() => setSelectedGoal(goal.id)}
                style={{animationDelay: `${index * 0.1}s`}}
                className={`p-4 bg-white shadow-md border border-gray-200 text-left transition-transform duration-300 hover:rotate-0 hover:z-10 relative ${
                  selectedGoal === goal.id
                    ? 'ring-4 ring-orange-400 rotate-0 z-10'
                    : index % 2 === 0 ? '-rotate-2' : 'rotate-2'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center text-4xl mb-3 border border-gray-200">
                    {goal.icon}
                  </div>
                  <h3 className="font-handwriting text-xl font-semibold text-gray-800 mb-1">
                    {goal.title}
                  </h3>
                  <p className="text-sm font-light text-gray-600">
                    {goal.description}
                  </p>
                  {selectedGoal === goal.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                      ✓
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200">
              <p className="text-sm text-red-600 font-medium font-handwriting">⚠️ {error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!selectedGoal || loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-handwriting text-xl py-3 px-6 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '✨ Đang tạo...' : '🚀 Tạo kế hoạch'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function GoalsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-orange-50 flex items-center justify-center font-handwriting">
        <div className="text-gray-600 font-light">Đang tải...</div>
      </div>
    }>
      <GoalsForm />
    </Suspense>
  )
}
