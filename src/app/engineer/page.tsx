"use client"

import * as React from "react"
import { Map, MapPin, ShieldAlert, Navigation, Settings, ChevronRight, Activity, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export default function EngineerDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (user && user.role !== "engineer") {
      router.push("/")
    }
  }, [user, router])

  if (!user || user.role !== "engineer") return null

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      
      {/* Header */}
      <div className="bg-[#1a2b4b] pt-14 pb-8 px-5 rounded-b-[32px] text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10 flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold">Engineer Panel</h1>
            <p className="text-sm text-white/70">Welcome back, {user.name}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#086C6E] to-[#1a2b4b] border-2 border-white/20 flex items-center justify-center font-bold text-xl shadow-lg">
            {user.avatar}
          </div>
        </div>
      </div>

      <main className="px-5 py-6 space-y-5 -mt-4 relative z-20 max-w-lg mx-auto">
        
        {/* System Status Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-900">Routing System Healthy</p>
            <p className="text-xs text-emerald-700/80">All crowd diversion nodes are functioning normally.</p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Navigation className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold text-gray-500">Active Routes</span>
            </div>
            <p className="text-2xl font-black text-[#1a2b4b]">14</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-gray-500">Diversions</span>
            </div>
            <p className="text-2xl font-black text-[#1a2b4b]">3</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div>
          <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide px-1">Route Controls</h2>
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
            <Link href="/engineer/map" className="w-full flex items-center justify-between p-4 border-b border-gray-100 active:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#1a2b4b]/10 transition-colors">
                  <Map className="w-5 h-5 text-[#1a2b4b]" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Route Mapping</p>
                  <p className="text-[10px] text-gray-400">Configure access routes for special places</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </Link>

            <Link href="/engineer/places" className="w-full flex items-center justify-between p-4 border-b border-gray-100 active:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#1a2b4b]/10 transition-colors">
                  <MapPin className="w-5 h-5 text-[#1a2b4b]" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Managed Places</p>
                  <p className="text-[10px] text-gray-400">View and edit capacities and rules</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </Link>

            <Link href="/engineer/settings" className="w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#1a2b4b]/10 transition-colors">
                  <Settings className="w-5 h-5 text-[#1a2b4b]" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">System Settings</p>
                  <p className="text-[10px] text-gray-400">Profile and notification preferences</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </Link>
          </div>
        </div>

      </main>
    </div>
  )
}
