"use client"

import * as React from "react"
import { TopAppBar } from "@/components/ui/top-app-bar"
import { BottomNav } from "@/components/ui/bottom-nav"
import { SearchBar } from "@/components/ui/search-bar"
import { PlaceCard } from "@/components/ui/place-card"
import { ExperienceCard } from "@/components/ui/experience-card"
import { SectionHeading } from "@/components/ui/section-heading"
import { FilterModal } from "@/components/ui/filter-modal"
import { Bell, MapPin, ChevronDown, Users, SlidersHorizontal } from "lucide-react"

export default function HomeExplorePage() {
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] pb-24">
      {/* Header */}
      <TopAppBar 
        title="" 
        leading={
          <div className="flex items-center gap-2 px-2">
            <div className="h-8 w-8 rounded-full bg-[var(--color-brand-primary)] flex items-center justify-center text-white font-bold text-lg">
              Y
            </div>
            <span className="font-bold text-[var(--color-brand-primary)] text-xl tracking-tight">YatraLink</span>
          </div>
        }
        trailing={
          <button className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-[var(--color-brand-secondary)]/5 text-[var(--color-brand-secondary)]">
            <Bell className="h-5 w-5" />
          </button>
        }
      />

      <main className="px-4 py-4 space-y-8">
        
        {/* Greeting & Search */}
        <section className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-brand-secondary)]">Namaste, Traveler! 👋</h1>
            <p className="text-sm font-semibold text-[var(--color-brand-primary)] mt-0.5">Travel Better. Support Local. Preserve Heritage.</p>
            <p className="text-[var(--color-brand-secondary)]/70 text-xs mt-1">Discover smart, crowd-aware routes through Nepal&apos;s rich cultural sites.</p>
          </div>
          
          <div className="flex gap-2">
            <SearchBar placeholder="Search places, experiences..." />
            <button 
              onClick={() => setIsFilterModalOpen(true)}
              className="w-12 h-12 flex-shrink-0 bg-[var(--color-brand-primary)] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[var(--color-brand-primary)]/90 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center text-sm font-medium text-[var(--color-brand-secondary)]/80 inline-flex px-3 py-1.5 rounded-full bg-white border border-[var(--color-brand-secondary)]/10 shadow-sm w-fit cursor-pointer hover:bg-[var(--color-brand-secondary)]/5 transition-colors">
            <MapPin className="h-4 w-4 text-[var(--color-brand-primary)] mr-1.5" />
            Patan, Lalitpur
            <ChevronDown className="h-4 w-4 ml-1 text-[var(--color-brand-secondary)]/50" />
          </div>
        </section>

        {/* Section 1: Live Crowd Overview */}
        <section>
          <SectionHeading title="Live Crowd Overview" className="mb-3" />
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[var(--color-crowd-low)]/10 rounded-[16px] p-3 flex flex-col items-center justify-center">
              <Users className="h-6 w-6 text-[var(--color-crowd-low)] mb-2" />
              <span className="text-[var(--color-crowd-low)] font-bold text-sm">Low</span>
              <span className="text-[var(--color-brand-secondary)]/70 text-xs font-medium">12 Places</span>
            </div>
            <div className="bg-[var(--color-crowd-mod)]/10 rounded-[16px] p-3 flex flex-col items-center justify-center">
              <Users className="h-6 w-6 text-[var(--color-crowd-mod)] mb-2" />
              <span className="text-[var(--color-crowd-mod)] font-bold text-sm">Moderate</span>
              <span className="text-[var(--color-brand-secondary)]/70 text-xs font-medium">18 Places</span>
            </div>
            <div className="bg-[var(--color-crowd-high)]/10 rounded-[16px] p-3 flex flex-col items-center justify-center">
              <Users className="h-6 w-6 text-[var(--color-crowd-high)] mb-2" />
              <span className="text-[var(--color-crowd-high)] font-bold text-sm">High</span>
              <span className="text-[var(--color-brand-secondary)]/70 text-xs font-medium">7 Places</span>
            </div>
          </div>
        </section>

        {/* Section 2: Top Places Near You */}
        <section>
          <SectionHeading title="Top Places Near You" className="mb-3" />
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 hide-scrollbar snap-x snap-mandatory">
            <div className="snap-start shrink-0">
              <PlaceCard 
                title="Patan Durbar Square"
                location="Lalitpur"
                distance="2.1 km"
                status="HIGH"
                imageUrl="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800"
              />
            </div>
            <div className="snap-start shrink-0">
              <PlaceCard 
                title="Golden Temple"
                location="Lalitpur"
                distance="1.5 km"
                status="MODERATE"
                imageUrl="https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&q=80&w=800"
              />
            </div>
            <div className="snap-start shrink-0">
              <PlaceCard 
                title="Mangal Bazaar"
                location="Lalitpur"
                distance="1.2 km"
                status="LOW"
                imageUrl="https://images.unsplash.com/photo-1588614959060-4d144f28b2ea?auto=format&fit=crop&q=80&w=800"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Local Experiences */}
        <section>
          <SectionHeading title="Local Experiences" className="mb-3" />
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 hide-scrollbar snap-x snap-mandatory">
            <div className="snap-start shrink-0">
              <ExperienceCard 
                title="Traditional Woodcarving Workshop"
                price="NPR 800"
                rating={4.8}
                duration="45 min"
                imageUrl="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=400"
              />
            </div>
            <div className="snap-start shrink-0">
              <ExperienceCard 
                title="Newari Lunch Experience"
                price="NPR 1,200"
                rating={4.9}
                duration="60 min"
                imageUrl="https://images.unsplash.com/photo-1551465223-92f7633c7f96?auto=format&fit=crop&q=80&w=400"
              />
            </div>
            <div className="snap-start shrink-0">
              <ExperienceCard 
                title="Heritage Walk Patan"
                price="NPR 600"
                rating={4.7}
                duration="90 min"
                imageUrl="https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&q=80&w=400"
              />
            </div>
          </div>
        </section>

      </main>

      <BottomNav />
      <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} />
    </div>
  )
}
