# Test Signup Flow

## Issue: Email không đến inbox

### Possible Causes:

1. **Supabase still sending emails**
   - Supabase Auth vẫn gửi email confirmation
   - Resend cũng gửi → 2 emails hoặc conflict

2. **Domain restriction**
   - Resend free tier chỉ cho phép gửi từ `onboarding@resend.dev`
   - Không verify domain → có thể bị block với một số email providers

### Solutions:

#### Option 1: Disable Supabase Email (Recommended)
1. Go to Supabase Dashboard
2. Authentication → Providers → Email
3. **TURN OFF** "Enable email confirmations"
4. Save
5. Test signup again

#### Option 2: Check Resend Logs
1. Go to https://resend.com/emails
2. Check if email was sent
3. Check delivery status
4. Check bounce/spam reports

### Test with your real email:
1. Make sure Supabase email confirmation is OFF
2. Signup with your real email
3. Check inbox (and spam folder)
4. Check Resend dashboard for delivery status

