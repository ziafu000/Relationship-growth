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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      {/* Floating Decorations */}
      <div className="fixed top-20 right-10 text-6xl opacity-20 float-animation">💖</div>
      <div className="fixed bottom-32 left-10 text-5xl opacity-20 float-animation" style={{animationDelay: '1s'}}>✨</div>
      <div className="fixed top-40 left-1/4 text-4xl opacity-20 float-animation" style={{animationDelay: '2s'}}>🔐</div>

      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl font-bold text-gray-800 mb-2">
            Relationship <span className="text-primary italic">Growth</span> OS
          </h1>
          <p className="text-gray-600 font-light">Nuôi dưỡng mối quan hệ từng ngày 💕</p>
        </div>

        {/* Login Form */}
        <div className="bubble-card bg-gradient-to-br from-white to-blue-50/30">
          <div className="mb-6">
            <span className="badge-bubble badge-blue mb-3">
              🔐 Đăng nhập
            </span>
            <h2 className="font-heading text-3xl font-bold text-gray-800 mt-4 mb-3">
              Chào mừng <span className="text-primary">trở lại</span>!
            </h2>
          </div>

          <form action={handleSubmit} className="space-y-4">
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
                className="input-bubble"
                placeholder="••••••••"
              />
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
              {loading ? 'Đang đăng nhập...' : '✨ Đăng nhập'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm font-light text-gray-600">
              Chưa có tài khoản?{' '}
              <Link
                href="/signup"
                className="text-primary hover:text-primary-dark font-normal transition-colors"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs font-light text-gray-600 mt-6">
          Dành cho các cặp đôi tại Hà Nội & TP. Hồ Chí Minh 🌆
        </p>
      </div>
    </div>
  )
}
