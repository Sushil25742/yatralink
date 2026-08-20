"use client"

import * as React from "react"
import { TopAppBar } from "@/components/ui/top-app-bar"
import { BottomNav } from "@/components/ui/bottom-nav"
import { FilterChip } from "@/components/ui/filter-chip"
import { Button } from "@/components/ui/button"
import { MapPin, ChevronRight } from "lucide-react"
import { useApp } from "@/context/AppContext"
import { useRouter } from "next/navigation"

export default function JourneyPage() {
  const [budget, setBudget] = React.useState(3000)
  const [activeTime, setActiveTime] = React.useState("4 Hours")
  const { generateJourney } = useApp()
  const router = useRouter()

  const handleGenerate = () => {
    generateJourney()
    router.push("/journey/itinerary")
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] pb-24">
      <TopAppBar title="Journey" />

      <main className="px-4 py-4 space-y-8">
        
        <section>
          <h1 className="text-2xl font-bold text-[var(--color-brand-secondary)] mb-1">Create Your Journey</h1>
          <p className="text-[var(--color-brand-secondary)]/70 text-sm">Tell YatraLink what kind of experience you want.</p>
        </section>

        <section className="space-y-6">
          
          {/* Destination */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[var(--color-brand-secondary)]">Destination</h3>
            <div className="flex items-center justify-between p-4 bg-white rounded-[16px] border border-[var(--color-brand-secondary)]/10 shadow-sm cursor-pointer hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-[var(--color-brand-primary)]" />
                <span className="font-semibold text-[var(--color-brand-secondary)]">Patan, Lalitpur</span>
              </div>
              <ChevronRight className="h-5 w-5 text-[var(--color-brand-secondary)]/50" />
            </div>
          </div>

          {/* Available Time */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[var(--color-brand-secondary)]">Available Time</h3>
            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {["2 Hours", "4 Hours", "6 Hours", "Full Day"].map(time => (
                <FilterChip 
                  key={time} 
                  active={activeTime === time}
                  onClick={() => setActiveTime(time)}
                >
                  {time}
                </FilterChip>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <h3 className="text-sm font-bold text-[var(--color-brand-secondary)]">Budget (NPR)</h3>
              <span className="text-sm font-semibold text-[var(--color-brand-primary)]">
                {budget.toLocaleString()}
              </span>
            </div>
            <div className="px-2 pt-2 pb-4">
              <input 
                type="range" 
                min="0" 
                max="10000" 
                step="500" 
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-[var(--color-brand-primary)] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-[var(--color-brand-secondary)]/50 mt-2 font-medium">
                <span>0</span>
                <span>10,000+</span>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[var(--color-brand-secondary)]">Interests</h3>
            <div className="flex flex-wrap gap-2">
              <FilterChip active>Culture</FilterChip>
              <FilterChip>Heritage</FilterChip>
              <FilterChip>Architecture</FilterChip>
              <FilterChip>Local Food</FilterChip>
              <FilterChip>Crafts</FilterChip>
              <FilterChip>Spiritual</FilterChip>
              <FilterChip active>Photography</FilterChip>
              <FilterChip>Hidden Gems</FilterChip>
            </div>
          </div>

          {/* Crowd Preference */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[var(--color-brand-secondary)]">Crowd Preference</h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 p-3 bg-white border border-[var(--color-brand-primary)] rounded-[12px] cursor-pointer">
                <input type="radio" name="crowd" defaultChecked className="accent-[var(--color-brand-primary)] w-4 h-4" />
                <span className="text-sm font-semibold text-[var(--color-brand-secondary)]">Avoid crowded places</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-white border border-[var(--color-brand-secondary)]/10 rounded-[12px] cursor-pointer opacity-70">
                <input type="radio" name="crowd" className="accent-[var(--color-brand-primary)] w-4 h-4" />
                <span className="text-sm font-medium text-[var(--color-brand-secondary)]">Balanced</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-white border border-[var(--color-brand-secondary)]/10 rounded-[12px] cursor-pointer opacity-70">
                <input type="radio" name="crowd" className="accent-[var(--color-brand-primary)] w-4 h-4" />
                <span className="text-sm font-medium text-[var(--color-brand-secondary)]">Popular attractions first</span>
              </label>
            </div>
          </div>

          {/* Walking Preference */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[var(--color-brand-secondary)]">Walking Preference</h3>
            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              <FilterChip>Minimal walking</FilterChip>
              <FilterChip active>Normal</FilterChip>
              <FilterChip>I love walking</FilterChip>
            </div>
          </div>

        </section>

        {/* Action Bottom */}
        <div className="pt-6 pb-2 space-y-4 text-center">
          <Button className="w-full h-14 text-lg" onClick={handleGenerate}>
            Generate My Journey
          </Button>
          <p className="text-xs text-[var(--color-brand-secondary)]/60 font-medium px-4">
            YatraLink combines your interests, local availability and crowd conditions to build your route.
          </p>
        </div>

      </main>

      <BottomNav />
    </div>
  )
}
