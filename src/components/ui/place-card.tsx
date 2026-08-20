import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
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
    <Card className="w-[240px] flex-shrink-0 overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
      <div className="relative h-32 w-full bg-[var(--color-brand-secondary)]/5">
        <Image 
          src={imageUrl} 
          alt={title} 
          fill 
          className="object-cover transition-transform group-hover:scale-105" 
          unoptimized 
        />
        <div className="absolute top-2 left-2">
          <CrowdBadge status={status} />
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-semibold text-base line-clamp-1">{title}</h3>
        <div className="flex items-center text-xs text-[var(--color-brand-secondary)]/60 mt-1.5">
          <MapPin className="h-3 w-3 mr-1 shrink-0" />
          <span className="line-clamp-1">{distance || location}</span>
        </div>
      </CardContent>
    </Card>
  )
}
