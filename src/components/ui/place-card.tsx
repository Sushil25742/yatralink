import * as React from "react"
import { Card } from "@/components/ui/card"
import { CrowdBadge, CrowdStatus } from "@/components/ui/badge"
import { MapPin } from "lucide-react"
import Image from "next/image"

interface PlaceCardProps {
  title: string
  location?: string
  distance?: string
  imageUrl: string
  status: CrowdStatus
}

export function PlaceCard({ title, location, distance, imageUrl, status }: PlaceCardProps) {
  return (
    <Card className="w-[180px] flex-shrink-0 overflow-hidden group cursor-pointer hover:shadow-md transition-shadow rounded-[16px] border-none shadow-sm bg-white">
      <div className="relative h-28 w-full bg-[var(--color-brand-secondary)]/5">
        <Image 
          src={imageUrl} 
          alt={title} 
          fill 
          className="object-cover transition-transform group-hover:scale-105" 
          unoptimized 
        />
      </div>
      <div className="p-3">
        <h3 className="font-bold text-sm text-[var(--color-brand-secondary)] line-clamp-2 leading-snug mb-2">{title}</h3>
        <CrowdBadge status={status} className="mb-2" />
        <div className="flex items-center text-xs font-medium text-[var(--color-brand-secondary)]/60">
          <MapPin className="h-3 w-3 mr-1 shrink-0" />
          <span className="line-clamp-1">{distance || location}</span>
        </div>
      </div>
    </Card>
  )
}
