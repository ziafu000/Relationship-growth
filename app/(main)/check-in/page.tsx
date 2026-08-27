'use client'

import { useState } from 'react'
import { submitCheckIn } from '@/app/actions/check-in'

export default function CheckInPage() {
  const [step, setStep] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [currentMood, setCurrentMood] = useState<string>('')
  const [connectionLevel, setConnectionLevel] = useState<number>(5)
  const [timeTogether, setTimeTogether] = useState<string>('')
  const [recentChallenges, setRecentChallenges] = useState<string[]>([])
  const [whatMatters, setWhatMatters] = useState<string>('')
  const [availableTime, setAvailableTime] = useState<string>('')
  const [budgetPreference, setBudgetPreference] = useState<string>('')
  const [locationPreference, setLocationPreference] = useState<string>('')

  async function handleSubmit() {
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('current_mood', currentMood)
    formData.append('connection_level', connectionLevel.toString())
    formData.append('time_together_recently', timeTogether)
    recentChallenges.forEach(challenge => formData.append('recent_challenges', challenge))
    formData.append('what_matters_now', whatMatters)
    formData.append('available_time', availableTime)
    formData.append('budget_preference', budgetPreference)
    formData.append('location_preference', locationPreference)

    const result = await submitCheckIn(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  const toggleChallenge = (challenge: string) => {
    setRecentChallenges(prev =>
      prev.includes(challenge) ? prev.filter(c => c !== challenge) : [...prev, challenge]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Floating Decorations */}
      <div className="fixed top-20 right-10 text-6xl opacity-20 float-animation">💭</div>
      <div className="fixed bottom-32 left-10 text-5xl opacity-20 float-animation" style={{animationDelay: '1s'}}>✨</div>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b-2 border-purple-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-heading text-xl font-bold text-gray-800">
            Check-in 💬
          </h1>
          <div className="text-xs font-light text-gray-600">
            Bước {step} / 3
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-white/50 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent-purple transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Mood & Connection */}
        {step === 1 && (
          <div className="bubble-card bg-gradient-to-br from-white to-purple-50/30">
            <span className="badge-bubble badge-purple mb-4">
              💭 Cảm xúc
            </span>
            <h2 className="font-heading text-3xl font-bold text-gray-800 mb-3">
              Tâm trạng gần đây của bạn <span className="text-primary italic">thế nào</span>?
            </h2>
            <p className="text-gray-600 font-light mb-6">
              Giúp chúng tôi hiểu trạng thái hiện tại của bạn
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { id: 'great', label: '😊 Tuyệt vời', emoji: '😊' },
                { id: 'good', label: '🙂 Tốt', emoji: '🙂' },
                { id: 'neutral', label: '😐 Bình thường', emoji: '😐' },
                { id: 'stressed', label: '😰 Căng thẳng', emoji: '😰' },
                { id: 'disconnected', label: '😔 Xa cách', emoji: '😔' },
              ].map(mood => (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => setCurrentMood(mood.id)}
                  className={`p-4 rounded-[20px] border-2 transition-all text-left ${
                    currentMood === mood.id
                      ? 'border-primary bg-bubble-purple shadow-bubble'
                      : 'border-purple-200 bg-white hover:border-primary/50 hover:shadow-bubble-md'
                  }`}
                >
                  <div className="text-2xl mb-1">{mood.emoji}</div>
                  <div className="text-sm font-light text-gray-800">
                    {mood.label.replace(mood.emoji + ' ', '')}
                  </div>
                </button>
              ))}
            </div>

            <h2 className="font-heading text-xl font-bold text-gray-800 mb-3">
              Mức độ kết nối với người ấy?
            </h2>
            <p className="text-sm font-light text-gray-600 mb-4">
              1 = Xa cách, 10 = Rất gần gũi
            </p>

            <div className="mb-6">
              <input
                type="range"
                min="1"
                max="10"
                value={connectionLevel}
                onChange={(e) => setConnectionLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-bubble"
              />
              <div className="flex justify-between text-xs font-light text-gray-600 mt-2">
                <span>1</span>
                <span className="text-lg font-bold text-primary">{connectionLevel}</span>
                <span>10</span>
              </div>
            </div>

            <h2 className="font-heading text-xl font-bold text-gray-800 mb-3">
              Gần đây bạn có nhiều thời gian bên nhau không?
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'plenty', label: '⏰ Nhiều' },
                { id: 'some', label: '👌 Vừa phải' },
                { id: 'little', label: '⏱️ Ít' },
                { id: 'none', label: '⏳ Rất ít' },
              ].map(time => (
                <button
                  key={time.id}
                  type="button"
                  onClick={() => setTimeTogether(time.id)}
                  className={`p-3 rounded-[20px] border-2 transition-all ${
                    timeTogether === time.id
                      ? 'border-primary bg-bubble-pink shadow-bubble'
                      : 'border-pink-200 bg-white hover:border-primary/50 hover:shadow-bubble-md'
                  }`}
                >
                  {time.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!currentMood || !timeTogether}
              className="btn-bubble btn-primary w-full mt-8"
            >
              Tiếp tục →
            </button>
          </div>
        )}

        {/* Step 2: Challenges & What Matters */}
        {step === 2 && (
          <div className="bubble-card bg-gradient-to-br from-white to-pink-50/30">
            <span className="badge-bubble badge-pink mb-4">
              💡 Hiện tại
            </span>
            <h2 className="font-heading text-3xl font-bold text-gray-800 mb-3">
              Gần đây có gặp <span className="text-primary italic">khó khăn</span> gì không?
            </h2>
            <p className="text-gray-600 font-light mb-6">
              Chọn tất cả những gì đang ảnh hưởng (hoặc bỏ qua nếu không có)
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { id: 'busy_work', label: '💼 Bận công việc' },
                { id: 'family_stress', label: '👨‍👩‍👧 Căng thẳng gia đình' },
                { id: 'communication_issue', label: '💬 Khó giao tiếp' },
                { id: 'different_goals', label: '🎯 Mục tiêu khác nhau' },
                { id: 'lack_time', label: '⏰ Thiếu thời gian' },
                { id: 'feeling_distant', label: '💔 Cảm giác xa cách' },
              ].map(challenge => (
                <button
                  key={challenge.id}
                  type="button"
                  onClick={() => toggleChallenge(challenge.id)}
                  className={`p-3 rounded-[20px] border-2 text-sm transition-all ${
                    recentChallenges.includes(challenge.id)
                      ? 'border-primary bg-bubble-yellow shadow-bubble'
                      : 'border-yellow-200 bg-white hover:border-primary/50 hover:shadow-bubble-md'
                  }`}
                >
                  {challenge.label}
                </button>
              ))}
            </div>

            <h2 className="font-heading text-xl font-bold text-gray-800 mb-3">
              Điều gì quan trọng với bạn nhất lúc này?
            </h2>
            <p className="text-sm font-light text-gray-600 mb-4">
              Chọn 1 điều bạn muốn cải thiện nhất
            </p>

            <div className="space-y-2">
              {[
                { id: 'quality_time', label: '⏰ Thời gian chất lượng bên nhau' },
                { id: 'appreciation', label: '💝 Thể hiện sự trân trọng' },
                { id: 'communication', label: '💬 Giao tiếp hiểu nhau hơn' },
                { id: 'novelty', label: '✨ Trải nghiệm điều mới mẻ' },
                { id: 'repair', label: '🔧 Hàn gắn và sửa chữa' },
                { id: 'connection', label: '💖 Kết nối cảm xúc sâu sắc' },
              ].map(matter => (
                <button
                  key={matter.id}
                  type="button"
                  onClick={() => setWhatMatters(matter.id)}
                  className={`w-full p-4 rounded-[20px] border-2 text-left transition-all ${
                    whatMatters === matter.id
                      ? 'border-primary bg-bubble-pink shadow-bubble'
                      : 'border-pink-200 bg-white hover:border-primary/50 hover:shadow-bubble-md'
                  }`}
                >
                  <div className="text-sm font-light">{matter.label}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep(1)}
                className="btn-bubble bg-white border-2 border-gray-200 text-gray-700 hover:border-primary hover:bg-white px-6"
              >
                ← Quay lại
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!whatMatters}
                className="btn-bubble btn-primary flex-1"
              >
                Tiếp tục →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Context (Time, Budget, Location) */}
        {step === 3 && (
          <div className="bubble-card bg-gradient-to-br from-white to-blue-50/30">
            <span className="badge-bubble badge-blue mb-4">
              🎯 Hoàn tất
            </span>
            <h2 className="font-heading text-3xl font-bold text-gray-800 mb-3">
              Một vài chi tiết <span className="text-primary italic">cuối cùng</span>
            </h2>
            <p className="text-gray-600 font-light mb-6">
              Để đề xuất hoạt động phù hợp với hoàn cảnh của bạn
            </p>

            <h3 className="font-heading text-lg font-bold text-gray-800 mb-3">
              Khi nào bạn có thời gian?
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { id: 'tonight', label: '🌙 Tối nay' },
                { id: 'this_weekend', label: '📅 Cuối tuần này' },
                { id: 'next_week', label: '📆 Tuần sau' },
                { id: 'flexible', label: '🔄 Linh động' },
              ].map(time => (
                <button
                  key={time.id}
                  type="button"
                  onClick={() => setAvailableTime(time.id)}
                  className={`p-3 rounded-[20px] border-2 transition-all ${
                    availableTime === time.id
                      ? 'border-primary bg-bubble-blue shadow-bubble'
                      : 'border-blue-200 bg-white hover:border-primary/50 hover:shadow-bubble-md'
                  }`}
                >
                  {time.label}
                </button>
              ))}
            </div>

            <h3 className="font-heading text-lg font-bold text-gray-800 mb-3">
              Ngân sách dự kiến?
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { id: 'free', label: '🆓 Miễn phí' },
                { id: 'budget', label: '💵 Tiết kiệm (< 200k)' },
                { id: 'moderate', label: '💰 Vừa phải (200-500k)' },
                { id: 'premium', label: '💎 Thoải mái (> 500k)' },
              ].map(budget => (
                <button
                  key={budget.id}
                  type="button"
                  onClick={() => setBudgetPreference(budget.id)}
                  className={`p-3 rounded-[20px] border-2 text-sm transition-all ${
                    budgetPreference === budget.id
                      ? 'border-primary bg-bubble-green shadow-bubble'
                      : 'border-green-200 bg-white hover:border-primary/50 hover:shadow-bubble-md'
                  }`}
                >
                  {budget.label}
                </button>
              ))}
            </div>

            <h3 className="font-heading text-lg font-bold text-gray-800 mb-3">
              Địa điểm ưu tiên?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'home', label: '🏠 Ở nhà' },
                { id: 'nearby', label: '📍 Gần nhà' },
                { id: 'city_center', label: '🏙️ Trung tâm' },
                { id: 'anywhere', label: '🗺️ Bất kỳ đâu' },
              ].map(location => (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => setLocationPreference(location.id)}
                  className={`p-3 rounded-[20px] border-2 transition-all ${
                    locationPreference === location.id
                      ? 'border-primary bg-bubble-purple shadow-bubble'
                      : 'border-purple-200 bg-white hover:border-primary/50 hover:shadow-bubble-md'
                  }`}
                >
                  {location.label}
                </button>
              ))}
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-[20px]">
                <p className="text-sm text-red-600 font-light">{error}</p>
              </div>
            )}

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep(2)}
                disabled={loading}
                className="btn-bubble bg-white border-2 border-gray-200 text-gray-700 hover:border-primary hover:bg-white px-6"
              >
                ← Quay lại
              </button>
              <button
                onClick={handleSubmit}
                disabled={!availableTime || !budgetPreference || !locationPreference || loading}
                className="btn-bubble btn-primary flex-1"
              >
                {loading ? 'Đang xử lý...' : '✨ Xem đề xuất'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
