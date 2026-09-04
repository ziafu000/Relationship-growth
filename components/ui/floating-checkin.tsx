"use client";

import React from "react";
import Link from "next/link";

export function FloatingCheckIn() {
  return (
    <Link 
      href="/check-in"
      className="fixed bottom-6 right-6 bg-orange-700 hover:bg-orange-800 text-white p-4 rounded-full shadow-lg shadow-orange-700/30 transition-transform hover:scale-110 z-50 flex items-center justify-center"
      aria-label="Tạo check-in mới"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </Link>
  );
}
