"use client"

import * as React from "react"
import { BottomNav } from "@/components/ui/bottom-nav"
import { FilterChip } from "@/components/ui/filter-chip"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CrowdBadge } from "@/components/ui/badge"
import { MapPin, Info, Clock, Route, UserCircle2, X } from "lucide-react"

export default function MapPage() {
  const [selectedPlace, setSelectedPlace] = React.useState<string | null>("patan")
  const [crowdLayerOn, setCrowdLayerOn] = React.useState(true)

  return (
    <div className="relative min-h-screen bg-[#E5E3DF] overflow-hidden pb-16">
      {/* Fake Map Background (Grid Pattern) to simulate Mapbox/Google Maps aesthetic without actual map tiles */}
      <div className="absolute inset-0 opacity-40" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
           }} 
      />
      
      {/* Decorative Map Routes/Roads (Stylized) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <path d="M-10,50 Q100,100 200,300 T500,400" stroke="#FFFFFF" strokeWidth="8" fill="none" />
        <path d="M100,-10 Q150,200 100,500 T300,900" stroke="#FFFFFF" strokeWidth="12" fill="none" />
        <path d="M400,-10 Q350,300 500,600" stroke="#FFFFFF" strokeWidth="6" fill="none" />
      </svg>

      {/* Top Floating Controls */}
      <div className="absolute top-0 inset-x-0 z-40 p-4 pt-safe space-y-4 pointer-events-none">
        
        {/* Top Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 hide-scrollbar pointer-events-auto">
          <FilterChip active>All</FilterChip>
          <FilterChip>Heritage</FilterChip>
          <FilterChip>Food</FilterChip>
          <FilterChip>Crafts</FilterChip>
          <FilterChip>Spiritual</FilterChip>
        </div>

        {/* Crowd Layer Toggle */}
        <div className="flex justify-end pointer-events-auto pr-2">
          <div className="bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-sm border border-[var(--color-brand-secondary)]/10 flex items-center gap-3">
            <span className="text-sm font-semibold text-[var(--color-brand-secondary)]">Crowd Layer</span>
            <button 
              onClick={() => setCrowdLayerOn(!crowdLayerOn)}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${crowdLayerOn ? 'bg-[var(--color-brand-primary)]' : 'bg-gray-300'}`}
            >
              <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${crowdLayerOn ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Route Lines */}
      {crowdLayerOn && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 drop-shadow-sm">
          {/* User to Patan (Crowded Route) */}
          <line x1="25%" y1="75%" x2="50%" y2="40%" stroke="var(--color-crowd-high)" strokeWidth="3" opacity="0.6" strokeDasharray="4 4" className="animate-pulse" />
          
          {/* User to Workshop (Alternative) */}
          <line x1="25%" y1="75%" x2="45%" y2="65%" stroke="var(--color-brand-primary)" strokeWidth="4" />
          
          {/* Workshop to Golden Temple (Alternative next step) */}
          <line x1="45%" y1="65%" x2="35%" y2="25%" stroke="var(--color-brand-primary)" strokeWidth="4" strokeDasharray="6 6" opacity="0.8" />
        </svg>
      )}

      {/* Map Markers */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        
        {/* User Location */}
        <div className="absolute top-[75%] left-[25%] transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <div className="relative">
            <div className="w-8 h-8 bg-blue-500/20 rounded-full animate-ping absolute inset-0" />
            <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center relative z-10 border-2 border-blue-500">
              <UserCircle2 className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Golden Temple */}
        <MapMarker 
          top="25%" left="35%" 
          color="var(--color-crowd-mod)"
          label="Golden Temple"
          crowd="MODERATE"
          onClick={() => setSelectedPlace("golden_temple")}
          selected={selectedPlace === "golden_temple"}
          crowdLayerOn={crowdLayerOn}
        />

        {/* Patan Durbar Square */}
        <MapMarker 
          top="40%" left="50%" 
          color="var(--color-crowd-high)"
          label="Patan Durbar Square"
          crowd="HIGH"
          onClick={() => setSelectedPlace("patan")}
          selected={selectedPlace === "patan"}
          pulse
          crowdLayerOn={crowdLayerOn}
        />

        {/* Mangal Bazaar */}
        <MapMarker 
          top="60%" left="75%" 
          color="var(--color-crowd-low)"
          label="Mangal Bazaar"
          crowd="LOW"
          onClick={() => setSelectedPlace("mangal")}
          selected={selectedPlace === "mangal"}
          crowdLayerOn={crowdLayerOn}
        />

        {/* Woodcarving Workshop (Alternative) */}
        <MapMarker 
          top="65%" left="45%" 
          color="var(--color-crowd-low)"
          label="Woodcarving Workshop"
          subtitle="Alternative"
          icon={<Route className="w-4 h-4 text-white" />}
          crowd="LOW"
          onClick={() => setSelectedPlace("workshop")}
          selected={selectedPlace === "workshop"}
          crowdLayerOn={crowdLayerOn}
        />

        {/* Route Time Labels */}
        {crowdLayerOn && (
          <>
            <div className="absolute top-[58%] left-[30%] bg-white/90 backdrop-blur px-2 py-0.5 rounded shadow text-[10px] font-bold text-[var(--color-brand-primary)]">
              12 min
            </div>
            <div className="absolute top-[45%] left-[35%] bg-white/90 backdrop-blur px-2 py-0.5 rounded shadow text-[10px] font-bold text-[var(--color-brand-primary)]">
              8 min
            </div>
          </>
        )}
      </div>

      {/* Selected Location Bottom Card (Floating above nav) */}
      {selectedPlace === "patan" && (
        <div className="absolute bottom-20 inset-x-4 z-40 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <Card className="w-full overflow-hidden shadow-2xl border-[var(--color-brand-secondary)]/10">
            <div className="p-4 bg-[var(--color-crowd-high)]/10 border-b border-[var(--color-crowd-high)]/20 relative">
              <button 
                onClick={() => setSelectedPlace(null)}
                className="absolute top-4 right-4 p-1 rounded-full bg-white/50 hover:bg-white text-[var(--color-brand-secondary)]/60"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="mb-3">
                <CrowdBadge status="HIGH" />
              </div>
              
              <h3 className="font-bold text-xl text-[var(--color-brand-secondary)] leading-tight mb-2">
                Patan Durbar Square
              </h3>
              
              <div className="bg-white/80 rounded-lg p-3 text-sm flex gap-3 shadow-sm border border-white">
                <Info className="w-5 h-5 text-[var(--color-crowd-high)] shrink-0 mt-0.5" />
                <p className="font-medium text-[var(--color-brand-secondary)]">
                  This place is busy now.<br/>
                  <span className="text-[var(--color-brand-secondary)]/70 font-normal">Here are better nearby experiences you can visit first.</span>
                </p>
              </div>
            </div>
            
            <CardContent className="p-4 pt-5 bg-white">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[var(--color-brand-secondary)]/50 uppercase tracking-wider">Estimated Wait</span>
                  <div className="flex items-center text-sm font-bold text-[var(--color-brand-secondary)]">
                    <Clock className="w-4 h-4 mr-1.5 text-[var(--color-crowd-high)]" />
                    40 - 50 min
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[var(--color-brand-secondary)]/50 uppercase tracking-wider">Best Time</span>
                  <div className="flex items-center text-sm font-bold text-[var(--color-brand-secondary)]">
                    After 3:00 PM
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1" variant="default">
                  See Alternatives
                </Button>
                <Button className="flex-1" variant="outline">
                  Visit Later
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <BottomNav />
    </div>
  )
}

interface MapMarkerProps {
  top: string
  left: string
  color: string
  label: string
  subtitle?: string
  icon?: React.ReactNode
  crowd: "LOW" | "MODERATE" | "HIGH" | "CRITICAL"
  onClick: () => void
  selected: boolean
  pulse?: boolean
  crowdLayerOn: boolean
}

function MapMarker({ top, left, color, label, subtitle, icon, crowd, onClick, selected, pulse, crowdLayerOn }: MapMarkerProps) {
  // If crowd layer is off, make them all brand color and remove pulse
  const markerColor = crowdLayerOn ? color : "var(--color-brand-primary)"
  const shouldPulse = crowdLayerOn && pulse

  return (
    <div 
      className={`absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-full pointer-events-auto cursor-pointer transition-all ${selected ? 'z-50 scale-110' : 'z-30 hover:scale-105'}`}
      style={{ top, left }}
      onClick={onClick}
    >
      <div className="bg-white px-2 py-1 rounded-md shadow-sm border border-[var(--color-brand-secondary)]/10 mb-1 whitespace-nowrap flex flex-col items-center">
        <span className="text-xs font-bold text-[var(--color-brand-secondary)]">{label}</span>
        {subtitle && <span className="text-[9px] font-semibold text-[var(--color-brand-primary)] uppercase tracking-wider">{subtitle}</span>}
      </div>
      
      <div className="relative flex items-center justify-center">
        {shouldPulse && (
          <div className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ backgroundColor: markerColor }} />
        )}
        <div 
          className="w-8 h-8 rounded-full border-[3px] border-white shadow-md flex items-center justify-center"
          style={{ backgroundColor: markerColor }}
        >
          {icon ? icon : <MapPin className="w-4 h-4 text-white" fill="currentColor" />}
        </div>
      </div>
      
      {/* Pin point triangle */}
      <div 
        className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px]"
        style={{ borderTopColor: 'white', marginTop: '-2px' }}
      />
    </div>
  )
}
