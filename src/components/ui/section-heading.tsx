import * as React from "react"
import { cn } from "@/utils/cn"

interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  action?: React.ReactNode
}

export function SectionHeading({ title, action, className, ...props }: SectionHeadingProps) {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)} {...props}>
      <h2 className="text-xl font-bold text-[var(--color-brand-secondary)] tracking-tight">
        {title}
      </h2>
      {action && <div>{action}</div>}
    </div>
  )
}
