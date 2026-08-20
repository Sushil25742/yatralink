import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/utils/cn"

export type SearchBarProps = React.InputHTMLAttributes<HTMLInputElement>

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className={cn("relative flex items-center w-full", className)}>
        <Search className="absolute left-4 h-5 w-5 text-[var(--color-brand-secondary)]/40" />
        <input
          ref={ref}
          className="w-full h-12 pl-12 pr-4 rounded-full bg-white border border-[var(--color-brand-secondary)]/10 text-[var(--color-brand-secondary)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent placeholder:text-[var(--color-brand-secondary)]/40 text-base"
          {...props}
        />
      </div>
    )
  }
)
SearchBar.displayName = "SearchBar"
