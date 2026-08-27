// lib/email/resend.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(
  email: string,
  confirmationUrl: string,
  name?: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Relationship Growth OS <onboarding@resend.dev>',
      to: [email],
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
            .button:hover { background: #A94E22; }
            .footer { text-align: center; color: #5C635D; font-size: 14px; margin-top: 32px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="emoji">💌</div>
              <h1>Chào ${name || 'bạn'}!</h1>
              <p>Cảm ơn bạn đã đăng ký Relationship Growth OS</p>
            </div>

            <p>Vui lòng xác nhận địa chỉ email của bạn bằng cách nhấn vào nút bên dưới:</p>

            <div style="text-align: center;">
              <a href="${confirmationUrl}" class="button">
                Xác nhận email ✓
              </a>
            </div>

            <p style="font-size: 14px; color: #5C635D;">
              Hoặc copy link này vào trình duyệt:<br>
              <code style="background: #F7F4EF; padding: 8px; border-radius: 4px; display: inline-block; margin-top: 8px; word-break: break-all;">
                ${confirmationUrl}
              </code>
            </p>

            <div class="footer">
              <p>Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email này.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
  name?: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Relationship Growth OS <onboarding@resend.dev>',
      to: [email],
      subject: 'Đặt lại mật khẩu 🔐',
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
            .button:hover { background: #A94E22; }
            .footer { text-align: center; color: #5C635D; font-size: 14px; margin-top: 32px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="emoji">🔐</div>
              <h1>Đặt lại mật khẩu</h1>
            </div>

            <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>

            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">
                Đặt lại mật khẩu
              </a>
            </div>

            <p style="font-size: 14px; color: #5C635D;">
              Link này sẽ hết hạn sau 1 giờ.
            </p>

            <div class="footer">
              <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}
