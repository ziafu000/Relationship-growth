'use client'

import { useState, useEffect } from 'react'
import { signup } from '@/app/actions/auth'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const email = formData.get('email') as string
    setUserEmail(email)

    const result = await signup(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setEmailSent(true)
      setLoading(false)
    }
  }

  if (emailSent) {
    return <EmailSentScreen userEmail={userEmail} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      {/* Floating Decorations */}
      <div className="fixed top-20 right-10 text-6xl opacity-20 float-animation">💌</div>
      <div className="fixed bottom-32 left-10 text-5xl opacity-20 float-animation" style={{animationDelay: '1s'}}>✨</div>
      <div className="fixed top-40 left-1/4 text-4xl opacity-20 float-animation" style={{animationDelay: '2s'}}>💖</div>

      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl font-bold text-gray-800 mb-2">
            Relationship <span className="text-primary italic">Growth</span> OS
          </h1>
          <p className="text-gray-600 font-light">Bắt đầu hành trình chăm sóc mối quan hệ 💕</p>
        </div>

        {/* Signup Form */}
        <div className="bubble-card bg-gradient-to-br from-white to-pink-50/30">
          <div className="mb-6">
            <span className="badge-bubble badge-purple mb-3">
              ✨ Tạo tài khoản mới
            </span>
            <h2 className="font-heading text-3xl font-bold text-gray-800 mt-4 mb-3">
              Chào bạn, hãy <span className="text-primary">bắt đầu</span> nào
            </h2>
          </div>

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-light text-gray-600 mb-1.5">
                Tên của bạn
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input-bubble"
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-light text-gray-600 mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-bubble"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-light text-gray-600 mb-1.5">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="input-bubble"
                placeholder="••••••••"
              />
              <p className="text-xs font-light text-gray-500 mt-1.5">Tối thiểu 6 ký tự</p>
            </div>

            {error && (
              <div className="p-3 rounded-[20px] bg-red-50 border-2 border-red-200 text-red-700 text-sm font-light">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-bubble btn-primary w-full"
            >
              {loading ? 'Đang tạo tài khoản...' : '🚀 Tạo tài khoản'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm font-light text-gray-600">
              Đã có tài khoản?{' '}
              <Link
                href="/login"
                className="text-primary hover:text-primary-dark font-normal transition-colors"
              >
                Đăng nhập
              </Link>
            </p>
          </div>

          <div className="mt-6 p-4 rounded-[20px] bg-blue-50 border-2 border-blue-200">
            <p className="text-xs font-light text-blue-800 leading-relaxed">
              🔒 Dữ liệu của bạn được bảo vệ và chỉ bạn mới có thể truy cập.
              Chế độ Solo mặc định - không chia sẻ với ai khác.
            </p>
          </div>
        </div>

        <p className="text-center text-xs font-light text-gray-600 mt-6">
          Bằng việc đăng ký, bạn đồng ý với điều khoản sử dụng và chính sách bảo mật
        </p>
      </div>
    </div>
  )
}

// Email sent screen with real-time polling for cross-device sync
function EmailSentScreen({ userEmail }: { userEmail: string }) {
  useEffect(() => {
    const supabase = createClient()

    const pollInterval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user?.email_confirmed_at) {
        clearInterval(pollInterval)
        window.location.href = '/onboarding'
      }
    }, 2000)

    const timeout = setTimeout(() => {
      clearInterval(pollInterval)
    }, 600000)

    return () => {
      clearInterval(pollInterval)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="fixed top-20 right-10 text-6xl opacity-20 float-animation">💌</div>
      <div className="fixed bottom-32 left-10 text-5xl opacity-20 float-animation" style={{animationDelay: '1s'}}>✨</div>
      <div className="fixed top-40 left-1/4 text-4xl opacity-20 float-animation" style={{animationDelay: '2s'}}>💖</div>

      <div className="w-full max-w-md">
        <div className="bubble-card bg-gradient-to-br from-white to-pink-50/30 text-center">
          <div className="text-6xl mb-4 emoji-bounce">📧</div>

          <span className="badge-bubble badge-purple mb-4">
            ✨ Xác nhận email
          </span>

          <h2 className="font-heading text-3xl font-bold text-gray-800 mt-4 mb-3">
            Kiểm tra <span className="text-primary">email</span> của bạn!
          </h2>

          <p className="text-gray-600 font-light mb-2">
            Chúng tôi đã gửi link xác nhận đến:
          </p>
          <p className="text-primary font-semibold mb-6">
            {userEmail}
          </p>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-[20px] p-4 mb-6">
            <p className="text-sm text-blue-800 font-light leading-relaxed">
              📬 Click vào link trong email để kích hoạt tài khoản.
              <br />Nếu không thấy email, hãy kiểm tra thư mục spam nhé!
              <br /><br />
              ✨ <strong>Tự động chuyển trang</strong> khi bạn xác nhận email (không cần refresh)
            </p>
          </div>

          <Link
            href="/login"
            className="btn-bubble btn-primary w-full inline-block"
          >
            🔐 Đi đến trang đăng nhập
          </Link>
        </div>
      </div>
    </div>
  )
}
