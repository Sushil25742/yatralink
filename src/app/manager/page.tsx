"use client"

import * as React from "react"
import { 
  Users, 
  CalendarCheck, 
  Wallet, 
  AlertTriangle, 
  ArrowRightLeft, 
  Store,
  TrendingUp,
  MapPin
} from "lucide-react"

export default function ManagerDashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#102A43] mb-1">Destination Overview</h1>
        <p className="text-sm text-gray-500 font-medium">Real-time insights for Lalitpur Heritage Zone</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard 
          title="Visitors Today" 
          value="4,782" 
          trend="+12% vs last week"
          icon={<Users className="w-5 h-5 text-blue-600" />} 
          color="bg-blue-50 border-blue-100"
        />
        <KpiCard 
          title="Bookings" 
          value="312" 
          trend="+5% vs last week"
          icon={<CalendarCheck className="w-5 h-5 text-emerald-600" />} 
          color="bg-emerald-50 border-emerald-100"
        />
        <KpiCard 
          title="Local Revenue Generated" 
          value="NPR 245,600" 
          trend="+18% vs last week"
          icon={<Wallet className="w-5 h-5 text-indigo-600" />} 
          color="bg-indigo-50 border-indigo-100"
        />
        <KpiCard 
          title="Active Crowd Alerts" 
          value="3" 
          trend="2 high, 1 moderate"
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />} 
          color="bg-amber-50 border-amber-100"
        />
        <KpiCard 
          title="Visitors Redirected" 
          value="428" 
          trend="Currently exploring alternatives"
          icon={<ArrowRightLeft className="w-5 h-5 text-[#086C6E]" />} 
          color="bg-[#086C6E]/5 border-[#086C6E]/20"
        />
        <KpiCard 
          title="Verified Operators" 
          value="42" 
          trend="+2 pending approval"
          icon={<Store className="w-5 h-5 text-purple-600" />} 
          color="bg-purple-50 border-purple-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Live Crowd Monitor */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-[#102A43]">Live Crowd Monitor</h2>
            <button className="text-xs font-semibold text-[#086C6E] hover:underline">View Map</button>
          </div>
          
          <div className="space-y-4 flex-1">
            <CrowdRow name="Patan Durbar Square" status="HIGH" />
            <CrowdRow name="Golden Temple" status="MODERATE" />
            <CrowdRow name="Mangal Bazaar" status="LOW" />
          </div>
        </div>

        {/* Visitor Trend Today */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-[#102A43]">Visitor Trend Today</h2>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#086C6E]" /> Actual</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full border border-gray-300" /> Expected</span>
            </div>
          </div>
          
          {/* Mock Line Graph */}
          <div className="flex-1 min-h-[200px] flex items-end gap-2 pt-8 relative">
            {/* Y axis lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="w-full h-px bg-gray-100" />
              ))}
            </div>
            
            {/* Bars */}
            {[40, 55, 80, 120, 150, 140, 110, 90, 85, 70, 40, 20].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end items-center h-full relative z-10 group cursor-pointer">
                <div 
                  className="w-full max-w-[24px] bg-[#086C6E]/20 group-hover:bg-[#086C6E]/40 rounded-t-sm transition-all relative"
                  style={{ height: `${height}px` }}
                >
                  <div 
                    className="absolute bottom-0 w-full bg-[#086C6E] rounded-t-sm transition-all"
                    style={{ height: `${height * 0.8}px` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 mt-2 font-medium">
                  {i + 8}h
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Local Economic Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-[#102A43]">Local Economic Activity</h2>
          <button className="text-xs font-semibold text-gray-500 flex items-center gap-1 hover:text-[#102A43] transition-colors">
            Detailed Report <TrendingUp className="w-3 h-3" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ActivityCard label="Experience bookings" value="42%" amount="NPR 103,152" color="bg-[#086C6E]" />
          <ActivityCard label="Craft spending" value="28%" amount="NPR 68,768" color="bg-[#D6A84B]" />
          <ActivityCard label="Local food bookings" value="21%" amount="NPR 51,576" color="bg-emerald-600" />
          <ActivityCard label="Guides" value="9%" amount="NPR 22,104" color="bg-indigo-500" />
        </div>
        
        {/* Progress Bar representation */}
        <div className="w-full h-3 rounded-full overflow-hidden flex mt-6">
          <div className="h-full bg-[#086C6E]" style={{ width: '42%' }} />
          <div className="h-full bg-[#D6A84B]" style={{ width: '28%' }} />
          <div className="h-full bg-emerald-600" style={{ width: '21%' }} />
          <div className="h-full bg-indigo-500" style={{ width: '9%' }} />
        </div>
      </div>

    </div>
  )
}

function KpiCard({ title, value, trend, icon, color }: { title: string, value: string, trend: string, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${color}`}>
          {icon}
        </div>
      </div>
      <div>
        <span className="text-3xl font-black text-[#102A43] tracking-tight">{value}</span>
        <p className="text-xs font-medium text-gray-500 mt-1">{trend}</p>
      </div>
    </div>
  )
}

function CrowdRow({ name, status }: { name: string, status: "HIGH" | "MODERATE" | "LOW" }) {
  const colors = {
    HIGH: "bg-red-100 text-red-700 border-red-200",
    MODERATE: "bg-amber-100 text-amber-700 border-amber-200",
    LOW: "bg-emerald-100 text-emerald-700 border-emerald-200"
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <MapPin className="w-4 h-4 text-gray-400" />
        <span className="font-semibold text-sm text-[#102A43]">{name}</span>
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${colors[status]}`}>
        {status}
      </span>
    </div>
  )
}

function ActivityCard({ label, value, amount, color }: { label: string, value: string, amount: string, color: string }) {
  return (
    <div className="flex flex-col border border-gray-100 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-end justify-between mt-auto">
        <span className="text-xl font-bold text-[#102A43]">{value}</span>
        <span className="text-xs font-semibold text-gray-400">{amount}</span>
      </div>
    </div>
  )
}
