// Test sending email to real address
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

if (!process.env.RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY not found');
  process.exit(1);
}

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// CHANGE THIS TO YOUR EMAIL
const YOUR_EMAIL = 'your-email@example.com';

async function testRealEmail() {
  console.log('🧪 Testing email delivery to:', YOUR_EMAIL);
  console.log('');

  try {
    const { data, error } = await resend.emails.send({
      from: 'Relationship Growth OS <onboarding@resend.dev>',
      to: [YOUR_EMAIL],
      subject: '🧪 TEST - Xác nhận email của bạn ✨',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; background: #F7F4EF; margin: 0; padding: 40px 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 32px; }
            .emoji { font-size: 48px; margin-bottom: 16px; }
            h1 { color: #1F2421; font-size: 24px; margin: 16px 0; }
            p { color: #5C635D; line-height: 1.6; margin: 16px 0; font-size: 16px; }
            .button { display: inline-block; background: #C4612F; color: white !important; padding: 16px 32px; border-radius: 999px; text-decoration: none; font-weight: 500; margin: 24px 0; }
            .footer { text-align: center; color: #5C635D; font-size: 14px; margin-top: 32px; padding-top: 32px; border-top: 1px solid #E7E1D7; }
            code { background: #F7F4EF; padding: 8px 12px; border-radius: 4px; display: inline-block; margin-top: 8px; word-break: break-all; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="emoji">💌</div>
              <h1>Chào bạn!</h1>
              <p><strong>🧪 ĐÂY LÀ TEST EMAIL</strong></p>
            </div>

            <p>Nếu bạn nhận được email này, Resend integration đang hoạt động hoàn hảo! ✅</p>

            <p>Email này được gửi từ:</p>
            <ul style="color: #5C635D; line-height: 1.8;">
              <li><strong>Service:</strong> Resend.com</li>
              <li><strong>Sender:</strong> onboarding@resend.dev</li>
              <li><strong>App:</strong> Relationship Growth OS</li>
            </ul>

            <div style="text-align: center; margin: 32px 0;">
              <a href="http://localhost:3000" class="button">
                Mở App ✓
              </a>
            </div>

            <p style="background: #F7F4EF; padding: 16px; border-radius: 12px; font-size: 14px;">
              💡 <strong>Next step:</strong> Thử signup với email thật trên http://localhost:3000/signup
            </p>

            <div class="footer">
              <p>Đây là test email từ development environment</p>
              <p style="color: #999; font-size: 12px; margin-top: 8px;">
                Nếu bạn không expect email này, có thể bỏ qua
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.log('❌ Failed to send email');
      console.error('Error:', error);
      console.log('');

      if (error.message && error.message.includes('Invalid `to` field')) {
        console.log('💡 Tip: Make sure to use a real email address');
        console.log('   Edit this file and change YOUR_EMAIL to your real email');
      }
    } else {
      console.log('✅ Email sent successfully!');
      console.log('');
      console.log('📧 Email ID:', data?.id);
      console.log('📬 Sent to:', YOUR_EMAIL);
      console.log('');
      console.log('🔍 Check:');
      console.log('   1. Your inbox:', YOUR_EMAIL);
      console.log('   2. Spam/Junk folder');
      console.log('   3. Resend Dashboard: https://resend.com/emails');
      console.log('');
      console.log('⏱️  Email usually arrives within 1-2 seconds');
    }
  } catch (error) {
    console.error('❌ Exception:', error);
  }
}

testRealEmail();
