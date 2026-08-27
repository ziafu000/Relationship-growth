// Load environment variables first
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

// Verify API key
if (!process.env.RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY not found in .env.local');
  console.error('   Please add your API key to .env.local:');
  console.error('   RESEND_API_KEY=re_your_api_key_here\n');
  process.exit(1);
}

console.log('✅ API key loaded:', process.env.RESEND_API_KEY.substring(0, 10) + '...\n');

// Now import Resend after env is loaded
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmails() {
  console.log('🧪 Testing Resend Email Integration...\n');

  // Test 1: Confirmation Email
  console.log('📧 Test 1: Sending confirmation email...');
  try {
    const { data, error } = await resend.emails.send({
      from: 'Relationship Growth OS <onboarding@resend.dev>',
      to: ['delivered@resend.dev'], // Resend's test email address
      subject: 'Xác nhận email của bạn ✨',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; background: #F7F4EF; margin: 0; padding: 40px 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px; }
            .header { text-align: center; margin-bottom: 32px; }
            .emoji { font-size: 48px; }
            h1 { color: #1F2421; font-size: 24px; margin: 16px 0; }
            p { color: #5C635D; line-height: 1.6; margin: 16px 0; }
            .button { display: inline-block; background: #C4612F; color: white; padding: 16px 32px; border-radius: 999px; text-decoration: none; font-weight: 500; margin: 24px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="emoji">💌</div>
              <h1>TEST EMAIL - Chào Test User!</h1>
              <p>Đây là test email từ Resend integration</p>
            </div>
            <p>Nếu bạn nhận được email này, Resend đang hoạt động tốt! ✅</p>
            <div style="text-align: center;">
              <a href="http://localhost:3000/auth/confirm?token=test-123" class="button">
                Xác nhận email ✓
              </a>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.log('❌ Failed to send confirmation email');
      console.error('   Error:', error);
    } else {
      console.log('✅ Confirmation email sent successfully!');
      console.log('   Email ID:', data?.id);
      console.log('   To: delivered@resend.dev');
    }
  } catch (error) {
    console.error('❌ Exception:', error);
  }

  console.log('\n✨ Test complete!');
  console.log('🌐 Check Resend Dashboard: https://resend.com/emails');
  console.log('📧 Test email sent to: delivered@resend.dev\n');
}

testEmails().catch(console.error);
