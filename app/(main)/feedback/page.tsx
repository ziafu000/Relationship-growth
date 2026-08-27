'use client'

import { useState, useEffect } from 'react'
import { submitFeedback } from '@/app/actions/feedback'
import { useSearchParams } from 'next/navigation'

export default function FeedbackPage() {
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
    <div className="min-h-screen bg-[#F7F4EF]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#E7E1D7]">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="font-serif text-xl tracking-tight text-[#1F2421]">
            Feedback
          </h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E7E1D7]">
          <span className="inline-block px-3 py-1 rounded-full bg-[#F2E3D6] text-[#C4612F] text-xs font-medium mb-4">
            Chia sẻ trải nghiệm
          </span>
          <h2 className="font-serif text-3xl tracking-tight text-[#1F2421] mb-3">
            Mọi thứ diễn ra <span className="italic text-[#C4612F]">thế nào</span>?
          </h2>
          <p className="text-[#5C635D] font-light mb-8">
            Feedback của bạn giúp chúng tôi đề xuất tốt hơn cho lần sau
          </p>

          {/* Outcome */}
          <div className="mb-8">
            <h3 className="font-serif text-lg text-[#1F2421] mb-3">
              Tổng thể, trải nghiệm như thế nào? *
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'great', label: '😊 Tuyệt vời', emoji: '😊' },
                { id: 'good', label: '🙂 Tốt', emoji: '🙂' },
                { id: 'okay', label: '😐 Ổn', emoji: '😐' },
                { id: 'difficult', label: '😰 Khó khăn', emoji: '😰' },
                { id: 'didnt_work', label: '😔 Không hiệu quả', emoji: '😔' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setOutcome(item.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    outcome === item.id
                      ? 'border-[#C4612F] bg-[#F2E3D6]'
                      : 'border-[#E7E1D7] bg-white hover:border-[#C4612F]/30'
                  }`}
                >
                  <div className="text-2xl mb-1">{item.emoji}</div>
                  <div className="text-sm font-light text-[#1F2421]">
                    {item.label.replace(item.emoji + ' ', '')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* What Worked */}
          <div className="mb-8">
            <h3 className="font-serif text-lg text-[#1F2421] mb-3">
              Điều gì hiệu quả?
            </h3>
            <p className="text-sm font-light text-[#5C635D] mb-3">Chọn tất cả những gì áp dụng</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'timing', label: 'Thời điểm phù hợp' },
                { id: 'activity_choice', label: 'Hoạt động phù hợp' },
                { id: 'conversation', label: 'Trò chuyện sâu sắc' },
                { id: 'atmosphere', label: 'Không khí tốt' },
                { id: 'steps_clear', label: 'Hướng dẫn rõ ràng' },
                { id: 'bonding', label: 'Tăng kết nối' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleWorked(item.id)}
                  className={`p-3 rounded-xl border-2 text-sm transition-all ${
                    whatWorked.includes(item.id)
                      ? 'border-[#C4612F] bg-[#F2E3D6]'
                      : 'border-[#E7E1D7] bg-white hover:border-[#C4612F]/30'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* What Didn't Work */}
          <div className="mb-8">
            <h3 className="font-serif text-lg text-[#1F2421] mb-3">
              Điều gì chưa tốt?
            </h3>
            <p className="text-sm font-light text-[#5C635D] mb-3">Giúp chúng tôi cải thiện</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'too_long', label: 'Quá dài' },
                { id: 'too_expensive', label: 'Quá tốn kém' },
                { id: 'uncomfortable', label: 'Không thoải mái' },
                { id: 'bad_timing', label: 'Thời điểm không phù hợp' },
                { id: 'unclear_steps', label: 'Hướng dẫn chưa rõ' },
                { id: 'didnt_enjoy', label: 'Không thích' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleDidntWork(item.id)}
                  className={`p-3 rounded-xl border-2 text-sm transition-all ${
                    whatDidntWork.includes(item.id)
                      ? 'border-[#C4612F] bg-[#F2E3D6]'
                      : 'border-[#E7E1D7] bg-white hover:border-[#C4612F]/30'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Partner Reaction */}
          <div className="mb-8">
            <h3 className="font-serif text-lg text-[#1F2421] mb-3">
              Phản ứng của người ấy?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'loved_it', label: '💖 Rất thích' },
                { id: 'enjoyed', label: '😊 Thích' },
                { id: 'neutral', label: '😐 Bình thường' },
                { id: 'uncomfortable', label: '😕 Không thoải mái' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPartnerReaction(item.id)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    partnerReaction === item.id
                      ? 'border-[#C4612F] bg-[#F2E3D6]'
                      : 'border-[#E7E1D7] bg-white hover:border-[#C4612F]/30'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Would Repeat */}
          <div className="mb-8">
            <h3 className="font-serif text-lg text-[#1F2421] mb-3">
              Bạn có muốn làm lại hoạt động này không? *
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setWouldRepeat(true)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  wouldRepeat === true
                    ? 'border-[#C4612F] bg-[#F2E3D6]'
                    : 'border-[#E7E1D7] bg-white hover:border-[#C4612F]/30'
                }`}
              >
                <div className="text-2xl mb-1">👍</div>
                <div className="text-sm font-light">Có, chắc chắn</div>
              </button>
              <button
                type="button"
                onClick={() => setWouldRepeat(false)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  wouldRepeat === false
                    ? 'border-[#C4612F] bg-[#F2E3D6]'
                    : 'border-[#E7E1D7] bg-white hover:border-[#C4612F]/30'
                }`}
              >
                <div className="text-2xl mb-1">👎</div>
                <div className="text-sm font-light">Không</div>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-8">
            <h3 className="font-serif text-lg text-[#1F2421] mb-3">
              Ghi chú thêm (tùy chọn)
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Chia sẻ thêm về trải nghiệm của bạn..."
              rows={4}
              className="w-full px-4 py-3 border border-[#E7E1D7] rounded-xl font-light text-[#1F2421] placeholder:text-[#5C635D]/50 focus:outline-none focus:border-[#C4612F] transition-colors resize-none"
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !outcome || wouldRepeat === null}
            className="w-full px-6 py-3 bg-[#C4612F] text-white rounded-full font-light hover:bg-[#A94E22] transition-all hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? 'Đang gửi...' : 'Hoàn thành'}
          </button>
        </div>
      </div>
    </div>
  )
}
