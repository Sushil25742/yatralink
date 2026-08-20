"use client"

import React from "react"
import { useApp } from "@/context/AppContext"
import { RefreshCcw } from "lucide-react"

export function ResetDemo() {
  const { resetDemo } = useApp()

  // Only render in development
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <button 
      onClick={resetDemo}
      className="fixed bottom-24 right-4 z-[9999] bg-gray-900 text-white p-3 rounded-full shadow-2xl hover:bg-gray-800 transition-colors flex items-center justify-center opacity-50 hover:opacity-100 group"
      title="Reset Demo State"
    >
      <RefreshCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
    </button>
  )
}
