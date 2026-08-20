"use client"

import React from "react"
import { ArrowLeft, Search, SlidersHorizontal, Settings2, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

const places = [
  { id: 1, name: "Golden Temple", type: "Temple", status: "Active", routeOverride: true, limit: 50 },
  { id: 2, name: "Krishna Mandir", type: "Monument", status: "Active", routeOverride: false, limit: 150 },
  { id: 3, name: "Patan Museum", type: "Museum", status: "Maintenance", routeOverride: true, limit: 200 },
  { id: 4, name: "Sundari Chowk", type: "Courtyard", status: "Active", routeOverride: false, limit: 80 },
  { id: 5, name: "Mul Chowk", type: "Courtyard", status: "Active", routeOverride: false, limit: 100 },
]

export default function ManagedPlacesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      <div className="bg-[#1a2b4b] pt-14 pb-8 px-5 rounded-b-[32px] text-white shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Managed Places</h1>
          </div>
          <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mt-2">
          <input 
            type="text" 
            placeholder="Search places..." 
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 transition-all"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <button className="absolute right-3.5 top-1/2 -translate-y-1/2">
            <SlidersHorizontal className="w-4 h-4 text-white/70 hover:text-white" />
          </button>
        </div>
      </div>

      <main className="px-5 py-6 space-y-4 max-w-lg mx-auto">
        
        {places.map((place) => (
          <div key={place.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-[#1a2b4b] text-base">{place.name}</h3>
                <p className="text-xs font-semibold text-gray-400 mt-0.5">{place.type}</p>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                place.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
              }`}>
                {place.status}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-1">
              <div className="flex gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">Capacity</p>
                  <p className="text-sm font-semibold text-gray-800">{place.limit}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">Route Override</p>
                  <p className={`text-sm font-semibold ${place.routeOverride ? 'text-amber-600' : 'text-gray-400'}`}>
                    {place.routeOverride ? 'Active' : 'None'}
                  </p>
                </div>
              </div>
              
              <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
                <Settings2 className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        ))}

      </main>
    </div>
  )
}
