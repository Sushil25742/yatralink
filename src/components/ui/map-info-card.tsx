"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CrowdBadge, CrowdStatus } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Navigation, Info } from "lucide-react"
import { cn } from "@/utils/cn"

interface MapInfoCardProps {
  title: string
  status: CrowdStatus
  walkingTime: string
  isAlternative?: boolean
  onClose?: () => void
  onAction?: () => void
  className?: string
}

export function MapInfoCard({
  title,
  status,
  walkingTime,
  isAlternative,
  onClose,
  onAction,
  className,
}: MapInfoCardProps) {
  return (
    <Card className={cn("w-full max-w-sm overflow-hidden shadow-lg border-[var(--color-brand-secondary)]/10", className)}>
      <div className={cn("px-4 py-3 flex items-start justify-between", isAlternative ? "bg-[var(--color-brand-primary)]/5" : "")}>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <CrowdBadge status={status} />
            {onClose && (
              <button onClick={onClose} className="text-[var(--color-brand-secondary)]/40 hover:text-[var(--color-brand-secondary)]">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <h3 className="font-bold text-lg leading-tight mb-1">{title}</h3>
          
          {(status === "HIGH" || status === "CRITICAL") && !isAlternative && (
            <div className="mt-3 p-3 bg-[var(--color-brand-secondary)]/5 rounded-lg border border-[var(--color-brand-secondary)]/10">
              <p className="text-sm font-medium text-[var(--color-brand-secondary)] flex items-start gap-2">
                <Info className="h-4 w-4 text-[var(--color-brand-primary)] mt-0.5 shrink-0" />
                <span>
                  This place is busy now.<br/>
                  Here are better nearby experiences you can visit first.
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
      
      <CardContent className="p-4 pt-2 bg-white">
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center text-sm font-medium text-[var(--color-brand-secondary)]/70">
            <Navigation className="h-4 w-4 mr-1.5" />
            {walkingTime}
          </div>
          <Button size="sm" variant={isAlternative ? "default" : "outline"} onClick={onAction} className="h-8 rounded-full px-4">
            {isAlternative ? "Go Here Instead" : "View Details"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
