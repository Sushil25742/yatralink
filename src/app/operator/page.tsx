"use client"

import * as React from "react"
import { 
  Users, 
  Wallet, 
  Star, 
  Eye, 
  CalendarCheck, 
  Settings,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Store
} from "lucide-react"

type AvailabilityStatus = "Available" | "Full" | "Closed"

export default function OperatorDashboardPage() {
  const [status, setStatus] = React.useState<AvailabilityStatus>("Available")

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      
      {/* Header */}
      <div className="bg-[#102A43] pt-14 pb-8 px-5 rounded-b-[32px] text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Traditional Woodcarving Workshop</h1>
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm font-medium text-white/70">Welcome back! Here is your summary for today.</p>
        </div>
      </div>

      <main className="px-5 py-6 space-y-6 -mt-4 relative z-20 max-w-lg mx-auto">
        
        {/* Availability Control */}
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">Current Availability</h2>
          
          <div className="grid grid-cols-3 gap-2">
            <StatusButton 
              currentStatus={status} 
              targetStatus="Available" 
              icon={<CheckCircle2 className="w-4 h-4 mb-1" />}
              onClick={() => setStatus("Available")}
              activeColor="bg-emerald-500 text-white border-emerald-600"
              inactiveColor="bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
            />
            <StatusButton 
              currentStatus={status} 
              targetStatus="Full" 
              icon={<Users className="w-4 h-4 mb-1" />}
              onClick={() => setStatus("Full")}
              activeColor="bg-amber-500 text-white border-amber-600"
              inactiveColor="bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
            />
            <StatusButton 
              currentStatus={status} 
              targetStatus="Closed" 
              icon={<XCircle className="w-4 h-4 mb-1" />}
              onClick={() => setStatus("Closed")}
              activeColor="bg-red-500 text-white border-red-600"
              inactiveColor="bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
            />
          </div>
          <p className="text-[10px] font-semibold text-gray-400 mt-3 text-center uppercase tracking-wide">
            Updates sync to YatraLink recommendations
          </p>
        </div>

        {/* Dashboard Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard 
            title="Bookings Today" 
            value="7" 
            icon={<CalendarCheck className="w-5 h-5 text-blue-500" />} 
          />
          <MetricCard 
            title="Revenue Today" 
            value="NPR 5,600" 
            icon={<Wallet className="w-5 h-5 text-emerald-500" />} 
          />
          <MetricCard 
            title="Upcoming Guests" 
            value="12" 
            icon={<Users className="w-5 h-5 text-indigo-500" />} 
          />
          <MetricCard 
            title="Profile Views" 
            value="248" 
            icon={<Eye className="w-5 h-5 text-purple-500" />} 
          />
        </div>

        {/* Rating Banner */}
        <div className="bg-[#D6A84B]/10 rounded-2xl p-4 flex items-center justify-between border border-[#D6A84B]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D6A84B] flex items-center justify-center text-white">
              <Star className="w-5 h-5 fill-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900/60 uppercase tracking-wide">Current Rating</p>
              <p className="text-xl font-bold text-amber-900">4.8 <span className="text-sm font-semibold opacity-60">/ 5.0</span></p>
            </div>
          </div>
          <button className="text-amber-700 hover:text-amber-900 font-semibold text-sm">Read Reviews</button>
        </div>

        {/* Management Menu */}
        <div>
          <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide px-1">Management</h2>
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
            
            <MenuRow icon={<CalendarCheck className="w-5 h-5 text-gray-600" />} title="Upcoming Bookings" />
            <MenuRow icon={<Store className="w-5 h-5 text-gray-600" />} title="Experience Listing" />
            <MenuRow icon={<Wallet className="w-5 h-5 text-gray-600" />} title="Pricing" />
            <MenuRow icon={<Star className="w-5 h-5 text-gray-600" />} title="Reviews" />
            <MenuRow icon={<TrendingUp className="w-5 h-5 text-gray-600" />} title="Revenue" hideBorder />
            
          </div>
        </div>

      </main>
    </div>
  )
}

function StatusButton({ currentStatus, targetStatus, icon, onClick, activeColor, inactiveColor }: any) {
  const isActive = currentStatus === targetStatus
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border-2 transition-all font-bold text-xs ${
        isActive ? activeColor : inactiveColor
      }`}
    >
      {icon}
      {targetStatus}
    </button>
  )
}

function MetricCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 flex flex-col justify-between h-28">
      <div className="flex items-start justify-between">
        <span className="text-xs font-bold text-gray-500 leading-tight w-20">{title}</span>
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
          {icon}
        </div>
      </div>
      <span className="text-2xl font-black text-[#102A43] tracking-tight">{value}</span>
    </div>
  )
}

function MenuRow({ icon, title, hideBorder = false }: { icon: React.ReactNode, title: string, hideBorder?: boolean }) {
  return (
    <button className={`w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors group ${!hideBorder ? 'border-b border-gray-100' : ''}`}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#086C6E]/10 transition-colors">
          {icon}
        </div>
        <span className="font-semibold text-gray-800">{title}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-300" />
    </button>
  )
}

// Ensure TrendingUp is available, import it above. (Added it to the lucide-react imports)
