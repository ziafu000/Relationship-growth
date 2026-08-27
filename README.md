# Relationship Growth OS

Relationship Action Platform helping couples understand each other better through structured check-ins, personalized action plans, and learning system.

## 🎯 Project Overview

**Current Stage:** Idea Exploration → Product Concept Validation  
**Target Market:** Hanoi & Ho Chi Minh City (Vietnam)  
**MVP Goal:** Prove that users understand value, select plans, take real-world actions, and return

### Core Loop
Check-in → Goal Selection → 3 Plans → Action → Feedback → Memory → Personalization

## 🛠 Tech Stack

- **Frontend:** Next.js 14+ (App Router) + React + TypeScript
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **AI Provider:** Flexible architecture (to be decided - Claude/GPT-4/hybrid)
- **Deployment:** Vercel
- **Mobile:** PWA (Progressive Web App) - mobile-first responsive design
- **Analytics:** PostHog + Sentry
- **i18n:** Vietnamese (primary) + English

## 📁 Project Structure

```
relationship-growth-os/
├── app/                    # Next.js App Router
├── components/             # React components
│   ├── ui/                # Base UI components
│   ├── check-in/          # Check-in flow
│   ├── goals/             # Goal selection
│   ├── plans/             # Plan display & selection
│   ├── activities/        # Activity execution
│   ├── feedback/          # Feedback forms
│   ├── couple/            # Couple mode features
│   ├── memory/            # Memory insights
│   └── admin/             # Admin panel
├── lib/                   # Business logic
│   ├── engines/           # Core engines (state, plans, memory)
│   ├── ai/               # AI provider abstraction
│   ├── scoring/          # Activity scoring
│   ├── supabase/         # Supabase clients
│   ├── analytics/        # PostHog integration
│   └── utils/            # Utilities
├── types/                 # TypeScript definitions
├── hooks/                 # React hooks
├── store/                 # State management (Zustand)
├── i18n/                  # Internationalization
├── supabase/
│   ├── migrations/       # Database migrations
│   └── seed/             # Seed data (activities)
└── docs/                  # Documentation

```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works for development)
- (Optional) PostHog account for analytics
- (Optional) AI provider API key (Anthropic/OpenAI)

### 1. Clone and Install

```bash
# Already in project directory
npm install
```

### 2. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create `.env.local` from template:

```bash
cp .env.local.example .env.local
```

4. Fill in your Supabase credentials in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Run Database Migrations

Install Supabase CLI:

```bash
npm install -g supabase
```

Initialize and link to your project:

```bash
supabase init
supabase link --project-ref your-project-ref
```

Run migrations:

```bash
supabase db push
```

Seed sample activities:

```bash
supabase db seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

The database consists of 13 core tables:

1. **users** - User profiles (extends Supabase auth)
2. **relationships** - Relationship records
3. **relationship_members** - User-relationship mapping with consent
4. **relationship_passports** - Long-term memory (preferences, boundaries)
5. **activities** - Structured activity library
6. **check_ins** - User check-in responses
7. **goals** - Selected goals
8. **plans** - Generated growth plans
9. **plan_executions** - Activity execution tracking
10. **feedback** - User feedback after completion
11. **relationship_memory** - Learning from feedback
12. **couple_invitations** - Partner invitation system
13. **analytics_events** - Event tracking

All tables have Row-Level Security (RLS) enabled for privacy.

## 🏗 Implementation Phases

### Phase 0: Project Setup ✅
- [x] Initialize Next.js with TypeScript
- [x] Create project structure
- [x] Setup database migrations
- [x] Configure environment variables
- [x] Create type definitions

### Phase 1: Database & Auth (Current)
- [ ] Run migrations on Supabase
- [ ] Setup Supabase Auth
- [ ] Build login/signup pages
- [ ] Create auth middleware
- [ ] Seed initial activities

### Phase 2: Onboarding
- [ ] Build onboarding flow
- [ ] Relationship type selection
- [ ] Initial passport setup
- [ ] Analytics tracking

### Phase 3: Check-in System
- [ ] Check-in form UI
- [ ] Mood & connection selectors
- [ ] Context inputs
- [ ] Submit & store check-ins

### Phase 4: Goal System
- [ ] Goal selection UI
- [ ] Map check-in to goals
- [ ] Store selected goals

### Phase 5: Growth Plan Engine
- [ ] Relationship state engine
- [ ] Activity filtering logic
- [ ] Scoring system
- [ ] Template-based plan generation
- [ ] Plan display UI

### Phase 6: Action & Execution
- [ ] Activity detail pages
- [ ] Step-by-step execution
- [ ] Progress tracking

### Phase 7: Feedback System
- [ ] Feedback forms
- [ ] Outcome capture
- [ ] Store feedback

### Phase 8: Relationship Memory
- [ ] Memory engine
- [ ] Learn from feedback
- [ ] Use memory in recommendations

### Phase 9: Couple Mode
- [ ] Partner invitation
- [ ] Consent management
- [ ] Data sharing

### Phase 10: Admin Panel
- [ ] Activity CRUD
- [ ] Rules configuration
- [ ] Analytics dashboard

### Phase 11-14: PWA, Localization, Testing, Launch
- [ ] PWA configuration
- [ ] Vietnamese/English content
- [ ] Testing & QA
- [ ] Pilot launch

## 🎨 Design Principles

- **Mobile-first:** All designs start with mobile viewport
- **Progressive disclosure:** Show summary first, details on demand
- **Warm and earthy palette:** Terracotta accent, cream backgrounds
- **Clear privacy controls:** Explicit consent for all data sharing
- **Offline-capable:** PWA with service worker for core features

## 🔐 Security & Privacy

- Row-Level Security (RLS) on all tables
- Solo Mode by default (no data sharing)
- Couple Mode opt-in with explicit consent
- Data deletion available anytime
- Sensitive data (feedback, check-ins) private by default

## 📈 Analytics Events

Key events tracked:
- Onboarding flow
- Check-in completion
- Plan selection (by rank 1, 2, 3)
- Activity completion
- Feedback submission
- Couple mode activation

## 🤝 Contributing

This is currently a private project in early development. 

## 📄 License

Private - All Rights Reserved

---

## 📞 Questions?

Refer to the detailed implementation plan at `.claude/plans/plan-c-ng-t-c-ch-quiet-clarke.md`

**Built with ❤️ for couples in Vietnam**
