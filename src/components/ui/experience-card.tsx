import * as React from "react"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"

interface ExperienceCardProps {
  title: string
  price: string
  rating: number
  duration: string
  imageUrl: string
}

export function ExperienceCard({ title, price, rating, duration, imageUrl }: ExperienceCardProps) {
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
        <h3 className="font-bold text-sm text-[var(--color-brand-secondary)] line-clamp-2 leading-snug mb-1">{title}</h3>
        <p className="text-xs font-semibold text-[var(--color-brand-secondary)]/70 mb-2">{price} • {duration}</p>
        <div className="flex items-center text-xs font-bold text-[var(--color-brand-secondary)]">
          <Star className="h-3.5 w-3.5 fill-[var(--color-brand-accent)] text-[var(--color-brand-accent)] mr-1" />
          {rating} <span className="text-[var(--color-brand-secondary)]/50 font-medium ml-1">(120)</span>
        </div>
      </div>
    </Card>
  )
}
