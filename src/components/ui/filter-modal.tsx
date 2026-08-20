import * as React from "react"
import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FilterModal({ isOpen, onClose }: FilterModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[var(--color-brand-secondary)]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full rounded-t-[24px] shadow-2xl pb-safe pt-2 animate-in slide-in-from-bottom-full duration-300">
        
        {/* Drag handle */}
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />

        <div className="px-5 pb-6 max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[var(--color-brand-secondary)] flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-[var(--color-brand-primary)]" />
              Smart Filters
            </h2>
            <button className="text-sm font-bold text-[var(--color-brand-secondary)]/50 hover:text-[var(--color-brand-secondary)] transition-colors">
              Reset
            </button>
          </div>

          <div className="space-y-8">
            {/* Crowd Level */}
            <section>
              <h3 className="text-base font-bold text-[var(--color-brand-secondary)] mb-3">Crowd Level</h3>
              <div className="flex flex-col gap-2">
                <button className="flex items-center justify-between p-3 rounded-xl border-2 border-[var(--color-crowd-low)] bg-[var(--color-crowd-low)]/5 text-left">
                  <span className="font-bold text-[var(--color-brand-secondary)] text-sm">Low Crowd (&lt;30%)</span>
                  <div className="w-4 h-4 rounded-full border-2 border-[var(--color-crowd-low)] bg-[var(--color-crowd-low)] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                </button>
                <button className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-brand-secondary)]/10 text-left hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-[var(--color-brand-secondary)]/70 text-sm">Moderate Crowd (30-70%)</span>
                  <div className="w-4 h-4 rounded-full border-2 border-[var(--color-brand-secondary)]/20" />
                </button>
                <button className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-brand-secondary)]/10 text-left hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-[var(--color-brand-secondary)]/70 text-sm">High Crowd (&gt;70%)</span>
                  <div className="w-4 h-4 rounded-full border-2 border-[var(--color-brand-secondary)]/20" />
                </button>
              </div>
            </section>

            {/* Interest */}
            <section>
              <h3 className="text-base font-bold text-[var(--color-brand-secondary)] mb-3">Interest</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 rounded-full border-2 border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] font-bold text-sm cursor-pointer">
                  Heritage Sites
                </span>
                <span className="px-4 py-2 rounded-full border-2 border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] font-bold text-sm cursor-pointer">
                  Local Food
                </span>
                <span className="px-4 py-2 rounded-full border border-[var(--color-brand-secondary)]/20 text-[var(--color-brand-secondary)]/60 font-semibold text-sm cursor-pointer hover:bg-gray-50">
                  Handicrafts
                </span>
                <span className="px-4 py-2 rounded-full border border-[var(--color-brand-secondary)]/20 text-[var(--color-brand-secondary)]/60 font-semibold text-sm cursor-pointer hover:bg-gray-50">
                  Spiritual
                </span>
              </div>
            </section>

            {/* Time Available */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-[var(--color-brand-secondary)]">Time Available</h3>
                <span className="text-sm font-bold text-[var(--color-brand-primary)]">2 hours</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full w-full relative">
                <div className="absolute left-0 h-full w-1/3 bg-[var(--color-brand-primary)] rounded-full" />
                <div className="absolute left-1/3 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white border-2 border-[var(--color-brand-primary)] rounded-full shadow-sm" />
              </div>
            </section>

            {/* Budget Range */}
            <section className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-[var(--color-brand-secondary)]">Budget Range</h3>
                <span className="text-sm font-bold text-[var(--color-brand-primary)]">NPR 1,000 - 5,000</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full w-full relative">
                <div className="absolute left-1/4 h-full w-1/2 bg-[var(--color-brand-primary)] rounded-full" />
                <div className="absolute left-1/4 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white border-2 border-[var(--color-brand-primary)] rounded-full shadow-sm" />
                <div className="absolute left-3/4 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white border-2 border-[var(--color-brand-primary)] rounded-full shadow-sm" />
              </div>
            </section>
            
            <div className="pt-2">
              <Button className="w-full h-14 text-base font-bold rounded-2xl shadow-md" onClick={onClose}>
                Show 12 Results
              </Button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
