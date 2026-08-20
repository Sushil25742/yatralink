import * as React from "react"
import { cn } from "@/utils/cn"

interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

export const FilterChip = React.forwardRef<HTMLButtonElement, FilterChipProps>(
  ({ className, active, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] disabled:pointer-events-none disabled:opacity-50",
          active 
            ? "bg-[var(--color-brand-secondary)] text-white shadow-sm" 
            : "bg-white text-[var(--color-brand-secondary)]/80 border border-[var(--color-brand-secondary)]/10 hover:bg-[var(--color-brand-secondary)]/5",
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
FilterChip.displayName = "FilterChip"
