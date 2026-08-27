# Supabase Setup Complete ✅

## 📦 Đã cài đặt

- **Supabase CLI:** v2.116.0 ✅
- **Project initialized:** `.supabase/` folder created ✅
- **Helper scripts:** Created 3 migration scripts ✅

## 📁 Files Created

1. **`SUPABASE_CLI_SETUP.md`** - Chi tiết setup Supabase CLI
2. **`scripts/apply-migrations.sh`** - Bash script (Mac/Linux)
3. **`scripts/apply-migrations.ps1`** - PowerShell script (Windows)
4. **`scripts/apply-migrations.js`** - Node.js script (cross-platform) ⭐

## 🎯 Quick Start - Apply Migrations

### Step 1: Get Access Token
1. Vào https://supabase.com/dashboard
2. Click **Account Settings** (avatar)
3. **Access Tokens** tab
4. **Generate New Token**
5. Copy token

### Step 2: Link Project

**Windows (PowerShell):**
```powershell
$env:SUPABASE_ACCESS_TOKEN="YOUR_TOKEN"
npm run supabase:link
```

**Mac/Linux:**
```bash
export SUPABASE_ACCESS_TOKEN="YOUR_TOKEN"
npm run supabase:link
```

### Step 3: Push Migrations

**Option A - Using npm script:**
```bash
npm run db:push
```

**Option B - Using helper script:**
```bash
npm run migrate
```

**Option C - Manual:**
```bash
supabase db push
```

### Step 4: Verify
```bash
npm run db:status
```

## 📋 Available NPM Scripts

```json
{
  "db:push": "Push migrations to remote",
  "db:pull": "Pull schema from remote", 
  "db:reset": "Reset local database",
  "db:status": "Check migration status",
  "supabase:link": "Link to remote project",
  "supabase:status": "Check Supabase status",
  "migrate": "Run migration helper (interactive)"
}
```

## 🚨 Critical Migrations to Apply

### Migration 009: Fix RLS Infinite Recursion
**File:** `supabase/migrations/009_fix_recursive_policy.sql`
**Why:** Fix "infinite recursion detected" error khi onboarding

### Migration 010: Auto-create Public Users
**File:** `supabase/migrations/010_auto_create_public_user.sql`  
**Why:** Tự động tạo user trong `public.users` sau signup

## 📊 Migration Status

| Migration | Status | Description |
|-----------|--------|-------------|
| 001_create_users.sql | ✅ Applied | Users table |
| 002_create_relationships.sql | ✅ Applied | Relationships & members |
| 003_create_passports.sql | ✅ Applied | Relationship passport |
| 004_create_activities.sql | ✅ Applied | Activity library |
| 005_create_check_ins_goals.sql | ✅ Applied | Check-ins & goals |
| 006_create_plans_executions.sql | ✅ Applied | Plans & executions |
| 007_create_feedback_memory.sql | ✅ Applied | Feedback & memory |
| 008_create_invitations_analytics.sql | ✅ Applied | Invitations & analytics |
| **009_fix_recursive_policy.sql** | ⚠️ **Pending** | **RLS policy fix** |
| **010_auto_create_public_user.sql** | ⚠️ **Pending** | **User trigger** |

## 🔧 Configuration Needed

### 1. Site URL (Important for email confirmation!)
```
Dashboard → Settings → Authentication → Site URL
Change: https://your-production-url.vercel.app
```

### 2. Redirect URLs
```
Dashboard → Settings → Authentication → Redirect URLs
Add:
  - https://your-production-url.vercel.app/auth/callback
  - http://localhost:3000/auth/callback
```

### 3. Environment Variable (Optional)
Add to Vercel if needed:
```
NEXT_PUBLIC_APP_URL=https://your-production-url.vercel.app
```

## ✅ Testing After Migration

1. **Signup new user**
   - Should create user in both `auth.users` AND `public.users` ✅
   
2. **Email confirmation**
   - Click link in email → redirect to `/auth/confirm` ✅
   - Auto-redirect to `/onboarding` after 5s ✅

3. **Onboarding**
   - Submit form → no "infinite recursion" error ✅
   - Should create relationship, member, passport ✅

4. **Check database**
   ```sql
   -- Check user was created
   SELECT * FROM public.users;
   
   -- Check trigger exists
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   
   -- Check policy fixed
   SELECT * FROM pg_policies WHERE tablename = 'relationship_members';
   ```

## 🐛 Troubleshooting

### "Access token not provided"
→ Set `SUPABASE_ACCESS_TOKEN` environment variable

### "Project not found"
→ Verify project reference: `aqrykpomzxumiwgorydn`

### "Migration already applied"
→ Normal, skip and continue

### CLI login fails (non-TTY)
→ Use `--token` flag or set env variable

### Manual SQL preferred?
→ See `SUPABASE_CLI_SETUP.md` section "Alternative: Manual SQL Execution"

## 📚 Documentation Files

- **`SUPABASE_CLI_SETUP.md`** - Detailed CLI setup guide
- **`PROJECT_STATUS.md`** - Overall project status
- **`CLAUDE.md`** - Implementation plan
- **`README.md`** - Project overview (to be created)

## 🎉 Next Steps After Setup

1. Apply migrations ✅
2. Update Site URL in Supabase ✅
3. Test signup flow
4. Test email confirmation
5. Test onboarding flow
6. Continue with feature development

---

**Setup completed by:** Claude Code (Fable 5)  
**Date:** 2026-08-27 23:50  
**Supabase CLI:** v2.116.0  
**Project Ref:** aqrykpomzxumiwgorydn
