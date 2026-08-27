# Resend Setup Guide

## ✅ Installation Complete

Resend package đã được cài đặt và code đã được enable.

---

## 🚀 Quick Setup (5 phút)

### 1. Tạo Resend Account

1. Đi tới [resend.com](https://resend.com)
2. Sign up (free)
3. Verify email của bạn

### 2. Get API Key

1. Vào Resend Dashboard
2. Chọn **API Keys** từ sidebar
3. Click **Create API Key**
4. Name: "Relationship Growth OS"
5. Copy API key (bắt đầu với `re_...`)

### 3. Add vào Environment Variables

Tạo hoặc edit file `.env.local`:

```bash
# Email Service (Resend)
RESEND_API_KEY=re_your_actual_api_key_here
```

⚠️ **Quan trọng:** Thay `re_your_actual_api_key_here` bằng API key thật từ Resend Dashboard

### 4. Restart Dev Server

```bash
npm run dev
```

### 5. Test Signup

1. Mở `http://localhost:3000/signup`
2. Tạo account mới
3. Check email → bạn sẽ nhận được email confirmation đẹp với warm design

---

## 📧 Email Templates

Đã có 2 email templates:

### Signup Confirmation Email
- Subject: "Xác nhận email của bạn ✨"
- Design: Warm cream background, terracotta accent
- Mobile responsive
- Includes confirmation button và fallback link

### Password Reset Email
- Subject: "Đặt lại mật khẩu 🔐"
- Matching design
- 1 hour expiration notice
- Reset button

---

## 🎨 Email Design Features

- ✅ Warm cream background (`#F7F4EF`) matching app
- ✅ Terracotta accent button (`#C4612F`)
- ✅ Serif headings với emoji
- ✅ Mobile-responsive layout
- ✅ Vietnamese language
- ✅ Inline CSS (works in all email clients)

---

## 🆓 Free Tier Limits

- **3,000 emails/month**
- **100 emails/day**
- Perfect cho testing và early users

**Chi phí cho 100 users:**
- Signup confirmations: 100 emails
- Password resets: ~10 emails
- **Total: ~110 emails/month**
- **Cost: $0** (within free tier)

---

## 🔧 Configuration

### Current Setup

**Sender Email:** `onboarding@resend.dev`
- Default test email từ Resend
- Works immediately, no domain verification needed
- Good cho development/testing

**Redirect URL:** `${NEXT_PUBLIC_APP_URL}/auth/confirm`
- Uses environment variable
- Works với localhost và production

---

## 🚀 Production Deployment

### Before Launch

1. **Verify Domain trong Resend** (optional nhưng recommended)
   - Add your domain (e.g., `relationshipgrowth.com`)
   - Add DNS records (SPF, DKIM)
   - Change sender từ `onboarding@resend.dev` → `onboarding@yourdomain.com`
   - Better deliverability, professional look

2. **Update NEXT_PUBLIC_APP_URL**
   ```bash
   NEXT_PUBLIC_APP_URL=https://your-production-domain.com
   ```

3. **Add RESEND_API_KEY to Production** (Vercel)
   - Vercel Dashboard → Project Settings → Environment Variables
   - Add `RESEND_API_KEY` với production API key
   - Redeploy

---

## 🐛 Troubleshooting

### Email không nhận được

**Check:**
1. API key đúng trong `.env.local`
2. Dev server đã restart sau khi add API key
3. Check spam folder
4. Check Resend Dashboard → Logs để xem email đã send chưa

### "Missing API Key" error

**Fix:**
1. Đảm bảo `.env.local` có `RESEND_API_KEY`
2. Restart dev server: `npm run dev`
3. API key phải bắt đầu với `re_`

### Email marked as spam

**Fix:**
- Free tier emails có thể bị spam filter
- Solution: Verify domain trong Resend (adds SPF/DKIM)
- Use professional sender email

### Rate limit exceeded (100 emails/day)

**Fix:**
- Spread testing qua nhiều ngày
- Hoặc upgrade Resend plan nếu cần testing intensive
- Production: 3,000/month enough cho 100 users

---

## 📊 Monitoring

### Resend Dashboard

1. **Logs:** Xem tất cả emails sent
2. **Analytics:** Delivery rate, open rate
3. **API Keys:** Manage keys

### Check Email Status

```typescript
// Example: Get email status
const { data, error } = await resend.emails.get('email_id');
```

---

## 🔐 Security Notes

- ✅ API key stored trong `.env.local` (không commit vào Git)
- ✅ `.env.local` đã có trong `.gitignore`
- ✅ Confirmation URLs use secure tokens từ Supabase
- ✅ Email templates không expose sensitive data

---

## 📝 Current Implementation Status

✅ **Completed:**
- Resend package installed
- Email service code (`lib/email/resend.ts`)
- Auth action enabled (`app/actions/auth.ts`)
- Environment variable template (`.env.local.example`)
- Beautiful email templates

⏸️ **Needs Configuration:**
- Add `RESEND_API_KEY` to `.env.local`
- Test signup flow

---

## 🎯 Next Steps

1. **Now:** Add `RESEND_API_KEY` to `.env.local`
2. **Test:** Signup với real email, check inbox
3. **Before Launch:** Verify domain trong Resend (optional)
4. **Deploy:** Add API key to Vercel environment variables

---

**Ready to go! 🚀**

Chỉ cần add API key là emails sẽ work ngay.
