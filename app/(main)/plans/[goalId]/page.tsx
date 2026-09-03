import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PlanCard from '@/components/plans/PlanCard'

export default async function PlansViewPage({
  params,
}: {
  params: Promise<{ goalId: string }>
}) {
  const resolvedParams = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch plans for this goal
  const { data: plans, error } = await supabase
    .from('plans')
    .select('*')
    .eq('goal_id', resolvedParams.goalId)
    .order('rank', { ascending: true })

  if (error || !plans || plans.length === 0) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
        <div className="bg-white p-6 shadow-md border border-gray-200 max-w-md text-center transform -rotate-1">
          <div className="text-4xl mb-4 emoji-bounce">😔</div>
          <h2 className="font-handwriting text-3xl font-bold text-gray-800 mb-3">
            Không tìm thấy kế hoạch
          </h2>
          <p className="text-gray-600 font-light mb-6 font-handwriting text-lg">
            Vui lòng thử lại hoặc tạo check-in mới
          </p>
          <a
            href="/dashboard"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-handwriting text-xl py-3 px-6 shadow-md transition-colors w-full"
          >
            Về Dashboard
          </a>
        </div>
      </div>
    )
  }

  // Fetch goal details
  const { data: goal } = await supabase
    .from('goals')
    .select('*')
    .eq('id', resolvedParams.goalId)
    .single()

  type Goal = { goal_description_vi?: string; [key: string]: any }

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Floating Decorations */}
      <div className="fixed top-20 right-10 text-6xl opacity-20 float-animation">🎯</div>
      <div className="fixed bottom-32 left-10 text-5xl opacity-20 float-animation" style={{animationDelay: '1s'}}>✨</div>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b-2 border-orange-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-handwriting text-2xl font-bold text-gray-800">
              Kế hoạch hành động 🚀
            </h1>
            <a
              href="/dashboard"
              className="text-sm font-handwriting text-gray-600 hover:text-orange-500 transition-colors"
            >
              Về Dashboard
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Intro */}
        <div className="text-center mb-8">
          <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 text-sm font-handwriting mb-4 transform rotate-1">
            🎁 3 lựa chọn dành riêng cho bạn
          </span>
          <h2 className="font-handwriting text-3xl md:text-4xl font-bold text-gray-800 mb-3 mt-4">
            Chọn <span className="text-orange-700">một kế hoạch</span> để bắt đầu
          </h2>
          <p className="text-gray-600 font-light max-w-2xl mx-auto font-handwriting text-xl">
            {(goal as Goal | null)?.goal_description_vi || 'Mỗi kế hoạch được thiết kế phù hợp với hoàn cảnh của bạn'}
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid gap-6 mb-8">
          {plans.map((plan: any, index: number) => (
            <PlanCard
              key={(plan as any).id}
              plan={plan}
              isActive={index === 0}
            />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="bg-white p-6 shadow-md border border-gray-200 text-center transform -rotate-1">
          <p className="text-sm font-light text-gray-600 mb-3 font-handwriting text-lg">
            Không thấy kế hoạch phù hợp?
          </p>
          <a
            href="/check-in"
            className="inline-block border-2 border-orange-200 bg-white hover:bg-orange-50 text-gray-700 font-handwriting py-2 px-4 transition-colors"
          >
            Làm check-in mới
          </a>
        </div>
      </div>
    </div>
  )
}
