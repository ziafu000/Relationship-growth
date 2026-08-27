'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ConfirmPage() {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          window.location.href = '/onboarding'
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Floating Decorations */}
      <div className="fixed top-20 right-10 text-6xl opacity-20 float-animation">🎉</div>
      <div className="fixed bottom-32 left-10 text-5xl opacity-20 float-animation" style={{animationDelay: '1s'}}>✨</div>
      <div className="fixed top-40 left-1/4 text-4xl opacity-20 float-animation" style={{animationDelay: '2s'}}>💖</div>
      <div className="fixed bottom-40 right-1/4 text-5xl opacity-20 float-animation" style={{animationDelay: '1.5s'}}>🌟</div>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bubble-card bg-gradient-to-br from-white to-green-50/30 text-center">
            {/* Success Icon with Animation */}
            <div className="relative mb-6">
              <div className="text-7xl emoji-bounce">✅</div>
              <div className="absolute -top-2 -right-2 text-4xl animate-spin-slow">✨</div>
            </div>

            <span className="badge-bubble badge-green mb-4">
              🎊 Xác nhận thành công
            </span>

            <h2 className="font-heading text-3xl font-bold text-gray-800 mt-4 mb-3">
              Chào mừng đến với <span className="text-primary">Relationship Growth</span>!
            </h2>

            <p className="text-gray-600 font-light mb-8 leading-relaxed">
              Email của bạn đã được xác nhận thành công.
              <br />Bây giờ hãy bắt đầu hành trình chăm sóc mối quan hệ! 💕
            </p>

            {/* Auto redirect notice */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-[20px] p-4 mb-6">
              <p className="text-sm text-blue-800 font-light">
                ⏱️ Tự động chuyển đến onboarding sau <span className="font-bold text-primary">{countdown}</span> giây...
              </p>
            </div>

            {/* Manual navigation */}
            <Link
              href="/onboarding"
              className="btn-bubble btn-primary w-full inline-block mb-3"
            >
              🚀 Bắt đầu ngay
            </Link>

            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-primary transition-colors font-light"
            >
              Hoặc đăng nhập tại đây
            </Link>
          </div>

          {/* Success Steps */}
          <div className="mt-6 space-y-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-[20px] p-4 border-2 border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold flex-shrink-0">
                  ✓
                </div>
                <p className="text-sm font-light text-gray-700">
                  Email đã được xác nhận
                </p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-[20px] p-4 border-2 border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                  2
                </div>
                <p className="text-sm font-light text-gray-700">
                  Tiếp theo: Thiết lập thông tin cơ bản
                </p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-[20px] p-4 border-2 border-purple-200 opacity-60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold flex-shrink-0">
                  3
                </div>
                <p className="text-sm font-light text-gray-700">
                  Bắt đầu check-in đầu tiên
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
