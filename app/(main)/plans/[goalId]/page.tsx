import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PlanCard from '@/components/plans/PlanCard'

export default async function PlansViewPage({
  params,
}: {
  params: { goalId: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch plans for this goal
  const { data: plans, error } = await supabase
    .from('plans')
    .select('*')
    .eq('goal_id', params.goalId)
    .order('rank', { ascending: true })

  if (error || !plans || plans.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F4EF] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 border border-[#E7E1D7] max-w-md text-center">
          <div className="text-4xl mb-4">😔</div>
          <h2 className="font-serif text-2xl text-[#1F2421] mb-3">
            Không tìm thấy kế hoạch
          </h2>
          <p className="text-[#5C635D] font-light mb-6">
            Vui lòng thử lại hoặc tạo check-in mới
          </p>
          <a
            href="/dashboard"
            className="inline-block px-6 py-3 bg-[#C4612F] text-white rounded-full font-light hover:bg-[#A94E22] transition-all"
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
    .eq('id', params.goalId)
    .single()

  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#E7E1D7]">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-xl tracking-tight text-[#1F2421]">
              Kế hoạch hành động
            </h1>
            <a
              href="/dashboard"
              className="text-sm font-light text-[#5C635D] hover:text-[#C4612F] transition-colors"
            >
              Về Dashboard
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Intro */}
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-[#F2E3D6] text-[#C4612F] text-xs font-medium mb-4">
            3 lựa chọn dành riêng cho bạn
          </span>
          <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-[#1F2421] mb-3">
            Chọn <span className="italic text-[#C4612F]">một kế hoạch</span> để bắt đầu
          </h2>
          <p className="text-[#5C635D] font-light max-w-2xl mx-auto">
            {goal?.goal_description_vi || 'Mỗi kế hoạch được thiết kế phù hợp với hoàn cảnh của bạn'}
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid gap-6 mb-8">
          {plans.map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isActive={index === 0}
            />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="text-center p-6 bg-white rounded-2xl border border-[#E7E1D7]">
          <p className="text-sm font-light text-[#5C635D] mb-3">
            Không thấy kế hoạch phù hợp?
          </p>
          <a
            href="/check-in"
            className="inline-block px-6 py-2 border border-[#E7E1D7] text-[#5C635D] rounded-full font-light hover:border-[#C4612F] hover:text-[#C4612F] transition-all text-sm"
          >
            Làm check-in mới
          </a>
        </div>
      </div>
    </div>
  )
}
