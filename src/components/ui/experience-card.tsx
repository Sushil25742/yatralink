import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Clock } from "lucide-react"
import Image from "next/image"

interface ExperienceCardProps {
  title: string
  provider: string
  price: string
  rating: number
  duration: string
  imageUrl: string
}

export function ExperienceCard({ title, provider, price, rating, duration, imageUrl }: ExperienceCardProps) {
  return (
    <Card className="flex w-[280px] flex-shrink-0 overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
      <div className="relative w-28 h-28 flex-shrink-0 bg-[var(--color-brand-secondary)]/5">
        <Image 
          src={imageUrl} 
          alt={title} 
          fill 
          className="object-cover transition-transform group-hover:scale-105" 
          unoptimized 
        />
      </div>
      <CardContent className="flex flex-col justify-between p-3 flex-1 min-w-0">
        <div>
          <div className="flex justify-between items-start mb-1">
            <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]">
              Local Experience
            </span>
            <div className="flex items-center text-xs font-bold text-[var(--color-brand-secondary)]">
              <Star className="h-3 w-3 fill-[var(--color-brand-accent)] text-[var(--color-brand-accent)] mr-0.5" />
              {rating}
            </div>
          </div>
          <h3 className="font-bold text-sm text-[var(--color-brand-secondary)] line-clamp-2 leading-tight mb-1">{title}</h3>
          <p className="text-xs font-medium text-[var(--color-brand-secondary)]/70 truncate">by {provider}</p>
        </div>
        
        <div className="flex justify-between items-end mt-2">
          <div className="flex items-center text-xs font-semibold text-[var(--color-brand-secondary)]/60">
            <Clock className="h-3 w-3 mr-1" />
            {duration}
          </div>
          <span className="font-bold text-sm text-[var(--color-brand-primary)]">{price}</span>
        </div>
      </CardContent>
    </Card>
  )
}
