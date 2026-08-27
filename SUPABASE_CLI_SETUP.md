# Supabase CLI Setup Guide

## 📋 Prerequisite

Supabase CLI đã được cài đặt (version 2.116.0) ✅

## 🔑 Bước 1: Lấy Access Token

### Cách 1: Qua Supabase Dashboard (Khuyên dùng)
1. Vào https://supabase.com/dashboard
2. Click vào **Account Settings** (avatar góc trên bên phải)
3. Chọn **Access Tokens** tab
4. Click **Generate New Token**
5. Đặt tên: `local-cli`
6. Copy token (chỉ hiện 1 lần!)

### Cách 2: Login qua browser (nếu chạy local terminal)
```bash
supabase login
```
Browser sẽ mở để authenticate.

## 🔗 Bước 2: Link Project

### Option A: Dùng token trực tiếp (1 lần)
```bash
supabase link --project-ref aqrykpomzxumiwgorydn --token YOUR_ACCESS_TOKEN
```

### Option B: Set environment variable (persistent)
**Windows (PowerShell):**
```powershell
$env:SUPABASE_ACCESS_TOKEN="YOUR_ACCESS_TOKEN"
supabase link --project-ref aqrykpomzxumiwgorydn
```

**Windows (Command Prompt):**
```cmd
set SUPABASE_ACCESS_TOKEN=YOUR_ACCESS_TOKEN
supabase link --project-ref aqrykpomzxumiwgorydn
```

**Mac/Linux:**
```bash
export SUPABASE_ACCESS_TOKEN="YOUR_ACCESS_TOKEN"
supabase link --project-ref aqrykpomzxumiwgorydn
```

**Hoặc thêm vào `.env.local`:**
```env
SUPABASE_ACCESS_TOKEN=your_access_token_here
```

## 📤 Bước 3: Push Migrations lên Remote

Sau khi link thành công, push tất cả migrations:

```bash
# Di chuyển migrations về đúng folder
# (Supabase CLI expect migrations trong supabase/migrations/)

# Push migrations lên remote database
supabase db push
```

Hoặc push từng migration:
```bash
# Migration 009: Fix RLS Policy
supabase db push --include-all

# Hoặc dùng remote SQL trực tiếp
supabase db execute --file supabase/migrations/009_fix_recursive_policy.sql
supabase db execute --file supabase/migrations/010_auto_create_public_user.sql
```

## ✅ Bước 4: Verify

Kiểm tra xem migrations đã apply chưa:

```bash
# Check migration status
supabase db list

# Check specific table/policy
supabase db inspect table relationship_members
```

Hoặc query trực tiếp:
```bash
supabase db query "SELECT * FROM pg_policies WHERE tablename = 'relationship_members';"
supabase db query "SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';"
```

## 🎯 Project Info

- **Project Reference:** `aqrykpomzxumiwgorydn`
- **Project URL:** `https://aqrykpomzxumiwgorydn.supabase.co`
- **Migrations to push:**
  - `001_create_users.sql` ✅ (likely already applied)
  - `002_create_relationships.sql` ✅
  - `003_create_passports.sql` ✅
  - `004_create_activities.sql` ✅
  - `005_create_check_ins_goals.sql` ✅
  - `006_create_plans_executions.sql` ✅
  - `007_create_feedback_memory.sql` ✅
  - `008_create_invitations_analytics.sql` ✅
  - **`009_fix_recursive_policy.sql`** ⚠️ CRITICAL - Chưa apply
  - **`010_auto_create_public_user.sql`** ⚠️ CRITICAL - Chưa apply

## 🐛 Troubleshooting

### Issue: "Access token not provided"
**Solution:** Follow Bước 1 để lấy token

### Issue: "Project not found"
**Solution:** Verify project reference bằng cách check Supabase dashboard URL

### Issue: "Migration already applied"
**Solution:** Normal - skip và continue

### Issue: "Permission denied"
**Solution:** Ensure token có đủ quyền (admin/owner role)

## 📝 Alternative: Manual SQL Execution

Nếu CLI gặp vấn đề, có thể apply migrations thủ công:

1. Vào Supabase Dashboard → SQL Editor
2. Copy nội dung từ `supabase/migrations/009_fix_recursive_policy.sql`
3. Paste và Run
4. Repeat cho `010_auto_create_public_user.sql`

## 🎨 Update Site URL (Quan trọng cho email confirmation!)

Sau khi link project, update site URL:

```bash
# Get current production URL
# Ví dụ: https://relationship-growth-xxx.vercel.app

# Update via CLI (if supported)
supabase settings update --site-url https://your-production-url.vercel.app

# Or update manually:
# Dashboard → Settings → Authentication → Site URL
```

Add redirect URLs:
```
https://your-production-url.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

---

## 🚀 Quick Start (TL;DR)

```bash
# 1. Get token from https://supabase.com/dashboard (Account Settings → Access Tokens)

# 2. Set token
export SUPABASE_ACCESS_TOKEN="your_token_here"  # Mac/Linux
$env:SUPABASE_ACCESS_TOKEN="your_token_here"    # Windows PowerShell

# 3. Link project
supabase link --project-ref aqrykpomzxumiwgorydn

# 4. Push migrations
supabase db push

# 5. Verify
supabase db list

# Done! ✅
```

---

**Last updated:** 2026-08-27 23:45
**Supabase CLI Version:** 2.116.0
