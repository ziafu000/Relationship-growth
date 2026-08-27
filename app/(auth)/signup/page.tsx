'use client'

import { useState } from 'react'
import { signup } from '@/app/actions/auth'
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
      // Signup successful - show check email message
      setEmailSent(true)
      setLoading(false)
    }
  }

  // Show "Check your email" screen after successful signup
  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        {/* Floating Decorations */}
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

  return (
    <div className="min-h-screen bg-[#F7F4EF] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl tracking-tight text-[#1F2421] mb-2">
            Relationship <span className="italic text-[#C4612F]">Growth</span> OS
          </h1>
          <p className="text-[#5C635D] font-light">Bắt đầu hành trình chăm sóc mối quan hệ</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E7E1D7] p-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-[#F2E3D6] text-[#C4612F] text-xs font-medium mb-3">
              Tạo tài khoản mới
            </span>
            <h2 className="font-serif text-2xl text-[#1F2421] tracking-tight">
              Chào bạn, hãy bắt đầu nào
            </h2>
          </div>

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-light text-[#5C635D] mb-1.5">
                Tên của bạn
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-2.5 rounded-full border border-[#E7E1D7] bg-[#FBF9F5]
                         text-[#1F2421] font-light
                         focus:outline-none focus:ring-2 focus:ring-[#C4612F] focus:border-transparent
                         transition-all"
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-light text-[#5C635D] mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2.5 rounded-full border border-[#E7E1D7] bg-[#FBF9F5]
                         text-[#1F2421] font-light
                         focus:outline-none focus:ring-2 focus:ring-[#C4612F] focus:border-transparent
                         transition-all"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-light text-[#5C635D] mb-1.5">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-2.5 rounded-full border border-[#E7E1D7] bg-[#FBF9F5]
                         text-[#1F2421] font-light
                         focus:outline-none focus:ring-2 focus:ring-[#C4612F] focus:border-transparent
                         transition-all"
                placeholder="••••••••"
              />
              <p className="text-xs font-light text-[#5C635D] mt-1.5">Tối thiểu 6 ký tự</p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-light">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C4612F] hover:bg-[#A94E22] text-white font-normal py-3 rounded-full
                       transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm font-light text-[#5C635D]">
              Đã có tài khoản?{' '}
              <Link
                href="/login"
                className="text-[#C4612F] hover:text-[#A94E22] font-normal transition-colors"
              >
                Đăng nhập
              </Link>
            </p>
          </div>

          {/* Privacy note */}
          <div className="mt-6 p-3 rounded-xl bg-[#FBF9F5] border border-[#E7E1D7]">
            <p className="text-xs font-light text-[#5C635D] leading-relaxed">
              🔒 Dữ liệu của bạn được bảo vệ và chỉ bạn mới có thể truy cập.
              Chế độ Solo mặc định - không chia sẻ với ai khác.
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs font-light text-[#5C635D] mt-6">
          Bằng việc đăng ký, bạn đồng ý với điều khoản sử dụng và chính sách bảo mật
        </p>
      </div>
    </div>
  )
}
