import * as React from "react"
import { cn } from "@/utils/cn"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline"
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-2",
        {
          "bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]": variant === "default",
          "bg-[var(--color-brand-secondary)]/10 text-[var(--color-brand-secondary)]": variant === "secondary",
          "border border-[var(--color-brand-secondary)]/20 text-[var(--color-brand-secondary)]": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export type CrowdStatus = "LOW" | "MODERATE" | "HIGH" | "CRITICAL"

export interface CrowdBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: CrowdStatus
}

export function CrowdBadge({ status, className, ...props }: CrowdBadgeProps) {
  const statusConfig = {
    LOW: { label: "Low Crowd", color: "bg-[var(--color-crowd-low)]" },
    MODERATE: { label: "Moderate Crowd", color: "bg-[var(--color-crowd-mod)]" },
    HIGH: { label: "High Crowd", color: "bg-[var(--color-crowd-high)]" },
    CRITICAL: { label: "Critically Crowded", color: "bg-[var(--color-crowd-crit)]" },
  }

  const { label, color } = statusConfig[status]

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-md",
        className
      )}
      {...props}
    >
      <span className={cn("h-2 w-2 rounded-full animate-pulse", color)} />
      <span className="text-[var(--color-brand-secondary)]">{label}</span>
    </div>
  )
}
