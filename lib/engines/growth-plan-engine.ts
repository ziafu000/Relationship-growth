// Growth Plan Engine - Core recommendation logic
import { createClient } from '@/lib/supabase/server'

export type Pillar = 'understanding' | 'communication' | 'appreciation' | 'connection' | 'novelty' | 'repair'

interface Activity {
  id: string
  slug: string
  title_vi: string
  description_vi: string | null
  category: string
  pillar: string[]
  relationship_type: string[]
  effort_level: 'low' | 'medium' | 'high'
  time_required_minutes: number | null
  location_type: string | null
  city: string[] | null
  cost_range: string | null
  steps: any
  conversation_prompts: any | null
  tips: any | null
  tags: any | null
}

interface CheckIn {
  id: string
  current_mood: string
  connection_level: number
  time_together_recently: string
  recent_challenges: string[] | null
  what_matters_now: string
  available_time: string
  budget_preference: string
  location_preference: string
}

interface RelationshipPassport {
  partner1_love_languages: string[] | null
  partner1_interests: string[] | null
}

interface PlanGenerationContext {
  goalType: Pillar
  checkIn: CheckIn
  passport: RelationshipPassport | null
  relationshipType: 'new' | 'long_term'
  city: string | null
}

export async function generatePlans(context: PlanGenerationContext): Promise<any[]> {
  const supabase = await createClient()

  // Step 1: Filter activities based on context
  let query = supabase
    .from('activities')
    .select('*')
    .eq('is_active', true)
    .contains('pillar', [context.goalType])
    .contains('relationship_type', [context.relationshipType])

  // Filter by city if available
  if (context.city) {
    query = query.contains('city', [context.city])
  }

  // Filter by budget
  const budgetMap: Record<string, string[]> = {
    'free': ['free'],
    'budget': ['free', 'budget'],
    'moderate': ['free', 'budget', 'moderate'],
    'premium': ['free', 'budget', 'moderate', 'premium']
  }
  const allowedBudgets = budgetMap[context.checkIn.budget_preference] || ['free', 'budget']
  query = query.in('cost_range', allowedBudgets)

  // Filter by location preference
  const locationMap: Record<string, string[]> = {
    'home': ['home', 'virtual'],
    'nearby': ['home', 'indoor', 'outdoor'],
    'city_center': ['indoor', 'outdoor'],
    'anywhere': ['home', 'indoor', 'outdoor', 'virtual']
  }
  const allowedLocations = locationMap[context.checkIn.location_preference] || ['home', 'indoor']
  query = query.in('location_type', allowedLocations)

  const { data: activities, error } = await query

  if (error || !activities || activities.length === 0) {
    console.error('Error fetching activities:', error)
    return generateFallbackPlans(context)
  }

  // Step 2: Score and rank activities
  const scoredActivities = activities.map(activity => ({
    activity,
    score: scoreActivity(activity, context)
  }))

  scoredActivities.sort((a, b) => b.score - a.score)

  // Step 3: Select top 3 with diversity
  const selectedActivities = selectDiverseActivities(scoredActivities, 3)

  // Step 4: Generate plans from activities
  return selectedActivities.map((item, index) => ({
    activity_id: item.activity.id,
    plan_title_vi: item.activity.title_vi,
    reasoning_vi: generateReasoning(item.activity, context),
    steps: item.activity.steps,
    conversation_starters: item.activity.conversation_prompts || [],
    tips: item.activity.tips,
    estimated_time_minutes: item.activity.time_required_minutes,
    effort_level: item.activity.effort_level,
    rank: index + 1,
    scoring_metadata: {
      score: item.score,
      pillar_match: item.activity.pillar.includes(context.goalType),
      effort_level: item.activity.effort_level,
      cost_range: item.activity.cost_range
    }
  }))
}

function scoreActivity(activity: Activity, context: PlanGenerationContext): number {
  let score = 0

  // Pillar match (30 points)
  if (activity.pillar.includes(context.goalType)) {
    score += 30
  }

  // Preference match (25 points)
  if (context.passport?.partner1_interests) {
    const matchingInterests = context.passport.partner1_interests.filter(interest =>
      activity.tags?.includes(interest) ||
      activity.description_vi?.toLowerCase().includes(interest.toLowerCase())
    )
    score += matchingInterests.length * 5
  }

  // Effort level match (20 points)
  const effortMap: Record<string, string[]> = {
    'great': ['medium', 'high'],
    'good': ['low', 'medium'],
    'neutral': ['low'],
    'stressed': ['low'],
    'disconnected': ['low', 'medium']
  }
  const preferredEffort = effortMap[context.checkIn.current_mood] || ['low']
  if (preferredEffort.includes(activity.effort_level)) {
    score += 20
  }

  // Time match (15 points)
  const timeMap: Record<string, number> = {
    'tonight': 90,
    'this_weekend': 180,
    'next_week': 240,
    'flexible': 180
  }
  const availableMinutes = timeMap[context.checkIn.available_time] || 120
  if (activity.time_required_minutes && activity.time_required_minutes <= availableMinutes) {
    score += 15
  }

  // Connection level bonus (10 points)
  if (context.checkIn.connection_level >= 7 && activity.pillar.includes('novelty')) {
    score += 10
  } else if (context.checkIn.connection_level <= 4 && activity.pillar.includes('repair')) {
    score += 10
  }

  return score
}

function selectDiverseActivities(scored: Array<{activity: Activity, score: number}>, count: number): Array<{activity: Activity, score: number}> {
  const selected: Array<{activity: Activity, score: number}> = []
  const usedEffortLevels = new Set<string>()
  const usedLocationTypes = new Set<string>()

  for (const item of scored) {
    if (selected.length >= count) break

    // Prefer diversity in effort and location
    const isDiverse =
      !usedEffortLevels.has(item.activity.effort_level) ||
      !usedLocationTypes.has(item.activity.location_type || 'unknown') ||
      selected.length === 0

    if (isDiverse || scored.indexOf(item) < count * 2) {
      selected.push(item)
      usedEffortLevels.add(item.activity.effort_level)
      if (item.activity.location_type) {
        usedLocationTypes.add(item.activity.location_type)
      }
    }
  }

  // Fill remaining slots if not enough diverse options
  while (selected.length < count && selected.length < scored.length) {
    const remaining = scored.filter(item => !selected.includes(item))
    if (remaining.length > 0) {
      selected.push(remaining[0])
    } else {
      break
    }
  }

  return selected
}

function generateReasoning(activity: Activity, context: PlanGenerationContext): string {
  const reasonParts: string[] = []

  if (activity.pillar.includes(context.goalType)) {
    const goalNames: Record<Pillar, string> = {
      'understanding': 'hiểu nhau sâu sắc hơn',
      'communication': 'cải thiện giao tiếp',
      'appreciation': 'thể hiện sự trân trọng',
      'connection': 'tăng cường kết nối',
      'novelty': 'trải nghiệm điều mới',
      'repair': 'hàn gắn mối quan hệ'
    }
    reasonParts.push(`Hoạt động này giúp bạn ${goalNames[context.goalType]}`)
  }

  if (activity.effort_level === 'low') {
    reasonParts.push('dễ thực hiện')
  }

  if (activity.cost_range === 'free' || activity.cost_range === 'budget') {
    reasonParts.push('phù hợp với ngân sách')
  }

  if (context.checkIn.available_time === 'tonight' && activity.time_required_minutes && activity.time_required_minutes <= 90) {
    reasonParts.push('có thể làm ngay tối nay')
  }

  const reasoning = reasonParts.length > 0
    ? reasonParts.join(', ') + '.'
    : `${activity.title_vi} là lựa chọn phù hợp với hoàn cảnh hiện tại của bạn.`

  return reasoning.charAt(0).toUpperCase() + reasoning.slice(1)
}

function generateFallbackPlans(context: PlanGenerationContext): any[] {
  // Fallback plans when no activities in database
  const fallbackActivities = [
    {
      title: 'Trò chuyện sâu trong 20 phút',
      description: 'Dành 20 phút không bị làm phiền để chia sẻ với nhau',
      steps: [
        { order: 1, instruction_vi: 'Tìm một nơi yên tĩnh, tắt điện thoại' },
        { order: 2, instruction_vi: 'Mỗi người chia sẻ 1 điều đang nghĩ trong tuần này' },
        { order: 3, instruction_vi: 'Lắng nghe không ngắt lời, hỏi thêm nếu muốn hiểu rõ' }
      ],
      effort: 'low',
      time: 20
    },
    {
      title: 'Dạo bộ cùng nhau',
      description: 'Đi bộ 30 phút trong khu phố hoặc công viên gần nhà',
      steps: [
        { order: 1, instruction_vi: 'Chọn tuyến đường quen thuộc hoặc mới' },
        { order: 2, instruction_vi: 'Vừa đi vừa trò chuyện hoặc im lặng thoải mái' },
        { order: 3, instruction_vi: 'Quan sát xung quanh và chia sẻ điều thú vị' }
      ],
      effort: 'low',
      time: 30
    },
    {
      title: 'Viết thư cảm ơn nhau',
      description: 'Mỗi người viết 3 điều trân trọng ở người kia',
      steps: [
        { order: 1, instruction_vi: 'Lấy giấy và bút, ngồi riêng 10 phút' },
        { order: 2, instruction_vi: 'Viết 3 điều bạn trân trọng về người ấy' },
        { order: 3, instruction_vi: 'Đọc to cho nhau nghe' }
      ],
      effort: 'low',
      time: 30
    }
  ]

  return fallbackActivities.map((activity, index) => ({
    activity_id: null,
    plan_title_vi: activity.title,
    reasoning_vi: `${activity.description}. Phù hợp với hoàn cảnh hiện tại của bạn.`,
    steps: activity.steps,
    conversation_starters: [],
    tips: null,
    estimated_time_minutes: activity.time,
    effort_level: activity.effort,
    rank: index + 1,
    scoring_metadata: { fallback: true }
  }))
}
