'use client'

import { useState } from 'react'
import { createRelationship } from '@/app/actions/onboarding'

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
    setLoveLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    )
  }

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F4EF] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-light text-[#5C635D]">Bước {step} / 3</span>
            <span className="text-xs font-light text-[#5C635D]">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="h-1 bg-[#E7E1D7] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C4612F] transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Relationship Type */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-8 border border-[#E7E1D7]">
            <span className="inline-block px-3 py-1 rounded-full bg-[#F2E3D6] text-[#C4612F] text-xs font-medium mb-4">
              Bắt đầu
            </span>
            <h1 className="font-serif text-3xl tracking-tight text-[#1F2421] mb-3">
              Mối quan hệ của bạn đang ở <span className="italic text-[#C4612F]">giai đoạn nào</span>?
            </h1>
            <p className="text-[#5C635D] font-light mb-8">
              Giúp chúng tôi hiểu rõ hơn để đề xuất hoạt động phù hợp
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setRelationshipType('new')}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                  relationshipType === 'new'
                    ? 'border-[#C4612F] bg-[#F2E3D6]'
                    : 'border-[#E7E1D7] bg-white hover:border-[#C4612F]/30'
                }`}
              >
                <div className="font-serif text-lg text-[#1F2421] mb-2">Mới bắt đầu</div>
                <p className="text-sm font-light text-[#5C635D]">
                  Dưới 6 tháng - Đang khám phá và tìm hiểu nhau
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRelationshipType('long_term')}
                className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                  relationshipType === 'long_term'
                    ? 'border-[#C4612F] bg-[#F2E3D6]'
                    : 'border-[#E7E1D7] bg-white hover:border-[#C4612F]/30'
                }`}
              >
                <div className="font-serif text-lg text-[#1F2421] mb-2">Lâu dài</div>
                <p className="text-sm font-light text-[#5C635D]">
                  Trên 6 tháng - Muốn duy trì và phát triển mối quan hệ
                </p>
              </button>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!relationshipType}
              className="w-full mt-8 px-6 py-3 bg-[#C4612F] text-white rounded-full font-light hover:bg-[#A94E22] transition-all hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              Tiếp tục
            </button>
          </div>
        )}

        {/* Step 2: City & Love Languages */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-8 border border-[#E7E1D7]">
            <span className="inline-block px-3 py-1 rounded-full bg-[#F2E3D6] text-[#C4612F] text-xs font-medium mb-4">
              Sở thích
            </span>
            <h1 className="font-serif text-3xl tracking-tight text-[#1F2421] mb-3">
              Bạn đang sống tại <span className="italic text-[#C4612F]">đâu</span>?
            </h1>
            <p className="text-[#5C635D] font-light mb-6">
              Để đề xuất hoạt động phù hợp với địa điểm của bạn
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              <button
                type="button"
                onClick={() => setCity('hanoi')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  city === 'hanoi'
                    ? 'border-[#C4612F] bg-[#F2E3D6]'
                    : 'border-[#E7E1D7] bg-white hover:border-[#C4612F]/30'
                }`}
              >
                <div className="font-medium text-[#1F2421]">Hà Nội</div>
              </button>
              <button
                type="button"
                onClick={() => setCity('hcmc')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  city === 'hcmc'
                    ? 'border-[#C4612F] bg-[#F2E3D6]'
                    : 'border-[#E7E1D7] bg-white hover:border-[#C4612F]/30'
                }`}
              >
                <div className="font-medium text-[#1F2421]">TP. Hồ Chí Minh</div>
              </button>
            </div>

            <h2 className="font-serif text-xl tracking-tight text-[#1F2421] mb-3">
              Ngôn ngữ yêu thương của bạn?
            </h2>
            <p className="text-sm font-light text-[#5C635D] mb-4">
              Chọn 1-3 cách bạn cảm nhận được tình yêu
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'quality_time', label: 'Thời gian chất lượng' },
                { id: 'words_of_affirmation', label: 'Lời nói yêu thương' },
                { id: 'physical_touch', label: 'Tiếp xúc thân mật' },
                { id: 'acts_of_service', label: 'Hành động phục vụ' },
                { id: 'gifts', label: 'Quà tặng' },
              ].map(lang => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => toggleLoveLanguage(lang.id)}
                  className={`p-3 rounded-xl border-2 text-sm transition-all ${
                    loveLanguages.includes(lang.id)
                      ? 'border-[#C4612F] bg-[#F2E3D6]'
                      : 'border-[#E7E1D7] bg-white hover:border-[#C4612F]/30'
                  }`}
                >
                  {lang.label}
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
                disabled={!city || loveLanguages.length === 0}
                className="flex-1 px-6 py-3 bg-[#C4612F] text-white rounded-full font-light hover:bg-[#A94E22] transition-all hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Interests */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-8 border border-[#E7E1D7]">
            <span className="inline-block px-3 py-1 rounded-full bg-[#F2E3D6] text-[#C4612F] text-xs font-medium mb-4">
              Cuối cùng
            </span>
            <h1 className="font-serif text-3xl tracking-tight text-[#1F2421] mb-3">
              Bạn thích làm <span className="italic text-[#C4612F]">những gì</span>?
            </h1>
            <p className="text-[#5C635D] font-light mb-6">
              Chọn 3-5 sở thích để chúng tôi cá nhân hóa đề xuất
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
                  className={`p-3 rounded-xl border-2 text-sm transition-all ${
                    interests.includes(interest.id)
                      ? 'border-[#C4612F] bg-[#F2E3D6]'
                      : 'border-[#E7E1D7] bg-white hover:border-[#C4612F]/30'
                  }`}
                >
                  {interest.label}
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
                disabled={interests.length === 0 || loading}
                className="flex-1 px-6 py-3 bg-[#C4612F] text-white rounded-full font-light hover:bg-[#A94E22] transition-all hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? 'Đang tạo...' : 'Hoàn thành'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
