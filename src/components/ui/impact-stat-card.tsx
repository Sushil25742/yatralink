import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/utils/cn"

interface ImpactStatCardProps {
  title: string
  value: string
  subtitle?: string
  icon: React.ReactNode
  className?: string
}

export function ImpactStatCard({ title, value, subtitle, icon, className }: ImpactStatCardProps) {
  return (
    <Card className={cn("bg-[var(--color-brand-primary)] text-white border-none", className)}>
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-bold">{value}</h4>
            {subtitle && <span className="text-xs text-white/70">{subtitle}</span>}
          </div>
        </div>
        <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}
