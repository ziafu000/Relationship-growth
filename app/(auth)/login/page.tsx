'use client'

import { useState } from 'react'
import { login } from '@/app/actions/auth'
import Link from 'next/link'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const result = await login(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F4EF] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl tracking-tight text-[#1F2421] mb-2">
            Relationship <span className="italic text-[#C4612F]">Growth</span> OS
          </h1>
          <p className="text-[#5C635D] font-light">Nuôi dưỡng mối quan hệ từng ngày</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E7E1D7] p-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-[#F2E3D6] text-[#C4612F] text-xs font-medium mb-3">
              Đăng nhập
            </span>
            <h2 className="font-serif text-2xl text-[#1F2421] tracking-tight">
              Chào mừng trở lại
            </h2>
          </div>

          <form action={handleSubmit} className="space-y-4">
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
                className="w-full px-4 py-2.5 rounded-full border border-[#E7E1D7] bg-[#FBF9F5]
                         text-[#1F2421] font-light
                         focus:outline-none focus:ring-2 focus:ring-[#C4612F] focus:border-transparent
                         transition-all"
                placeholder="••••••••"
              />
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
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm font-light text-[#5C635D]">
              Chưa có tài khoản?{' '}
              <Link
                href="/signup"
                className="text-[#C4612F] hover:text-[#A94E22] font-normal transition-colors"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs font-light text-[#5C635D] mt-6">
          Dành cho các cặp đôi tại Hà Nội & TP. Hồ Chí Minh
        </p>
      </div>
    </div>
  )
}
