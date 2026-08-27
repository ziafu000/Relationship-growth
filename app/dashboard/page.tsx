import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions/auth'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { feedback_submitted?: string }
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const feedbackSubmitted = searchParams.feedback_submitted === 'true'

  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#E7E1D7]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-serif text-xl tracking-tight text-[#1F2421]">
            Relationship <span className="italic text-[#C4612F]">Growth</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-light text-[#5C635D]">
              {user.email}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="text-sm font-light text-[#C4612F] hover:text-[#A94E22] transition-colors"
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
          <div className="mb-8 bg-green-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🎉</div>
              <div>
                <h3 className="font-serif text-lg text-green-900 mb-1">
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
          <span className="inline-block px-3 py-1 rounded-full bg-[#F2E3D6] text-[#C4612F] text-xs font-medium mb-4">
            Chào mừng
          </span>
          <h2 className="font-serif text-4xl tracking-tight text-[#1F2421] mb-4">
            Chào mừng trở lại, <span className="italic text-[#C4612F]">{user.user_metadata?.name || 'bạn'}</span>!
          </h2>
          <p className="text-[#5C635D] font-light max-w-xl mx-auto mb-8">
            Sẵn sàng nuôi dưỡng mối quan hệ của bạn hôm nay chưa?
          </p>

          <a
            href="/check-in"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#C4612F] text-white rounded-full font-light hover:bg-[#A94E22] transition-all hover:translate-y-[-2px]"
          >
            Bắt đầu Check-in
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>

          {/* Next Steps Preview */}
          <div className="max-w-2xl mx-auto mt-12 grid gap-4">
            <div className="bg-white rounded-2xl p-6 border border-[#E7E1D7] text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#F2E3D6] flex items-center justify-center text-[#C4612F] font-medium text-sm">
                  ✓
                </div>
                <h3 className="font-serif text-lg text-[#1F2421]">Onboarding</h3>
              </div>
              <p className="text-sm font-light text-[#5C635D] ml-11">
                Đã hoàn thành thiết lập
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E7E1D7] text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#F2E3D6] flex items-center justify-center text-[#C4612F] font-medium text-sm">
                  1
                </div>
                <h3 className="font-serif text-lg text-[#1F2421]">Check-in</h3>
              </div>
              <p className="text-sm font-light text-[#5C635D] ml-11">
                Chia sẻ tâm trạng và mức độ kết nối hiện tại
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E7E1D7] text-left opacity-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#F2E3D6] flex items-center justify-center text-[#C4612F] font-medium text-sm">
                  2
                </div>
                <h3 className="font-serif text-lg text-[#1F2421]">Growth Plans</h3>
              </div>
              <p className="text-sm font-light text-[#5C635D] ml-11">
                Nhận 3 kế hoạch hành động được cá nhân hóa
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
