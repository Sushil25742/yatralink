"use client"

import * as React from "react"
import { 
  Users, 
  MapPin, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Activity, 
  Settings2,
  ChevronDown
} from "lucide-react"
import { useApp } from "@/context/AppContext"

export default function CrowdMonitorPage() {
  const { state, setCrowdStatus } = useApp()
  const simulatorStatus = state.crowdPatanDurbar

  return (
    <div className="flex h-screen overflow-hidden">
      
      {/* Left Panel: Map */}
      <div className="flex-1 relative bg-blue-50 border-r border-gray-200">
        
        {/* Mock Map Image / Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-multiply"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1600&auto=format&fit=crop)' }}
        />

        {/* Top Controls on Map */}
        <div className="absolute top-6 left-6 right-6 flex items-start justify-between pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200 pointer-events-auto max-w-sm">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-[var(--color-brand-secondary)]">Patan Heritage Zone</h1>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase tracking-wider">Demo Mode</span>
            </div>
            <p className="text-sm font-medium text-gray-500">Simulated Crowd Topology</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-gray-200 pointer-events-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Simulator Active</span>
          </div>
        </div>

        {/* Map Markers */}
        <MapMarker 
          top="35%" 
          left="40%" 
          name="Patan Durbar Square" 
          status={simulatorStatus} // Connect Durbar Square to simulator
          score={simulatorStatus === "HIGH" ? 78 : simulatorStatus === "CRITICAL" ? 95 : simulatorStatus === "MODERATE" ? 52 : 28} 
        />
        
        <MapMarker 
          top="65%" 
          left="55%" 
          name="Golden Temple" 
          status="MODERATE" 
          score={52} 
        />
        
        <MapMarker 
          top="50%" 
          left="70%" 
          name="Mangal Bazaar" 
          status="LOW" 
          score={28} 
        />

      </div>

      {/* Right Panel: Data & Controls */}
      <div className="w-[450px] bg-white overflow-y-auto flex flex-col shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)] relative z-10">
        
        {/* Detail View */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-[#102A43]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#102A43]">Patan Durbar Square</h2>
              <p className="text-sm font-medium text-gray-500">Selected Zone</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <StatBox 
              label="Crowd Score" 
              value={simulatorStatus === "HIGH" ? "78 / 100" : simulatorStatus === "CRITICAL" ? "95 / 100" : simulatorStatus === "MODERATE" ? "52 / 100" : "28 / 100"} 
              icon={<Users className="w-4 h-4 text-blue-500" />} 
            />
            <StatBox 
              label="Trend" 
              value={simulatorStatus === "LOW" ? "Decreasing" : "Increasing"} 
              icon={<TrendingUp className="w-4 h-4 text-emerald-500" />} 
            />
            <StatBox 
              label="Estimated Wait" 
              value={simulatorStatus === "HIGH" ? "40–50 min" : simulatorStatus === "CRITICAL" ? "60+ min" : simulatorStatus === "MODERATE" ? "20–30 min" : "0–5 min"} 
              icon={<Clock className="w-4 h-4 text-amber-500" />} 
            />
            <StatBox 
              label="Data Confidence" 
              value="82%" 
              icon={<ShieldCheck className="w-4 h-4 text-indigo-500" />} 
            />
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Active Signals</h3>
            <div className="flex flex-wrap gap-2">
              <SignalBadge label="Prototype sensor" active />
              <SignalBadge label="Historical pattern" active />
              <SignalBadge label="App signals" active />
              <SignalBadge label="Operator status" active={false} />
            </div>
          </div>
        </div>

        {/* Hackathon Simulator Control */}
        <div className="p-6 bg-gray-50 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Settings2 className="w-5 h-5 text-[#102A43]" />
            <h2 className="text-lg font-bold text-[#102A43]">Crowd Simulator</h2>
          </div>
          <div className="bg-amber-100/50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md inline-block mb-6">
            Demo crowd simulation
          </div>

          <p className="text-sm text-gray-600 mb-4 font-medium leading-relaxed">
            Use this panel to manually override the crowd status for Patan Durbar Square. Changing this value will push simulated alerts to the traveler prototype.
          </p>

          <div className="space-y-2">
            <SimulatorButton 
              label="LOW" 
              description="Score: 0-30. Flowing easily."
              active={simulatorStatus === "LOW"} 
              onClick={() => setCrowdStatus("LOW")}
              colorClass="bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
              activeClass="ring-2 ring-emerald-500 border-transparent shadow-sm"
            />
            <SimulatorButton 
              label="MODERATE" 
              description="Score: 31-60. Getting busy."
              active={simulatorStatus === "MODERATE"} 
              onClick={() => setCrowdStatus("MODERATE")}
              colorClass="bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
              activeClass="ring-2 ring-amber-500 border-transparent shadow-sm"
            />
            <SimulatorButton 
              label="HIGH" 
              description="Score: 61-90. Crowded. Trigger alerts."
              active={simulatorStatus === "HIGH"} 
              onClick={() => setCrowdStatus("HIGH")}
              colorClass="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
              activeClass="ring-2 ring-red-500 border-transparent shadow-sm"
            />
            <SimulatorButton 
              label="CRITICAL" 
              description="Score: 91-100. Over capacity."
              active={simulatorStatus === "CRITICAL"} 
              onClick={() => setCrowdStatus("CRITICAL")}
              colorClass="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
              activeClass="ring-2 ring-purple-500 border-transparent shadow-sm"
            />
          </div>

        </div>

      </div>

    </div>
  )
}

function StatBox({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-start gap-3">
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div>
        <div className="text-xs font-semibold text-gray-500 mb-0.5">{label}</div>
        <div className="text-sm font-bold text-[#102A43]">{value}</div>
      </div>
    </div>
  )
}

function SignalBadge({ label, active }: { label: string, active: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-semibold transition-colors ${
      active 
        ? 'bg-blue-50 border-blue-200 text-blue-700' 
        : 'bg-gray-50 border-gray-200 text-gray-400 line-through opacity-70'
    }`}>
      <Activity className="w-3 h-3" />
      {label}
    </div>
  )
}

function SimulatorButton({ label, description, active, onClick, colorClass, activeClass }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex flex-col items-start p-4 rounded-xl border transition-all text-left ${colorClass} ${active ? activeClass : ''}`}
    >
      <span className="font-bold tracking-wide">{label}</span>
      <span className="text-xs font-medium opacity-80 mt-1">{description}</span>
    </button>
  )
}

function MapMarker({ top, left, name, status, score }: { top: string, left: string, name: string, status: string, score: number }) {
  const colors: Record<string, string> = {
    HIGH: "bg-red-500 shadow-red-500/50",
    CRITICAL: "bg-purple-500 shadow-purple-500/50",
    MODERATE: "bg-amber-500 shadow-amber-500/50",
    LOW: "bg-emerald-500 shadow-emerald-500/50"
  }

  const bgColors: Record<string, string> = {
    HIGH: "bg-red-50 border-red-200 text-red-800",
    CRITICAL: "bg-purple-50 border-purple-200 text-purple-800",
    MODERATE: "bg-amber-50 border-amber-200 text-amber-800",
    LOW: "bg-emerald-50 border-emerald-200 text-emerald-800"
  }

  return (
    <div className="absolute flex flex-col items-center pointer-events-auto group cursor-pointer" style={{ top, left, transform: 'translate(-50%, -50%)' }}>
      
      {/* Tooltip Card */}
      <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-200 mb-2 flex flex-col items-center gap-1 min-w-[140px] transition-transform group-hover:-translate-y-1">
        <span className="text-xs font-bold text-[#102A43] text-center">{name}</span>
        <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${bgColors[status]}`}>
          {status} ({score})
        </div>
      </div>
      
      {/* Map Pin Point */}
      <div className="relative flex justify-center">
        <div className={`absolute w-12 h-12 rounded-full animate-ping opacity-20 ${colors[status].split(' ')[0]}`} />
        <div className={`w-5 h-5 rounded-full border-2 border-white shadow-lg relative z-10 ${colors[status]}`} />
        <div className="w-1 h-8 bg-gradient-to-b from-gray-800/20 to-transparent absolute top-4 -z-10" />
      </div>

    </div>
  )
}
