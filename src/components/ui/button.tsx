import * as React from "react"
import { cn } from "@/utils/cn"
import { Loader2 } from "lucide-react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-[16px] text-sm font-medium ring-offset-[var(--color-bg-base)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-primary)]/90": variant === "default",
            "bg-[var(--color-brand-secondary)] text-white hover:bg-[var(--color-brand-secondary)]/90": variant === "secondary",
            "border border-[var(--color-brand-secondary)]/20 bg-[var(--color-bg-card)] hover:bg-[var(--color-brand-secondary)]/5": variant === "outline",
            "hover:bg-[var(--color-brand-secondary)]/5": variant === "ghost",
            "text-[var(--color-brand-primary)] underline-offset-4 hover:underline": variant === "link",
            "h-12 px-6 py-2": size === "default",
            "h-9 rounded-[12px] px-3": size === "sm",
            "h-14 rounded-[16px] px-8 text-base": size === "lg",
            "h-12 w-12": size === "icon",
          },
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"
