import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions/auth'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ feedback_submitted?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: membership, error: membershipError } = await supabase
    .from('relationship_members')
    .select('relationship_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  if (membershipError) {
    throw new Error('Unable to determine onboarding status')
  }

  if (!membership) {
    redirect('/onboarding')
  }

  const feedbackSubmitted = resolvedSearchParams.feedback_submitted === 'true'

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Floating Decorations */}
      <div className="fixed top-20 right-10 text-6xl opacity-20 float-animation">💕</div>
      <div className="fixed bottom-32 left-10 text-5xl opacity-20 float-animation" style={{animationDelay: '1s'}}>🌟</div>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b-2 border-pink-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="shrink-0 font-heading text-xl font-bold text-gray-800">
            Relationship <span className="text-primary italic">Growth</span>
          </h1>
          <div className="flex w-full min-w-0 flex-row items-center justify-between gap-3 sm:w-auto sm:justify-end">
            <span className="min-w-0 truncate text-sm font-light text-gray-600 sm:max-w-xs sm:text-right">
              {user.email}
            </span>
            <form action={logout} className="shrink-0">
              <button
                type="submit"
                className="text-sm font-light text-primary hover:text-pink-600 transition-colors whitespace-nowrap"
              >
                Đăng xuất
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Success Message */}
        {feedbackSubmitted && (
          <div className="mb-8 bg-green-50 border-2 border-green-200 rounded-[24px] p-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl emoji-bounce">🎉</div>
              <div>
                <h3 className="font-heading text-lg font-bold text-green-900 mb-1">
                  Cảm ơn bạn đã chia sẻ!
                </h3>
                <p className="text-sm font-light text-green-800">
                  Feedback của bạn giúp chúng tôi cải thiện đề xuất cho lần sau. Sẵn sàng cho một trải nghiệm mới?
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center py-16">
          <span className="badge-bubble badge-pink mb-4">
            💕 Chào mừng
          </span>
          <h2 className="font-heading text-4xl font-bold text-gray-800 mb-4 mt-4">
            Chào mừng trở lại, <span className="text-primary italic">{user.user_metadata?.name || 'bạn'}</span>!
          </h2>
          <p className="text-gray-600 font-light max-w-xl mx-auto mb-8">
            Sẵn sàng nuôi dưỡng mối quan hệ của bạn hôm nay chưa?
          </p>

          <a
            href="/check-in"
            className="btn-bubble btn-primary inline-flex items-center gap-2"
          >
            ✨ Bắt đầu Check-in
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>

          {/* Next Steps Preview */}
          <div className="max-w-2xl mx-auto mt-12 grid gap-4">
            <div className="bubble-card bg-gradient-to-br from-white to-green-50/30 text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-bubble-green flex items-center justify-center text-primary font-bold text-sm">
                  ✓
                </div>
                <h3 className="font-heading text-lg font-bold text-gray-800">Onboarding</h3>
              </div>
              <p className="text-sm font-light text-gray-600 ml-11">
                Đã hoàn thành thiết lập
              </p>
            </div>

            <div className="bubble-card bg-gradient-to-br from-white to-blue-50/30 text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-bubble-blue flex items-center justify-center text-primary font-bold text-sm">
                  1
                </div>
                <h3 className="font-heading text-lg font-bold text-gray-800">Check-in</h3>
              </div>
              <p className="text-sm font-light text-gray-600 ml-11">
                Chia sẻ tâm trạng và mức độ kết nối hiện tại
              </p>
            </div>

            <div className="bubble-card bg-gradient-to-br from-white to-purple-50/30 text-left opacity-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-bubble-purple flex items-center justify-center text-primary font-bold text-sm">
                  2
                </div>
                <h3 className="font-heading text-lg font-bold text-gray-800">Growth Plans</h3>
              </div>
              <p className="text-sm font-light text-gray-600 ml-11">
                Nhận 3 kế hoạch hành động được cá nhân hóa
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
