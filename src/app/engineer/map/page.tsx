"use client"

import React, { useState } from "react"
import { ArrowLeft, Save, Map as MapIcon, Compass } from "lucide-react"
import { useRouter } from "next/navigation"

const specialPlaces = [
  { id: 1, name: "Golden Temple", type: "Temple", crowdCap: 50 },
  { id: 2, name: "Krishna Mandir", type: "Monument", crowdCap: 150 },
  { id: 3, name: "Patan Museum", type: "Museum", crowdCap: 200 },
]

export default function RouteMappingPage() {
  const router = useRouter()
  const [selectedPlace, setSelectedPlace] = useState(specialPlaces[0])
  const [routeConfig, setRouteConfig] = useState({
    approachRoute: "North Gate via Mangal Bazaar",
    accessNotes: "Use secondary entrance during peak hours (10 AM - 2 PM)",
    specialAccessMode: false
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      <div className="bg-[#1a2b4b] pt-14 pb-8 px-5 rounded-b-[32px] text-white shadow-md">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Route Mapping</h1>
        </div>
        <p className="text-sm text-white/60 ml-12">Configure custom routing for special locations</p>
      </div>

      <main className="px-5 py-6 space-y-6 max-w-lg mx-auto">
        
        {/* Selector */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#1a2b4b]">Select Location</label>
          <div className="relative">
            <select 
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3.5 pr-10 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a2b4b]/20"
              value={selectedPlace.id}
              onChange={(e) => {
                const place = specialPlaces.find(p => p.id === parseInt(e.target.value))
                if (place) setSelectedPlace(place)
              }}
            >
              {specialPlaces.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
              ))}
            </select>
            <MapIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Configuration Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-5">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div>
              <h2 className="font-bold text-[#1a2b4b] text-lg">{selectedPlace.name}</h2>
              <p className="text-xs text-gray-500">Max Capacity: {selectedPlace.crowdCap} visitors</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${routeConfig.specialAccessMode ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {routeConfig.specialAccessMode ? 'Special Mode' : 'Normal Flow'}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Preferred Approach Route</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={routeConfig.approachRoute}
                  onChange={e => setRouteConfig(s => ({...s, approachRoute: e.target.value}))}
                  className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1a2b4b]/20 transition-all"
                />
                <Compass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Access Notes (Shown to Users)</label>
              <textarea 
                value={routeConfig.accessNotes}
                onChange={e => setRouteConfig(s => ({...s, accessNotes: e.target.value}))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a2b4b]/20 transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-sm font-bold text-[#1a2b4b]">Special Access Mode</p>
                <p className="text-[11px] text-gray-500">Enable forced diversions for festivals/repairs</p>
              </div>
              <button
                onClick={() => setRouteConfig(s => ({ ...s, specialAccessMode: !s.specialAccessMode }))}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${routeConfig.specialAccessMode ? "bg-amber-500" : "bg-gray-200"}`}
              >
                <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 m-0.5 ${routeConfig.specialAccessMode ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave} 
          className={`w-full py-3.5 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm ${saved ? "bg-emerald-500 text-white" : "bg-[#1a2b4b] text-white hover:bg-[#1a2b4b]/90"}`}
        >
          <Save className="w-4 h-4" />
          {saved ? "Configuration Saved!" : "Save Configuration"}
        </button>

      </main>
    </div>
  )
}
