# Relationship Growth OS

Nền tảng giúp các cặp đôi chủ động nuôi dưỡng mối quan hệ thông qua structured check-ins, personalized action plans và learning system.

## 🎯 Mục tiêu

Giúp các cặp đôi:
- Thấu hiểu nhau sâu sắc hơn
- Cải thiện giao tiếp
- Tăng cường kết nối cảm xúc
- Trải nghiệm những điều mới mẻ
- Xây dựng thói quen tích cực

## 🚀 Tech Stack

- **Frontend:** Next.js 14+ (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Deployment:** Vercel
- **State Management:** React Hooks (useState, useEffect)
- **Styling:** Warm & Earthy Design System

## 📦 Setup Instructions

### 1. Clone Repository

```bash
git clone <repository-url>
cd Relationship_Growth
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

1. Tạo project tại [supabase.com](https://supabase.com)
2. Copy credentials từ Settings → API
3. Tạo file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
Database_password=your_db_password

AI_PROVIDER=none
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

NEXT_PUBLIC_SENTRY_DSN=

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_CITY=hanoi
NEXT_PUBLIC_DEFAULT_LANGUAGE=vi
```

### 4. Run Database Migrations

Vào Supabase Dashboard → SQL Editor và chạy lần lượt:

1. `supabase/migrations/001_create_users_auth.sql`
2. `supabase/migrations/002_create_relationships.sql`
3. `supabase/migrations/003_create_relationship_members_passports.sql`
4. `supabase/migrations/004_create_activities.sql`
5. `supabase/migrations/005_create_check_ins_goals.sql`
6. `supabase/migrations/006_create_plans_executions.sql`
7. `supabase/migrations/007_create_feedback_memory.sql`
8. `supabase/migrations/008_create_rls_policies.sql`

### 5. Seed Sample Data

Chạy file `supabase/seed/sample-activities.sql` để thêm 6 activities mẫu.

### 6. Disable Email Confirmation (Development)

Supabase Dashboard → Authentication → Providers → Email → Tắt "Confirm email"

### 7. Run Development Server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

### Colors
- **Background:** Warm Cream `#F7F4EF`
- **Surface:** White `#FFFFFF`, Light `#FBF9F5`
- **Border:** `#E7E1D7`
- **Text:** Charcoal `#1F2421`, Muted `#5C635D`
- **Accent:** Terracotta `#C4612F`, Hover `#A94E22`
- **Accent Light:** `#F2E3D6`

### Typography
- **Serif:** Georgia, Cambria (headings)
- **Sans:** Geist Sans (body, UI)
- **Weights:** 300-500 (light to medium)

### Components
- Rounded-full buttons (999px)
- Rounded-3xl cards (24px)
- Backdrop blur headers
- Warm hairline borders
- Gentle shadows

## 📋 Features Implemented

### ✅ Phase 1: Authentication
- Email/password signup & login
- Protected routes with middleware
- User profiles
- Logout functionality

### ✅ Phase 2: Onboarding
- 3-step onboarding flow
- Relationship type selection (new/long_term)
- City selection (Hanoi/HCMC)
- Love languages & interests
- Passport creation

### ✅ Phase 3: Check-in System
- 3-step check-in flow
- Mood selector with emojis
- Connection level slider (1-10)
- Time together tracking
- Recent challenges
- What matters now
- Context (time, budget, location)

### ✅ Phase 4: Goal Selection
- 6 relationship pillars:
  - Understanding (Hiểu nhau sâu sắc)
  - Communication (Giao tiếp tốt hơn)
  - Appreciation (Thể hiện sự trân trọng)
  - Connection (Kết nối cảm xúc)
  - Novelty (Trải nghiệm mới)
  - Repair (Hàn gắn)
- Goal linked to check-in

### ✅ Phase 5: Growth Plan Engine
- Rules-based activity filtering
- Scoring algorithm (pillar match, preferences, context fit, effort level, time)
- Diversity guarantee (3 different plans)
- Template-based reasoning
- Fallback plans when no activities match

### ✅ Phase 6: Plan Execution
- Activity detail view
- Step-by-step guidance
- Conversation prompts
- Tips (do/don't)
- Progress tracking
- Step completion checkboxes
- Time estimation

### ✅ Phase 7: Feedback System
- Outcome rating (great → didn't work)
- What worked (multi-select)
- What didn't work (multi-select)
- Partner reaction
- Would repeat (yes/no)
- Notes (optional)
- Redirect to dashboard with success message

## 🔄 User Flow

```
1. Signup → Onboarding (3 steps) → Dashboard
2. Dashboard → Check-in (3 steps) → Goals
3. Goals → Plans (3 options) → Select Plan
4. Activity View → Complete Steps → Feedback
5. Feedback → Dashboard → Repeat
```

## 📂 Project Structure

```
relationship-growth-os/
├── app/
│   ├── (auth)/              # Auth routes
│   │   ├── login/
│   │   ├── signup/
│   │   └── onboarding/
│   ├── (main)/              # Protected routes
│   │   ├── check-in/
│   │   ├── goals/
│   │   ├── plans/
│   │   ├── activities/
│   │   └── feedback/
│   ├── actions/             # Server actions
│   │   ├── auth.ts
│   │   ├── onboarding.ts
│   │   ├── check-in.ts
│   │   ├── goals.ts
│   │   ├── plans.ts
│   │   ├── executions.ts
│   │   └── feedback.ts
│   ├── dashboard/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── plans/
│   │   └── PlanCard.tsx
│   └── activities/
│       └── ActivityView.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   └── engines/
│       └── growth-plan-engine.ts
├── types/
│   └── database.ts
├── supabase/
│   ├── migrations/          # 8 migration files
│   └── seed/
│       └── sample-activities.sql
├── middleware.ts
├── tailwind.config.ts
└── package.json
```

## 🗄️ Database Schema

### Core Tables
- `users` - User profiles
- `relationships` - Relationship entities
- `relationship_members` - User-relationship links
- `relationship_passports` - Preferences & memory
- `activities` - Activity library (6 samples)
- `check_ins` - Check-in responses
- `goals` - Selected goals
- `plans` - Generated action plans
- `plan_executions` - Execution tracking
- `feedback` - User feedback

## 🎯 What's NOT Implemented (Future Phases)

### Phase 8: Relationship Memory
- Process feedback into memory
- Learn preferences over time
- Avoid patterns identification
- Memory-driven recommendations

### Phase 9: Couple Mode
- Partner invitation
- Consent management
- Shared data access
- Joint activities

### Phase 10: Admin Panel
- Activity CRUD
- Rules configuration
- Analytics dashboard

### Phase 11: PWA
- Service worker
- Offline support
- Install prompts

### Phase 12: Localization
- Full English translations
- i18n setup

### Phase 13: Testing & QA
- E2E tests
- Unit tests

### Phase 14: Production Launch
- Analytics integration (PostHog)
- Error tracking (Sentry)
- Performance optimization

## 🚧 Manual Tasks Required

### 1. Supabase Setup
- Create project manually
- Copy credentials to `.env.local`
- Run all 8 migrations in SQL Editor
- Run seed file for sample activities
- Disable email confirmation for dev

### 2. Sample Activities
Run `supabase/seed/sample-activities.sql` để có 6 activities:
1. Dạo phố cổ Hà Nội và uống cà phê
2. Cùng nhau nấu bữa tối
3. Trò chuyện sâu với 20 câu hỏi
4. Picnic bên Hồ Tây
5. Viết thư cảm ơn nhau
6. Nghi thức cà phê sáng

### 3. Production Deployment
- Connect Vercel to repository
- Add environment variables
- Deploy

### 4. Analytics (Optional)
- Create PostHog account
- Create Sentry project
- Add API keys to `.env.local`

## 🎨 Design Philosophy

**Warm & Earthy** - Không phải cold blue corporate, mà là warm terracotta và cream.

**Editorial Typography** - Serif headings với một từ nghiêng, sans-serif body.

**Thoughtful Density** - Không phải uniform flat design, mà varied spacing và hierarchy.

**Human Touch** - Emojis, warm language, personal pronouns.

## 📝 Notes

- AI Provider hiện tại: `none` (rules-based only)
- Có thể thêm Claude/OpenAI sau cho personalization tốt hơn
- Database có RLS policies để đảm bảo privacy
- Solo mode là default, Couple mode chưa implement
- Memory system chưa hoạt động (Phase 8)

## 🙏 Credits

Built with Next.js, Supabase, and lots of ❤️

---

**Status:** MVP Complete - Ready for Testing
**Last Updated:** 2026-08-27
