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
    <div className="min-h-screen bg-[#F7F4EF]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#E7E1D7]">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-serif text-xl tracking-tight text-[#1F2421]">
            Check-in
          </h1>
          <div className="text-xs font-light text-[#5C635D]">
            Bước {step} / 3
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-1 bg-[#E7E1D7] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C4612F] transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Mood & Connection */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-8 border border-[#E7E1D7]">
            <span className="inline-block px-3 py-1 rounded-full bg-[#F2E3D6] text-[#C4612F] text-xs font-medium mb-4">
              Cảm xúc
            </span>
            <h2 className="font-serif text-3xl tracking-tight text-[#1F2421] mb-3">
              Tâm trạng gần đây của bạn <span className="italic text-[#C4612F]">thế nào</span>?
            </h2>
            <p className="text-[#5C635D] font-light mb-6">
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
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    currentMood === mood.id
                      ? 'border-[#C4612F] bg-[#F2E3D6]'
                      : 'border-[#E7E1D7] bg-white hover:border-[#C4612F]/30'
                  }`}
                >
                  <div className="text-2xl mb-1">{mood.emoji}</div>
                  <div className="text-sm font-light text-[#1F2421]">
                    {mood.label.replace(mood.emoji + ' ', '')}
                  </div>
                </button>
              ))}
            </div>

            <h2 className="font-serif text-xl tracking-tight text-[#1F2421] mb-3">
              Mức độ kết nối với người ấy?
            </h2>
            <p className="text-sm font-light text-[#5C635D] mb-4">
              1 = Xa cách, 10 = Rất gần gũi
            </p>

            <div className="mb-6">
              <input
                type="range"
                min="1"
                max="10"
                value={connectionLevel}
                onChange={(e) => setConnectionLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-[#E7E1D7] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-[#C4612F] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <div className="flex justify-between text-xs font-light text-[#5C635D] mt-2">
                <span>1</span>
                <span className="text-lg font-medium text-[#C4612F]">{connectionLevel}</span>
                <span>10</span>
              </div>
            </div>

            <h2 className="font-serif text-xl tracking-tight text-[#1F2421] mb-3">
              Gần đây bạn có nhiều thời gian bên nhau không?
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'plenty', label: 'Nhiều' },
                { id: 'some', label: 'Vừa phải' },
                { id: 'little', label: 'Ít' },
                { id: 'none', label: 'Rất ít' },
              ].map(time => (
                <button
                  key={time.id}
                  type="button"
                  onClick={() => setTimeTogether(time.id)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    timeTogether === time.id
                      ? 'border-[#C4612F] bg-[#F2E3D6]'
                      : 'border-[#E7E1D7] bg-white hover:border-[#C4612F]/30'
                  }`}
                >
                  {time.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!currentMood || !timeTogether}
              className="w-full mt-8 px-6 py-3 bg-[#C4612F] text-white rounded-full font-light hover:bg-[#A94E22] transition-all hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              Tiếp tục
            </button>
          </div>
        )}

        {/* Step 2: Challenges & What Matters */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-8 border border-[#E7E1D7]">
            <span className="inline-block px-3 py-1 rounded-full bg-[#F2E3D6] text-[#C4612F] text-xs font-medium mb-4">
              Hiện tại
            </span>
            <h2 className="font-serif text-3xl tracking-tight text-[#1F2421] mb-3">
              Gần đây có gặp <span className="italic text-[#C4612F]">khó khăn</span> gì không?
            </h2>
            <p className="text-[#5C635D] font-light mb-6">
              Chọn tất cả những gì đang ảnh hưởng (hoặc bỏ qua nếu không có)
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { id: 'busy_work', label: 'Bận công việc' },
                { id: 'family_stress', label: 'Căng thẳng gia đình' },
                { id: 'communication_issue', label: 'Khó giao tiếp' },
                { id: 'different_goals', label: 'Mục tiêu khác nhau' },
                { id: 'lack_time', label: 'Thiếu thời gian' },
                { id: 'feeling_distant', label: 'Cảm giác xa cách' },
              ].map(challenge => (
                <button
                  key={challenge.id}
                  type="button"
                  onClick={() => toggleChallenge(challenge.id)}
                  className={`p-3 rounded-xl border-2 text-sm transition-all ${
                    recentChallenges.includes(challenge.id)
                      ? 'border-[#C4612F] bg-[#F2E3D6]'
                      : 'border-[#E7E1D7] bg-white hover:border-[#C4612F]/30'
                  }`}
                >
                  {challenge.label}
                </button>
              ))}
            </div>

            <h2 className="font-serif text-xl tracking-tight text-[#1F2421] mb-3">
              Điều gì quan trọng với bạn nhất lúc này?
            </h2>
            <p className="text-sm font-light text-[#5C635D] mb-4">
              Chọn 1 điều bạn muốn cải thiện nhất
            </p>

            <div className="space-y-2">
              {[
                { id: 'quality_time', label: 'Thời gian chất lượng bên nhau' },
                { id: 'appreciation', label: 'Thể hiện sự trân trọng' },
                { id: 'communication', label: 'Giao tiếp hiểu nhau hơn' },
                { id: 'novelty', label: 'Trải nghiệm điều mới mẻ' },
                { id: 'repair', label: 'Hàn gắn và sửa chữa' },
                { id: 'connection', label: 'Kết nối cảm xúc sâu sắc' },
              ].map(matter => (
                <button
                  key={matter.id}
                  type="button"
                  onClick={() => setWhatMatters(matter.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    whatMatters === matter.id
                      ? 'border-[#C4612F] bg-[#F2E3D6]'
                      : 'border-[#E7E1D7] bg-white hover:border-[#C4612F]/30'
                  }`}
                >
                  <div className="text-sm font-light">{matter.label}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-[#E7E1D7] text-[#5C635D] rounded-full font-light hover:border-[#C4612F] transition-all"
              >
                Quay lại
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!whatMatters}
                className="flex-1 px-6 py-3 bg-[#C4612F] text-white rounded-full font-light hover:bg-[#A94E22] transition-all hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Context (Time, Budget, Location) */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-8 border border-[#E7E1D7]">
            <span className="inline-block px-3 py-1 rounded-full bg-[#F2E3D6] text-[#C4612F] text-xs font-medium mb-4">
              Hoàn tất
            </span>
            <h2 className="font-serif text-3xl tracking-tight text-[#1F2421] mb-3">
              Một vài chi tiết <span className="italic text-[#C4612F]">cuối cùng</span>
            </h2>
            <p className="text-[#5C635D] font-light mb-6">
              Để đề xuất hoạt động phù hợp với hoàn cảnh của bạn
            </p>

            <h3 className="font-serif text-lg text-[#1F2421] mb-3">
              Khi nào bạn có thời gian?
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { id: 'tonight', label: 'Tối nay' },
                { id: 'this_weekend', label: 'Cuối tuần này' },
                { id: 'next_week', label: 'Tuần sau' },
                { id: 'flexible', label: 'Linh động' },
              ].map(time => (
                <button
                  key={time.id}
                  type="button"
                  onClick={() => setAvailableTime(time.id)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    availableTime === time.id
                      ? 'border-[#C4612F] bg-[#F2E3D6]'
                      : 'border-[#E7E1D7] bg-white hover:border-[#C4612F]/30'
                  }`}
                >
                  {time.label}
                </button>
              ))}
            </div>

            <h3 className="font-serif text-lg text-[#1F2421] mb-3">
              Ngân sách dự kiến?
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { id: 'free', label: 'Miễn phí' },
                { id: 'budget', label: 'Tiết kiệm (< 200k)' },
                { id: 'moderate', label: 'Vừa phải (200-500k)' },
                { id: 'premium', label: 'Thoải mái (> 500k)' },
              ].map(budget => (
                <button
                  key={budget.id}
                  type="button"
                  onClick={() => setBudgetPreference(budget.id)}
                  className={`p-3 rounded-xl border-2 text-sm transition-all ${
                    budgetPreference === budget.id
                      ? 'border-[#C4612F] bg-[#F2E3D6]'
                      : 'border-[#E7E1D7] bg-white hover:border-[#C4612F]/30'
                  }`}
                >
                  {budget.label}
                </button>
              ))}
            </div>

            <h3 className="font-serif text-lg text-[#1F2421] mb-3">
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
                  className={`p-3 rounded-xl border-2 transition-all ${
                    locationPreference === location.id
                      ? 'border-[#C4612F] bg-[#F2E3D6]'
                      : 'border-[#E7E1D7] bg-white hover:border-[#C4612F]/30'
                  }`}
                >
                  {location.label}
                </button>
              ))}
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep(2)}
                disabled={loading}
                className="px-6 py-3 border border-[#E7E1D7] text-[#5C635D] rounded-full font-light hover:border-[#C4612F] transition-all disabled:opacity-50"
              >
                Quay lại
              </button>
              <button
                onClick={handleSubmit}
                disabled={!availableTime || !budgetPreference || !locationPreference || loading}
                className="flex-1 px-6 py-3 bg-[#C4612F] text-white rounded-full font-light hover:bg-[#A94E22] transition-all hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? 'Đang xử lý...' : 'Xem đề xuất'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
