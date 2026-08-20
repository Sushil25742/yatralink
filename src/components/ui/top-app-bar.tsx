import * as React from "react"
import { cn } from "@/utils/cn"

interface TopAppBarProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
  leading?: React.ReactNode
  trailing?: React.ReactNode
}

export function TopAppBar({ title, leading, trailing, className, ...props }: TopAppBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full bg-[var(--color-bg-base)]/80 backdrop-blur-md",
        className
      )}
      {...props}
    >
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex flex-1 items-center justify-start">{leading}</div>
        
        {title && (
          <h1 className="text-lg font-bold text-[var(--color-brand-secondary)] tracking-tight line-clamp-1">
            {title}
          </h1>
        )}
        
        <div className="flex flex-1 items-center justify-end">{trailing}</div>
      </div>
    </header>
  )
}
