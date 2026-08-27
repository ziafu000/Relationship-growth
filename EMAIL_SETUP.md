# Email Configuration Guide

**Issue:** Supabase built-in email service has rate limits that can block testing and early users.

**Status:** Multiple solutions available based on your needs.

---

## 🎯 Solutions Overview

| Solution | Best For | Setup Time | Free Tier | Pros | Cons |
|----------|----------|------------|-----------|------|------|
| **Disable Confirmation** | Development/Testing | 1 min | N/A | Instant signup | No email verification |
| **Resend.com** | Production (Recommended) | 15 min | 3,000/month | Simple, generous, beautiful emails | Requires domain |
| **SendGrid** | Higher volume | 20 min | 100/day | Reliable, scalable | More complex setup |
| **Supabase SMTP Custom** | Custom provider | 30 min | Varies | Flexible | Configuration heavy |

---

## 🚀 Option 1: Disable Email Confirmation (Fastest)

**For:** Development, testing with small team

### Setup (1 minute)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to: **Authentication → Providers → Email**
3. **Disable:** "Enable email confirmations"
4. Save

### Result
- ✅ Users can signup and login immediately
- ✅ No email rate limits
- ✅ Faster testing workflow
- ⚠️ No email verification (any email works, even fake)

### When to Use
- Development environment
- Internal testing with trusted users
- MVP validation with <20 users

### Security Note
Re-enable email confirmation before public launch!

---

## ⭐ Option 2: Resend.com (Recommended for Production)

**For:** Production with 100-3000 users/month

### Why Resend?
- **Free tier:** 3,000 emails/month, 100 emails/day
- **Simple API:** Clean, modern, TypeScript-first
- **Beautiful emails:** React Email templates
- **Fast setup:** 15 minutes
- **Reliable:** Built by former Vercel engineers

### Setup Steps

#### 1. Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up (free)
3. Verify your domain OR use `onboarding@resend.dev` for testing

#### 2. Get API Key
1. Go to **API Keys** in Resend Dashboard
2. Click **Create API Key**
3. Name it: "Relationship Growth OS"
4. Copy the key (starts with `re_...`)

#### 3. Add to Environment Variables

```env
# .env.local
RESEND_API_KEY=re_your_api_key_here
```

#### 4. Install Resend Package

```bash
npm install resend
```

#### 5. Configure Supabase

**Dashboard → Authentication → Email Templates**

Add custom HTML or use the Resend service directly:

**Option A:** Disable Supabase emails, use Resend completely
- Turn off "Enable email confirmations" in Supabase
- Handle confirmation in your code (see implementation below)

**Option B:** Keep Supabase for auth, Resend for emails
- Configure Supabase to use custom SMTP (Resend SMTP coming soon)

#### 6. Implementation

Code already created in `lib/email/resend.ts`

**To enable:** Edit `app/actions/auth.ts` and uncomment the Resend block:

```typescript
// Uncomment these lines in app/actions/auth.ts:
if (process.env.RESEND_API_KEY && authData.user) {
  const { sendConfirmationEmail } = await import('@/lib/email/resend')
  const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm?token=${authData.user.id}`
  await sendConfirmationEmail(email, confirmUrl, name)
}
```

#### 7. Test

```bash
npm run dev
```

Try signup - you should receive a beautifully designed email with warm design matching your app.

### Cost Projection (100 users)

**Scenario:** 100 new users/month
- Signup confirmations: 100 emails
- Password resets: ~10 emails
- **Total:** ~110 emails/month

**Cost:** $0 (well within 3,000/month free tier)

### Email Templates Included

✅ Signup confirmation email (warm design, matches app aesthetic)  
✅ Password reset email  
✅ Mobile-responsive  
✅ Inline CSS (works in all email clients)

---

## 💪 Option 3: SendGrid (Higher Volume)

**For:** 100+ emails/day or need more features

### Free Tier
- 100 emails/day (3,000/month)
- Email validation
- Analytics

### Setup

```bash
npm install @sendgrid/mail
```

```typescript
// lib/email/sendgrid.ts
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function sendConfirmationEmail(
  email: string,
  confirmationUrl: string,
  name?: string
) {
  const msg = {
    to: email,
    from: 'onboarding@yourdomain.com',
    subject: 'Xác nhận email của bạn ✨',
    html: `<!-- Same HTML template as Resend -->`,
  }

  try {
    await sgMail.send(msg)
    return { success: true }
  } catch (error) {
    console.error('SendGrid error:', error)
    return { success: false, error }
  }
}
```

### Pros
- Robust analytics
- Email validation API
- Higher volume tier available

### Cons
- More complex dashboard
- Requires more configuration
- Strict sending policies

---

## 🔧 Option 4: Custom SMTP (Advanced)

**For:** Use existing email service (Gmail, Outlook, Mailgun, etc.)

### Supabase SMTP Configuration

**Dashboard → Project Settings → Auth → SMTP Settings**

```
SMTP Host: smtp.gmail.com (or your provider)
SMTP Port: 587
SMTP User: your-email@gmail.com
SMTP Pass: your-app-password
Sender Email: noreply@yourdomain.com
Sender Name: Relationship Growth OS
```

### Gmail App Password Setup
1. Enable 2FA on Gmail
2. Go to Security → App Passwords
3. Generate password for "Mail"
4. Use that password in SMTP settings

### Pros
- Use existing email service
- No new accounts needed

### Cons
- Gmail has 500 emails/day limit
- Complex setup
- May get marked as spam

---

## 📊 Recommendation for 100 Users

### Development Phase (Now)
**Use:** Option 1 (Disable confirmation)
- Instant setup
- Fast testing
- No configuration needed

### Soft Launch (First 100 users)
**Use:** Option 2 (Resend.com)
- Professional emails
- Free tier enough
- Easy setup
- Better user experience

### Growth Phase (100+ users/day)
**Upgrade to:** SendGrid paid tier or Resend paid tier
- Resend: $20/month for 50,000 emails
- SendGrid: $15/month for 40,000 emails

---

## ⚡ Quick Setup (5 minutes)

**Right now for testing:**

```bash
# 1. Disable email confirmation in Supabase Dashboard
# Authentication → Providers → Email → Turn OFF "Enable email confirmations"

# 2. Test signup
npm run dev
# Visit localhost:3000/signup
# Create account - should work instantly
```

**Before launch (15 minutes):**

```bash
# 1. Sign up at resend.com
# 2. Get API key
# 3. Add to .env.local
echo "RESEND_API_KEY=re_your_key" >> .env.local

# 4. Install package
npm install resend

# 5. Uncomment Resend code in app/actions/auth.ts
# 6. Re-enable email confirmation in Supabase
# 7. Test signup - check email
```

---

## 🐛 Troubleshooting

### "Rate limit exceeded"
**Solution:** Switch to Resend or disable confirmation temporarily

### "Email not received" (Resend)
**Check:**
1. API key correct in `.env.local`
2. Sender email verified in Resend dashboard
3. Check spam folder
4. Check Resend logs for delivery status

### "SMTP connection failed"
**Solution:** 
- Verify SMTP credentials
- Check firewall/port 587 open
- Use Resend instead (simpler)

### "Email marked as spam"
**Solution:**
- Verify domain in Resend (adds SPF/DKIM)
- Don't use free email domains as sender
- Use professional copy in emails

---

## 📝 Current Implementation Status

✅ Resend email service code created (`lib/email/resend.ts`)  
✅ Beautiful HTML templates with warm design  
✅ Auth action prepared with Resend integration  
⏸️ Currently disabled (commented out)  
⏸️ Environment variable needed: `RESEND_API_KEY`

**To activate:**
1. Get Resend API key
2. Add to `.env.local`
3. Uncomment Resend block in `app/actions/auth.ts`
4. Restart dev server

---

## 💰 Cost Estimate (100 users)

| Service | Monthly Emails | Free Tier | Cost | Recommendation |
|---------|---------------|-----------|------|----------------|
| **Resend** | ~120 | 3,000 | $0 | ⭐ Best choice |
| **SendGrid** | ~120 | 3,000 | $0 | Good backup |
| **Gmail SMTP** | ~120 | 500/day | $0 | Not recommended |
| **Supabase** | ~120 | Limited | $0 | Rate limited ❌ |

**Winner:** Resend.com
- Most generous free tier
- Simplest setup
- Best developer experience
- Beautiful emails out of the box

---

**Next Steps:**
1. ✅ For testing now: Disable email confirmation in Supabase
2. ✅ Before launch: Set up Resend.com (15 min)
3. ✅ Scale later: Upgrade if >3,000 emails/month
