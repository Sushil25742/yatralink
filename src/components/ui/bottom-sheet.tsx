"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/utils/cn"

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  // Prevent body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-[var(--color-brand-secondary)]/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 h-auto max-h-[90vh] flex flex-col rounded-t-[24px] bg-[var(--color-bg-base)] shadow-lg animate-in slide-in-from-bottom-full duration-300",
        "pb-[env(safe-area-inset-bottom)]"
      )}>
        <div className="flex h-14 shrink-0 items-center justify-between px-6 border-b border-[var(--color-brand-secondary)]/5">
          <h2 className="text-lg font-bold text-[var(--color-brand-secondary)]">{title}</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-2 hover:bg-[var(--color-brand-secondary)]/5 transition-colors"
          >
            <X className="h-5 w-5 text-[var(--color-brand-secondary)]/70" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="overflow-y-auto p-6 hide-scrollbar">
          {children}
        </div>
      </div>
    </>
  )
}
