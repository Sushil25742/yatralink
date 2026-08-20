"use client"

import * as React from "react"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"

export type ToastType = "success" | "error" | "info"

interface ToastProps {
  title: string
  description?: string
  type?: ToastType
  isVisible: boolean
  onClose: () => void
}

export function Toast({ title, description, type = "info", isVisible, onClose }: ToastProps) {
  if (!isVisible) return null

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-[var(--color-crowd-low)]" />,
    error: <AlertCircle className="h-5 w-5 text-[var(--color-crowd-high)]" />,
    info: <Info className="h-5 w-5 text-[var(--color-brand-primary)]" />,
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-[100] md:left-auto md:w-[400px] animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-white rounded-[16px] shadow-lg border border-[var(--color-brand-secondary)]/10 p-4 flex gap-3">
        <div className="shrink-0 mt-0.5">{icons[type]}</div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-[var(--color-brand-secondary)]">{title}</h4>
          {description && <p className="text-sm text-[var(--color-brand-secondary)]/70 mt-1">{description}</p>}
        </div>
        <button 
          onClick={onClose}
          className="shrink-0 text-[var(--color-brand-secondary)]/40 hover:text-[var(--color-brand-secondary)] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
