import * as React from "react"
import { Users } from "lucide-react"
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
  showIcon?: boolean
}

export function CrowdBadge({ status, showIcon = true, className, ...props }: CrowdBadgeProps) {
  const statusConfig = {
    LOW: { label: "Low Crowd", colorClass: "bg-[var(--color-crowd-low)]/10 text-[var(--color-crowd-low)]", iconColor: "text-[var(--color-crowd-low)]" },
    MODERATE: { label: "Moderate Crowd", colorClass: "bg-[var(--color-crowd-mod)]/10 text-[var(--color-crowd-mod)]", iconColor: "text-[var(--color-crowd-mod)]" },
    HIGH: { label: "High Crowd", colorClass: "bg-[var(--color-crowd-high)]/10 text-[var(--color-crowd-high)]", iconColor: "text-[var(--color-crowd-high)]" },
    CRITICAL: { label: "Critically Crowded", colorClass: "bg-[var(--color-crowd-crit)]/10 text-[var(--color-crowd-crit)]", iconColor: "text-[var(--color-crowd-crit)]" },
  }

  const { label, colorClass, iconColor } = statusConfig[status]

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide",
        colorClass,
        className
      )}
      {...props}
    >
      {showIcon && <Users className={cn("w-3 h-3", iconColor)} />}
      <span>{label}</span>
    </div>
  )
}
