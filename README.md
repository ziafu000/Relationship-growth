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

See detailed instructions in **[SUPABASE.md](SUPABASE.md)**

**Quick setup:**

1. Create project at [supabase.com](https://supabase.com)
2. Copy credentials to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Install Supabase CLI and apply migrations:

```bash
npm install -g supabase
npm run supabase:link
npm run db:push
```

4. Run development server:

```bash
npm run dev
```

**For detailed setup, troubleshooting, and verification:** See [SUPABASE.md](SUPABASE.md)

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

See [PROJECT_STATUS.md](PROJECT_STATUS.md) for detailed roadmap.

**Next priority phases:**
- **Phase 8:** Relationship Memory - Learn from feedback, personalize recommendations
- **Phase 9:** Couple Mode - Partner invitations, consent management
- **Phase 10:** Admin Panel - Activity CRUD, analytics dashboard
- **Phase 11-14:** PWA, Localization, Testing, Production features

**Current focus:** MVP is complete. Next step is implementing the Memory System to enable learning and personalization.

## 🚧 Manual Tasks Required

See [SUPABASE.md](SUPABASE.md) for detailed setup instructions.

**Quick checklist:**
1. ✅ Create Supabase project
2. ✅ Copy credentials to `.env.local`
3. ✅ Install Supabase CLI: `npm install -g supabase`
4. ✅ Link project: `npm run supabase:link`
5. ✅ Apply migrations: `npm run db:push`
6. ✅ Seed sample activities (optional)
7. ⚠️ Configure Site URL in Supabase Dashboard for production

**For troubleshooting:** See [SUPABASE.md](SUPABASE.md#troubleshooting)

## 🎨 Design Philosophy

**Warm & Earthy** - Không phải cold blue corporate, mà là warm terracotta và cream.

**Editorial Typography** - Serif headings với một từ nghiêng, sans-serif body.

**Thoughtful Density** - Không phải uniform flat design, mà varied spacing và hierarchy.

**Human Touch** - Emojis, warm language, personal pronouns.

## 📝 Notes

- **Database:** 13 tables with RLS policies for privacy
- **Migrations:** All applied and verified - see [SUPABASE.md](SUPABASE.md)
- **AI Provider:** Currently `none` (rules-based only), can add Claude/OpenAI later
- **Mode:** Solo mode (default), Couple mode not implemented yet (Phase 9)
- **Memory:** Structure exists but learning system not active yet (Phase 8)
- **Sample Data:** 6 activities seeded for testing
- **Design:** Warm & Earthy (terracotta accent, cream background)

## 📚 Documentation

- **[README.md](README.md)** - This file - project overview and quick start
- **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Current implementation status and roadmap
- **[SUPABASE.md](SUPABASE.md)** - Database setup, migrations, and troubleshooting
- **[CLAUDE.md](CLAUDE.md)** - Complete 14-phase implementation plan
- **[Relationship_Growth_OS_Tong_Quan_Du_An.md](Relationship_Growth_OS_Tong_Quan_Du_An.md)** - Vietnamese project overview and product thesis

## 🙏 Credits

Built with Next.js, Supabase, and lots of ❤️

---

**Status:** MVP Complete - Ready for Testing
**Last Updated:** 2026-08-27
