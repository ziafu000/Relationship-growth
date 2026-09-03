'use client'

import { useState } from 'react'
import { createRelationship } from '@/app/actions/onboarding'
import { toggleLimitedSelection } from '@/lib/onboarding'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [relationshipType, setRelationshipType] = useState<'new' | 'long_term' | null>(null)
  const [city, setCity] = useState<'hanoi' | 'hcmc' | null>(null)
  const [loveLanguages, setLoveLanguages] = useState<string[]>([])
  const [interests, setInterests] = useState<string[]>([])

  async function handleSubmit() {
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('relationship_type', relationshipType!)
    formData.append('city', city!)
    loveLanguages.forEach(lang => formData.append('love_languages', lang))
    interests.forEach(interest => formData.append('interests', interest))

    const result = await createRelationship(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  const toggleLoveLanguage = (lang: string) => {
    setLoveLanguages(prev => toggleLimitedSelection(prev, lang, 3))
  }

  const toggleInterest = (interest: string) => {
    setInterests(prev => toggleLimitedSelection(prev, interest, 5))
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center px-4 py-12">
      {/* Floating Decorations */}
      <div className="fixed top-20 right-10 text-6xl opacity-20 float-animation">💕</div>
      <div className="fixed bottom-32 left-10 text-5xl opacity-20 float-animation" style={{animationDelay: '1s'}}>✨</div>

      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-light text-gray-600">Bước {step} / 3</span>
            <span className="text-xs font-light text-gray-600">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="h-2 bg-white/50 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent-purple transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Relationship Type */}
        {step === 1 && (
          <div className="bubble-card bg-gradient-to-br from-white to-pink-50/30">
            <span className="badge-bubble badge-pink mb-4">
              💕 Bắt đầu
            </span>
            <h1 className="font-heading text-3xl font-bold text-gray-800 mb-3">
              Mối quan hệ của bạn đang ở <span className="text-primary italic">giai đoạn nào</span>?
            </h1>
            <p className="text-gray-600 font-light mb-8">
              Giúp chúng tôi hiểu rõ hơn để đề xuất hoạt động phù hợp
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setRelationshipType('new')}
                className={`w-full p-6 rounded-[20px] border-2 text-left transition-all ${
                  relationshipType === 'new'
                    ? 'border-primary bg-bubble-pink shadow-bubble'
                    : 'border-pink-200 bg-white hover:border-primary/50 hover:shadow-bubble-md'
                }`}
              >
                <div className="font-heading text-lg text-gray-800 mb-2">💖 Mới bắt đầu</div>
                <p className="text-sm font-light text-gray-600">
                  Dưới 6 tháng - Đang khám phá và tìm hiểu nhau
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRelationshipType('long_term')}
                className={`w-full p-6 rounded-[20px] border-2 text-left transition-all ${
                  relationshipType === 'long_term'
                    ? 'border-primary bg-bubble-pink shadow-bubble'
                    : 'border-pink-200 bg-white hover:border-primary/50 hover:shadow-bubble-md'
                }`}
              >
                <div className="font-heading text-lg text-gray-800 mb-2">💝 Lâu dài</div>
                <p className="text-sm font-light text-gray-600">
                  Trên 6 tháng - Muốn duy trì và phát triển mối quan hệ
                </p>
              </button>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!relationshipType}
              className="btn-bubble btn-primary w-full mt-8"
            >
              Tiếp tục →
            </button>
          </div>
        )}

        {/* Step 2: City & Love Languages */}
        {step === 2 && (
          <div className="bubble-card bg-gradient-to-br from-white to-blue-50/30">
            <span className="badge-bubble badge-blue mb-4">
              🌆 Sở thích
            </span>
            <h1 className="font-heading text-3xl font-bold text-gray-800 mb-3">
              Bạn đang sống tại <span className="text-primary italic">đâu</span>?
            </h1>
            <p className="text-gray-600 font-light mb-6">
              Để đề xuất hoạt động phù hợp với địa điểm của bạn
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              <button
                type="button"
                onClick={() => setCity('hanoi')}
                className={`p-4 rounded-[20px] border-2 transition-all ${
                  city === 'hanoi'
                    ? 'border-primary bg-bubble-blue shadow-bubble'
                    : 'border-blue-200 bg-white hover:border-primary/50 hover:shadow-bubble-md'
                }`}
              >
                <div className="font-semibold text-gray-800">🏛️ Hà Nội</div>
              </button>
              <button
                type="button"
                onClick={() => setCity('hcmc')}
                className={`p-4 rounded-[20px] border-2 transition-all ${
                  city === 'hcmc'
                    ? 'border-primary bg-bubble-blue shadow-bubble'
                    : 'border-blue-200 bg-white hover:border-primary/50 hover:shadow-bubble-md'
                }`}
              >
                <div className="font-semibold text-gray-800">🏙️ TP. Hồ Chí Minh</div>
              </button>
            </div>

            <h2 className="font-heading text-xl font-bold text-gray-800 mb-3">
              Ngôn ngữ yêu thương của bạn?
            </h2>
            <p className="text-sm font-light text-gray-600 mb-4">
              Chọn 1-3 cách bạn cảm nhận được tình yêu
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'quality_time', label: '⏰ Thời gian chất lượng' },
                { id: 'words_of_affirmation', label: '💬 Lời nói yêu thương' },
                { id: 'physical_touch', label: '🤗 Tiếp xúc thân mật' },
                { id: 'acts_of_service', label: '🤝 Hành động phục vụ' },
                { id: 'gifts', label: '🎁 Quà tặng' },
              ].map(lang => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => toggleLoveLanguage(lang.id)}
                  disabled={loveLanguages.length >= 3 && !loveLanguages.includes(lang.id)}
                  aria-pressed={loveLanguages.includes(lang.id)}
                  className={`p-3 rounded-[20px] border-2 text-sm transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                    loveLanguages.includes(lang.id)
                      ? 'border-primary bg-bubble-purple shadow-bubble'
                      : 'border-purple-200 bg-white hover:border-primary/50 hover:shadow-bubble-md'
                  }`}
                >
                  {lang.label}
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
                disabled={!city || loveLanguages.length === 0}
                className="btn-bubble btn-primary flex-1"
              >
                Tiếp tục →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Interests */}
        {step === 3 && (
          <div className="bubble-card bg-gradient-to-br from-white to-green-50/30">
            <span className="badge-bubble badge-green mb-4">
              🎉 Cuối cùng
            </span>
            <h1 className="font-heading text-3xl font-bold text-gray-800 mb-3">
              Bạn thích làm <span className="text-primary italic">những gì</span>?
            </h1>
            <p className="text-gray-600 font-light mb-6">
              Chọn 3-5 sở thích để chúng tôi cá nhân hóa đề xuất
            </p>

            <p className="mb-3 text-sm font-semibold text-gray-700" aria-live="polite">
              Đã chọn {interests.length} / 5 sở thích
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'coffee', label: '☕ Cà phê' },
                { id: 'art', label: '🎨 Nghệ thuật' },
                { id: 'food', label: '🍜 Ẩm thực' },
                { id: 'nature', label: '🌿 Thiên nhiên' },
                { id: 'music', label: '🎵 Âm nhạc' },
                { id: 'sports', label: '⚽ Thể thao' },
                { id: 'movies', label: '🎬 Phim ảnh' },
                { id: 'books', label: '📚 Đọc sách' },
                { id: 'cooking', label: '👨‍🍳 Nấu ăn' },
                { id: 'travel', label: '✈️ Du lịch' },
              ].map(interest => (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => toggleInterest(interest.id)}
                  disabled={interests.length >= 5 && !interests.includes(interest.id)}
                  aria-pressed={interests.includes(interest.id)}
                  className={`p-3 rounded-[20px] border-2 text-sm transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                    interests.includes(interest.id)
                      ? 'border-primary bg-bubble-green shadow-bubble'
                      : 'border-green-200 bg-white hover:border-primary/50 hover:shadow-bubble-md'
                  }`}
                >
                  {interest.label}
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
                disabled={interests.length < 3 || interests.length > 5 || loading}
                className="btn-bubble btn-primary flex-1"
              >
                {loading ? 'Đang tạo...' : '🎉 Hoàn thành'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
