"use client"

import * as React from "react"
import { TopAppBar } from "@/components/ui/top-app-bar"
import { BottomNav } from "@/components/ui/bottom-nav"
import { Button } from "@/components/ui/button"
import { CrowdBadge } from "@/components/ui/badge"
import { BottomSheet } from "@/components/ui/bottom-sheet"
import { Toast } from "@/components/ui/toast"
import { ArrowLeft, Hammer, Landmark, Utensils, Map, Play, AlertTriangle, Info } from "lucide-react"
import Link from "next/link"
import { useApp } from "@/context/AppContext"
import { useRouter } from "next/navigation"

export default function SmartItineraryPage() {
  const { state, updateJourneyToAlternative } = useApp()
  const router = useRouter()
  const [alertOpen, setAlertOpen] = React.useState(false)
  const [toastOpen, setToastOpen] = React.useState(false)
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [hasAlerted, setHasAlerted] = React.useState(false)

  // Listen for high crowd status from simulator to trigger alert
  React.useEffect(() => {
    if (!hasAlerted && (state.crowdPatanDurbar === "HIGH" || state.crowdPatanDurbar === "CRITICAL")) {
      // Check if Patan Durbar Square is in the journey
      const hasDurbarSquare = state.journeyStops.some(stop => stop.title === "Patan Durbar Square")
      if (hasDurbarSquare) {
        setTimeout(() => {
          setAlertOpen(true)
          setHasAlerted(true)
        }, 0)
      }
    }
  }, [state.crowdPatanDurbar, hasAlerted, state.journeyStops])

  const handleUpdateJourney = () => {
    setIsUpdating(true)
    setTimeout(() => {
      updateJourneyToAlternative() // global state update
      setIsUpdating(false)
      setAlertOpen(false)
      setToastOpen(true)
    }, 1000)
  }

  const getIconForCategory = (category: string) => {
    switch (category) {
      case "experience": return <Hammer className="w-4 h-4 text-[var(--color-brand-primary)]" />
      case "heritage": return <Landmark className="w-4 h-4 text-amber-700" />
      default: return <Utensils className="w-4 h-4 text-[var(--color-brand-primary)]" />
    }
  }

  const getBgForCategory = (category: string) => {
    switch (category) {
      case "experience": return "bg-[var(--color-brand-primary)]/10"
      case "heritage": return "bg-amber-100"
      default: return "bg-blue-100"
    }
  }

  if (!state.hasGeneratedJourney) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-base)] pb-28 flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-bold text-[var(--color-brand-secondary)] mb-2">No Journey Planned</h2>
        <p className="text-[var(--color-brand-secondary)]/70 mb-6">You haven't generated an itinerary yet.</p>
        <Link href="/journey">
          <Button>Plan a Journey</Button>
        </Link>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] pb-28">
      <TopAppBar 
        title="Smart Itinerary" 
        leading={
          <Link href="/journey" className="p-2 -ml-2 rounded-full hover:bg-[var(--color-brand-secondary)]/5 text-[var(--color-brand-secondary)]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        }
      />

      <main className="px-5 py-4">
        
        {/* Header Summary */}
        <div className="mb-8 bg-white p-5 rounded-[20px] shadow-sm border border-[var(--color-brand-secondary)]/10">
          <h1 className="text-2xl font-bold text-[var(--color-brand-secondary)] mb-2 tracking-tight">Heritage & Culture Walk</h1>
          <div className="flex items-center text-sm font-semibold text-[var(--color-brand-secondary)]/70 mb-4">
            <span>4 Hours</span>
            <span className="mx-2">•</span>
            <span>{state.journeyStops.length} Stops</span>
          </div>
          
          <div className="flex gap-4 border-t border-[var(--color-brand-secondary)]/10 pt-4">
            <div className="flex-1">
              <span className="block text-xs uppercase font-bold text-[var(--color-brand-secondary)]/50 tracking-wider mb-1">Est. Cost</span>
              <span className="font-bold text-[var(--color-brand-secondary)]">NPR 2,700</span>
            </div>
            <div className="w-px bg-[var(--color-brand-secondary)]/10" />
            <div className="flex-1">
              <span className="block text-xs uppercase font-bold text-[var(--color-brand-secondary)]/50 tracking-wider mb-1">Local Impact</span>
              <span className="font-bold text-[var(--color-crowd-low)]">High</span>
            </div>
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className="relative border-l-2 border-[var(--color-brand-secondary)]/10 ml-4 space-y-8 pb-8">
          
          {state.journeyStops.map((stop, i) => (
            <div key={stop.id} className="relative pl-8">
              <div className={`absolute -left-[17px] top-1 h-8 w-8 rounded-full ${getBgForCategory(stop.category)} border-2 border-[var(--color-bg-base)] flex items-center justify-center shadow-sm`}>
                {getIconForCategory(stop.category)}
              </div>
              <div className="flex flex-col">
                <span className={`text-sm font-bold mb-1 ${stop.crowd === "HIGH" || stop.crowd === "CRITICAL" ? "text-[var(--color-crowd-high)]" : "text-[var(--color-brand-primary)]"}`}>
                  {stop.time}
                </span>
                <h3 className="text-lg font-bold text-[var(--color-brand-secondary)] leading-tight mb-1">{stop.title}</h3>
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-brand-secondary)]/60 mb-2">
                  <span className="capitalize">{stop.category}</span>
                  <span>•</span>
                  <span>{stop.duration}</span>
                  {stop.price && (
                    <>
                      <span>•</span>
                      <span>{stop.price}</span>
                    </>
                  )}
                </div>
                <CrowdBadge status={stop.crowd} className="w-fit shadow-none bg-white border border-[var(--color-brand-secondary)]/10 mb-3" />
                
                {(stop.crowd === "HIGH" || stop.crowd === "CRITICAL") && (
                  <div className="bg-[var(--color-brand-primary)]/10 p-3 rounded-lg border border-[var(--color-brand-primary)]/20 flex gap-2">
                    <Info className="w-4 h-4 text-[var(--color-brand-primary)] shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-[var(--color-brand-primary)]">
                      Visit later for lower crowd pressure. YatraLink suggests swapping this stop.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}

        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <Button variant="outline" className="flex-1 font-bold" onClick={() => router.push("/map")}>
            <Map className="w-4 h-4 mr-2" />
            View Map
          </Button>
          <Button className="flex-[2] font-bold">
            <Play className="w-4 h-4 mr-2" />
            Start Journey
          </Button>
        </div>

      </main>

      <BottomNav />

      {/* Reorder Toast Notification */}
      <Toast 
        title="Journey Updated" 
        description="Your route has been intelligently reordered to avoid crowds."
        type="success"
        isVisible={toastOpen}
        onClose={() => setToastOpen(false)}
      />

      {/* Crowd Alert Bottom Sheet */}
      <BottomSheet isOpen={alertOpen} onClose={() => setAlertOpen(false)} title="">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-6 w-6 text-[var(--color-crowd-mod)]" />
          <h2 className="text-xl font-bold tracking-tight text-[var(--color-brand-secondary)]">CROWD ALERT</h2>
        </div>
        
        <p className="font-semibold text-lg text-[var(--color-brand-secondary)] leading-snug mb-3">
          Patan Durbar Square is currently experiencing a high crowd surge.
        </p>

        <div className="flex items-center text-sm font-bold text-[var(--color-brand-secondary)] bg-[var(--color-brand-secondary)]/5 px-3 py-2 rounded-lg w-fit mb-6">
          <span className="text-[var(--color-brand-secondary)]/60 font-semibold mr-2 uppercase tracking-wide text-xs">Estimated wait:</span>
          40–50 min
        </div>

        <p className="text-[var(--color-brand-secondary)] font-medium mb-4">
          Explore this nearby alternative while the crowd decreases:
        </p>

        <div className="space-y-3 mb-8">
          {/* Alternative 1 */}
          <Link href="/experiences/details" className="block">
            <div className="p-3 border border-[var(--color-brand-primary)] rounded-[12px] bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
              <div>
                <h4 className="font-semibold text-sm mb-1 line-clamp-1">Traditional Woodcarving Workshop</h4>
                <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-brand-secondary)]/60">
                  <CrowdBadge status="LOW" className="bg-transparent p-0 shadow-none gap-1 [&>span:last-child]:font-semibold" />
                  <span>•</span>
                  <span>5 min walk</span>
                </div>
              </div>
              <div className="text-sm font-bold shrink-0 text-[var(--color-brand-primary)]">Book Now</div>
            </div>
          </Link>
          
          {/* Alternative 2 */}
          <div className="p-3 border border-[var(--color-brand-secondary)]/10 rounded-[12px] bg-white flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-sm mb-1 line-clamp-1">Mangal Bazaar Exploration</h4>
              <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-brand-secondary)]/60">
                <CrowdBadge status="LOW" className="bg-transparent p-0 shadow-none gap-1 [&>span:last-child]:font-semibold" />
                <span>•</span>
                <span>8 min walk</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            className="flex-1" 
            onClick={handleUpdateJourney}
            isLoading={isUpdating}
          >
            Update My Journey
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => setAlertOpen(false)}
            disabled={isUpdating}
          >
            Keep Original
          </Button>
        </div>
      </BottomSheet>
    </div>
  )
}
