"use client"

import * as React from "react"
import { TopAppBar } from "@/components/ui/top-app-bar"
import { BottomNav } from "@/components/ui/bottom-nav"
import { FilterChip } from "@/components/ui/filter-chip"
import { CrowdBadge } from "@/components/ui/badge"
import { Star, Clock, MapPin, CalendarCheck, Heart } from "lucide-react"

export default function ExperiencesPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] pb-28">
      <TopAppBar 
        title="Experience Local Patan" 
        trailing={<SearchIcon />}
      />

      {/* Filters */}
      <div className="sticky top-0 z-30 bg-[var(--color-bg-base)]/90 backdrop-blur-md pt-2 pb-4 px-4 -mx-4 mx-0 shadow-sm border-b border-[var(--color-brand-secondary)]/5">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          <FilterChip active>All</FilterChip>
          <FilterChip>Crafts</FilterChip>
          <FilterChip>Food</FilterChip>
          <FilterChip>Culture</FilterChip>
          <FilterChip>Guides</FilterChip>
          <FilterChip>Workshops</FilterChip>
          <FilterChip>Heritage Walks</FilterChip>
        </div>
      </div>

      <main className="px-4 py-6 space-y-8">
        
        <ExperienceEditorialCard 
          title="Traditional Woodcarving Workshop"
          host="Master Shilpakar"
          price="NPR 800"
          duration="45 min"
          rating={4.8}
          reviews={124}
          distance="5 min walk"
          availability="Available Today"
          crowdStatus="LOW"
          imageUrl="https://images.unsplash.com/photo-1605648916319-cf082f7524a1?q=80&w=1000&auto=format&fit=crop"
        />

        <ExperienceEditorialCard 
          title="Newari Cooking Experience"
          host="Saraswati Kitchen"
          price="NPR 1,200"
          duration="60 min"
          rating={4.9}
          reviews={89}
          distance="12 min walk"
          availability="Next slot: 4:00 PM"
          crowdStatus="LOW"
          imageUrl="https://images.unsplash.com/photo-1546549095-5a3cb5b9c1bc?q=80&w=1000&auto=format&fit=crop"
        />

        <ExperienceEditorialCard 
          title="Pottery Workshop"
          host="Prajapati Ceramics"
          price="NPR 900"
          duration="60 min"
          rating={4.7}
          reviews={210}
          distance="15 min walk"
          availability="Available Today"
          crowdStatus="MODERATE"
          imageUrl="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=1000&auto=format&fit=crop"
        />

        <ExperienceEditorialCard 
          title="Patan Heritage Walk"
          host="Local Guide Association"
          price="NPR 600"
          duration="90 min"
          rating={4.8}
          reviews={430}
          distance="Starts at Durbar Sq."
          availability="Tomorrow Morning"
          crowdStatus="HIGH"
          imageUrl="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop"
        />

        <ExperienceEditorialCard 
          title="Paubha Painting Introduction"
          host="Vajra Art Studio"
          price="NPR 1,500"
          duration="90 min"
          rating={4.9}
          reviews={56}
          distance="8 min walk"
          availability="Available Today"
          crowdStatus="LOW"
          imageUrl="https://images.unsplash.com/photo-1582560469792-ecfb6a3459c5?q=80&w=1000&auto=format&fit=crop"
        />

      </main>

      <BottomNav />
    </div>
  )
}

function SearchIcon() {
  return (
    <button className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--color-brand-secondary)] hover:bg-[var(--color-brand-secondary)]/5 transition">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3"></path>
      </svg>
    </button>
  )
}

interface ExperienceEditorialCardProps {
  title: string
  host: string
  price: string
  duration: string
  rating: number
  reviews: number
  distance: string
  availability: string
  crowdStatus: "LOW" | "MODERATE" | "HIGH" | "CRITICAL"
  imageUrl: string
}

function ExperienceEditorialCard({ 
  title, host, price, duration, rating, reviews, distance, availability, crowdStatus, imageUrl 
}: ExperienceEditorialCardProps) {
  
  return (
    <div className="group cursor-pointer">
      {/* Editorial Image Container */}
      <div className="relative w-full aspect-[4/3] rounded-[24px] overflow-hidden mb-4 shadow-sm">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        
        {/* Gradient Overlay for Top Badges */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
        
        <div className="absolute top-4 left-4">
          <CrowdBadge status={crowdStatus} />
        </div>
        
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white transition-colors hover:text-red-500">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="px-1">
        <div className="flex justify-between items-start mb-1">
          <h2 className="text-xl font-bold text-[var(--color-brand-secondary)] leading-tight flex-1 pr-4">
            {title}
          </h2>
          <div className="flex items-center gap-1 bg-[var(--color-brand-secondary)]/5 px-2 py-1 rounded-md text-[var(--color-brand-secondary)] font-bold text-sm">
            <Star className="w-3.5 h-3.5 fill-[var(--color-brand-accent)] text-[var(--color-brand-accent)]" />
            {rating}
          </div>
        </div>

        <p className="text-sm font-medium text-[var(--color-brand-secondary)]/60 mb-3">
          Hosted by <span className="text-[var(--color-brand-secondary)] underline decoration-[var(--color-brand-secondary)]/20 underline-offset-2">{host}</span>
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-y-2 mb-4">
          <div className="flex items-center text-sm font-semibold text-[var(--color-brand-secondary)]/80">
            <Clock className="w-4 h-4 mr-2 text-[var(--color-brand-primary)]" />
            {duration}
          </div>
          <div className="flex items-center text-sm font-semibold text-[var(--color-brand-secondary)]/80">
            <MapPin className="w-4 h-4 mr-2 text-[var(--color-brand-primary)]" />
            {distance}
          </div>
          <div className="flex items-center text-sm font-semibold text-[var(--color-brand-secondary)]/80 col-span-2">
            <CalendarCheck className="w-4 h-4 mr-2 text-[var(--color-brand-primary)]" />
            <span className="text-[var(--color-brand-primary)]">{availability}</span>
          </div>
        </div>

        {/* Divider & Price */}
        <div className="border-t border-[var(--color-brand-secondary)]/10 pt-3 flex items-center justify-between">
          <div className="text-sm font-bold text-[var(--color-brand-secondary)]/60">
            From <span className="text-lg text-[var(--color-brand-secondary)]">{price}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
