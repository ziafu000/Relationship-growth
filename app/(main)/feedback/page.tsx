'use client'

import { useState, useEffect, Suspense } from 'react'
import { submitFeedback } from '@/app/actions/feedback'
import { useSearchParams } from 'next/navigation'

function FeedbackForm() {
  const searchParams = useSearchParams()
  const executionId = searchParams.get('execution_id')

  const [outcome, setOutcome] = useState<string>('')
  const [whatWorked, setWhatWorked] = useState<string[]>([])
  const [whatDidntWork, setWhatDidntWork] = useState<string[]>([])
  const [partnerReaction, setPartnerReaction] = useState<string>('')
  const [wouldRepeat, setWouldRepeat] = useState<boolean | null>(null)
  const [notes, setNotes] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!executionId) {
      window.location.href = '/dashboard'
    }
  }, [executionId])

  async function handleSubmit() {
    if (!outcome || wouldRepeat === null) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('execution_id', executionId!)
    formData.append('outcome', outcome)
    whatWorked.forEach(item => formData.append('what_worked', item))
    whatDidntWork.forEach(item => formData.append('what_didnt_work', item))
    if (partnerReaction) formData.append('partner_reaction', partnerReaction)
    formData.append('would_repeat', wouldRepeat.toString())
    if (notes) formData.append('notes', notes)

    const result = await submitFeedback(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  const toggleWorked = (item: string) => {
    setWhatWorked(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    )
  }

  const toggleDidntWork = (item: string) => {
    setWhatDidntWork(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    )
  }

  if (!executionId) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Floating Decorations */}
      <div className="fixed top-20 right-10 text-6xl opacity-20 float-animation">🎉</div>
      <div className="fixed bottom-32 left-10 text-5xl opacity-20 float-animation" style={{animationDelay: '1s'}}>💖</div>
      <div className="fixed top-40 left-1/4 text-4xl opacity-20 float-animation" style={{animationDelay: '2s'}}>⭐</div>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b-2 border-purple-100">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="font-heading text-xl font-bold text-gray-800">
            Feedback 💭
          </h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bubble-card bg-gradient-to-br from-white to-purple-50/30">
          <span className="badge-bubble badge-purple">
            🌟 Chia sẻ trải nghiệm
          </span>
          <h2 className="font-heading text-3xl font-bold text-gray-800 mt-4 mb-3">
            Mọi thứ diễn ra <span className="text-primary">thế nào</span>?
          </h2>
          <p className="text-gray-600 font-light mb-8">
            Feedback của bạn giúp chúng tôi đề xuất tốt hơn cho lần sau 🎯
          </p>

          {/* Outcome */}
          <div className="mb-8">
            <h3 className="font-heading text-lg font-semibold text-gray-800 mb-4">
              Tổng thể, trải nghiệm như thế nào? *
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'great', label: 'Tuyệt vời', emoji: '😊' },
                { id: 'good', label: 'Tốt', emoji: '🙂' },
                { id: 'okay', label: 'Ổn', emoji: '😐' },
                { id: 'difficult', label: 'Khó khăn', emoji: '😰' },
                { id: 'didnt_work', label: 'Không hiệu quả', emoji: '😔' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setOutcome(item.id)}
                  className={`p-4 rounded-[20px] border-3 transition-all text-center ${
                    outcome === item.id
                      ? 'border-primary bg-gradient-to-br from-pink-50 to-purple-50 shadow-bubble-lg scale-105'
                      : 'border-transparent bg-white hover:border-pink-200 hover:shadow-bubble'
                  }`}
                >
                  <div className="text-3xl mb-2 emoji-bounce">{item.emoji}</div>
                  <div className="text-sm font-semibold text-gray-800">
                    {item.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* What Worked */}
          <div className="mb-8">
            <h3 className="font-heading text-lg font-semibold text-gray-800 mb-2">
              Điều gì hiệu quả? 👍
            </h3>
            <p className="text-sm font-light text-gray-600 mb-4">Chọn tất cả những gì áp dụng</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'timing', label: 'Thời điểm phù hợp', emoji: '⏰' },
                { id: 'activity_choice', label: 'Hoạt động phù hợp', emoji: '🎯' },
                { id: 'conversation', label: 'Trò chuyện sâu sắc', emoji: '💬' },
                { id: 'atmosphere', label: 'Không khí tốt', emoji: '✨' },
                { id: 'steps_clear', label: 'Hướng dẫn rõ ràng', emoji: '📝' },
                { id: 'bonding', label: 'Tăng kết nối', emoji: '💕' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleWorked(item.id)}
                  className={`p-3 rounded-[18px] border-3 text-sm transition-all ${
                    whatWorked.includes(item.id)
                      ? 'border-green-400 bg-bubble-green shadow-bubble-md'
                      : 'border-transparent bg-white hover:border-green-200 hover:shadow-bubble'
                  }`}
                >
                  <span className="mr-1">{item.emoji}</span>
                  <span className="font-semibold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* What Didn't Work */}
          <div className="mb-8">
            <h3 className="font-heading text-lg font-semibold text-gray-800 mb-2">
              Điều gì chưa tốt? 👎
            </h3>
            <p className="text-sm font-light text-gray-600 mb-4">Giúp chúng tôi cải thiện</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'too_long', label: 'Quá dài', emoji: '⏳' },
                { id: 'too_expensive', label: 'Quá tốn kém', emoji: '💸' },
                { id: 'uncomfortable', label: 'Không thoải mái', emoji: '😣' },
                { id: 'bad_timing', label: 'Thời điểm không hợp', emoji: '⏰' },
                { id: 'unclear_steps', label: 'Hướng dẫn chưa rõ', emoji: '❓' },
                { id: 'didnt_enjoy', label: 'Không thích', emoji: '😕' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleDidntWork(item.id)}
                  className={`p-3 rounded-[18px] border-3 text-sm transition-all ${
                    whatDidntWork.includes(item.id)
                      ? 'border-red-400 bg-red-50 shadow-bubble-md'
                      : 'border-transparent bg-white hover:border-red-200 hover:shadow-bubble'
                  }`}
                >
                  <span className="mr-1">{item.emoji}</span>
                  <span className="font-semibold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Partner Reaction */}
          <div className="mb-8">
            <h3 className="font-heading text-lg font-semibold text-gray-800 mb-4">
              Phản ứng của người ấy? 💑
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'loved_it', label: 'Rất thích', emoji: '💖' },
                { id: 'enjoyed', label: 'Thích', emoji: '😊' },
                { id: 'neutral', label: 'Bình thường', emoji: '😐' },
                { id: 'uncomfortable', label: 'Không thoải mái', emoji: '😕' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPartnerReaction(item.id)}
                  className={`p-4 rounded-[20px] border-3 transition-all text-center ${
                    partnerReaction === item.id
                      ? 'border-primary bg-gradient-to-br from-pink-50 to-purple-50 shadow-bubble-lg'
                      : 'border-transparent bg-white hover:border-pink-200 hover:shadow-bubble'
                  }`}
                >
                  <div className="text-3xl mb-1">{item.emoji}</div>
                  <div className="text-sm font-semibold">{item.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Would Repeat */}
          <div className="mb-8">
            <h3 className="font-heading text-lg font-semibold text-gray-800 mb-4">
              Bạn có muốn làm lại hoạt động này không? *
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setWouldRepeat(true)}
                className={`p-5 rounded-[24px] border-3 transition-all ${
                  wouldRepeat === true
                    ? 'border-green-400 bg-bubble-green shadow-bubble-lg scale-105'
                    : 'border-transparent bg-white hover:border-green-200 hover:shadow-bubble'
                }`}
              >
                <div className="text-4xl mb-2">👍</div>
                <div className="text-sm font-semibold">Có, chắc chắn</div>
              </button>
              <button
                type="button"
                onClick={() => setWouldRepeat(false)}
                className={`p-5 rounded-[24px] border-3 transition-all ${
                  wouldRepeat === false
                    ? 'border-red-400 bg-red-50 shadow-bubble-lg scale-105'
                    : 'border-transparent bg-white hover:border-red-200 hover:shadow-bubble'
                }`}
              >
                <div className="text-4xl mb-2">👎</div>
                <div className="text-sm font-semibold">Không</div>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-8">
            <h3 className="font-heading text-lg font-semibold text-gray-800 mb-4">
              Ghi chú thêm (tùy chọn) 📝
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Chia sẻ thêm về trải nghiệm của bạn..."
              rows={4}
              className="input-bubble resize-none"
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-[20px]">
              <p className="text-sm text-red-600 font-medium">⚠️ {error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !outcome || wouldRepeat === null}
            className="btn-bubble btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? '✨ Đang gửi...' : '🎉 Hoàn thành'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-gray-600 font-light">Đang tải...</div>
      </div>
    }>
      <FeedbackForm />
    </Suspense>
  )
}
