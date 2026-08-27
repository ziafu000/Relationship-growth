# Next Steps - Setup Guide

## ✅ Completed
1. Project structure created
2. TypeScript types defined for all domain models
3. Database migrations written (8 migration files)
4. Supabase client configuration created
5. Middleware for authentication set up
6. Sample activities created (5 activities for Hanoi)
7. Environment template created

## 🔧 Immediate Next Steps

### 1. Install Additional Dependencies

Once the current npm install completes, add these packages:

```bash
# Supabase
npm install @supabase/ssr @supabase/supabase-js

# State Management
npm install zustand

# Forms
npm install react-hook-form @hookform/resolvers zod

# UI Components (Shadcn approach)
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select
npm install @radix-ui/react-slider @radix-ui/react-tabs @radix-ui/react-toast
npm install class-variance-authority clsx tailwind-merge lucide-react

# Internationalization
npm install next-intl

# Analytics (optional for now)
npm install posthog-js

# PWA
npm install next-pwa

# Date handling
npm install date-fns
```

### 2. Setup Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for it to initialize (takes ~2 minutes)
3. Get your credentials:
   - Project URL: Settings → API → Project URL
   - Anon key: Settings → API → anon/public key
   - Service role key: Settings → API → service_role key
4. Create `.env.local` file and fill in the credentials

### 3. Run Database Migrations

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push all migrations to create tables
supabase db push

# Seed sample activities
psql $DATABASE_URL < supabase/seed/activities-hanoi.sql
```

### 4. Test the Setup

```bash
npm run dev
```

Visit `http://localhost:3000` - you should see the Next.js default page.

### 5. Build First Features

Start with **Phase 1: Database & Auth**

**Priority tasks:**
1. Create login page (`app/(auth)/login/page.tsx`)
2. Create signup page (`app/(auth)/signup/page.tsx`)
3. Add authentication actions (`app/actions/auth.ts`)
4. Test user registration and login
5. Verify RLS policies work

## 📋 Key Decisions Still Needed

### 1. AI Provider (High Priority)
**Options:**
- **Anthropic Claude** - Best for structured output, safety, Vietnamese content
- **OpenAI GPT-4** - Popular, good ecosystem
- **Start without AI** - Use template-based generation first

**Recommendation:** Start without AI (rules + templates only) to validate core loop, then add AI for personalization in Phase 5.

### 2. UI Component Library
**Options:**
- **Shadcn UI** (Recommended) - Copy/paste components, full control
- **Radix UI primitives** - Build from scratch
- **Material UI** - Full featured but heavier

**Recommendation:** Shadcn UI for speed + flexibility.

### 3. State Management Details
- **Zustand** already planned - lightweight and good for MVP
- Alternative: TanStack Query for server state + Zustand for UI state

## 🎯 MVP Feature Checklist

### Core Flow (Must Have)
- [ ] User authentication (email/password)
- [ ] Onboarding (relationship type selection)
- [ ] Check-in form (mood, connection, context)
- [ ] Goal selection (6 pillars)
- [ ] Generate 3 plans (rules-based)
- [ ] Display plans in mobile-friendly carousel
- [ ] Select a plan
- [ ] Show activity steps
- [ ] Mark activity complete
- [ ] Submit feedback
- [ ] Store feedback in memory

### Admin (Must Have)
- [ ] Activity CRUD (create, read, update, deactivate)
- [ ] View basic analytics (completion rates)

### Nice to Have (Post-MVP)
- [ ] Partner invitation
- [ ] Couple mode
- [ ] AI-powered personalization
- [ ] Push notifications
- [ ] Advanced analytics dashboard

## 🚨 Common Issues & Solutions

### Issue: Supabase connection fails
**Solution:** Check .env.local file exists and has correct values (no quotes, no spaces)

### Issue: RLS policies block queries
**Solution:** Make sure user is authenticated. Check policies with:
```sql
SELECT * FROM pg_policies WHERE tablename = 'your_table';
```

### Issue: TypeScript errors
**Solution:** Generate Supabase types:
```bash
supabase gen types typescript --project-id YOUR_PROJECT_REF > types/database.ts
```

### Issue: Migrations fail
**Solution:** Run migrations one by one to identify which fails:
```bash
supabase db execute --file supabase/migrations/001_create_users.sql
```

## 📚 Documentation to Read

1. **Next.js 14 App Router:** https://nextjs.org/docs/app
2. **Supabase Auth:** https://supabase.com/docs/guides/auth
3. **Supabase RLS:** https://supabase.com/docs/guides/auth/row-level-security
4. **TypeScript:** https://www.typescriptlang.org/docs/

## 🎨 Design Resources Needed

Before building UI, you'll need:
1. Logo and brand assets
2. Icon set (recommendation: Lucide React - already in dependency list)
3. Activity images (for activity library)
4. Onboarding illustrations (optional)

## 💡 Development Tips

1. **Start small:** Build one complete flow (auth → onboarding → check-in) before adding features
2. **Test with real users early:** Even paper prototypes help validate assumptions
3. **Mobile-first always:** Design and test on mobile viewport first
4. **Commit often:** Use git to track progress
5. **Document decisions:** Keep a decision log (why you chose X over Y)

## 🔄 Development Workflow

```bash
# Create a feature branch
git checkout -b feature/auth-pages

# Make changes, test locally
npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Commit
git add .
git commit -m "feat: add login and signup pages"

# Push and create PR (when ready)
git push origin feature/auth-pages
```

## 📞 When You're Ready to Continue

Ask me to help with:
1. **"Build the login page"** - I'll create the authentication UI
2. **"Setup Supabase Auth"** - I'll help configure authentication
3. **"Create onboarding flow"** - I'll build the onboarding screens
4. **"Build check-in form"** - I'll create the check-in UI

Or any specific component you want to start with!

---

**Current Status:** ✅ Foundation complete, ready for feature development
**Next Phase:** Phase 1 - Database & Auth
**Estimated Time:** 3-5 days for Phase 1
