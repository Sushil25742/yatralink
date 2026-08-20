"use client"

import * as React from "react"
import { Leaf, Users, TreePine, Wallet, TrendingUp, Globe, ArrowUpRight } from "lucide-react"

const sdgGoals = [
  { id: 1, goal: "No Poverty", metric: "42 local families", subtext: "income supported via tourism", color: "bg-red-500", pct: 68 },
  { id: 8, goal: "Decent Work", metric: "124 jobs", subtext: "created in tourism ecosystem", color: "bg-amber-600", pct: 82 },
  { id: 11, goal: "Sustainable Cities", metric: "3 sites", subtext: "crowd-relief interventions this week", color: "bg-orange-500", pct: 55 },
  { id: 13, goal: "Climate Action", metric: "12 kg CO₂", subtext: "saved via redirection vs car travel", color: "bg-emerald-600", pct: 40 },
  { id: 15, goal: "Life on Land", metric: "2 eco-trails", subtext: "with active monitoring enabled", color: "bg-green-700", pct: 60 },
  { id: 17, goal: "Partnerships", metric: "7 NGOs", subtext: "partnered for sustainable tourism", color: "bg-blue-600", pct: 70 },
]

const recentImpacts = [
  { title: "Crowd redirected from Durbar Square", desc: "428 visitors redirected to Oku Bahal, reducing congestion by 34%", time: "2 hrs ago", type: "Crowd" },
  { title: "New artisan income generated", desc: "NPR 12,400 distributed to 6 local craft makers today", time: "4 hrs ago", type: "Economic" },
  { title: "Eco-trail booking milestone", desc: "Shivapuri eco-trail hit 100 bookings this month", time: "6 hrs ago", type: "Environment" },
  { title: "Heritage site preservation fund", desc: "NPR 24,560 contributed to Kumbheshwar restoration fund", time: "Yesterday", type: "Heritage" },
]

const typeColors: Record<string, string> = {
  Crowd: "bg-blue-100 text-blue-700",
  Economic: "bg-emerald-100 text-emerald-700",
  Environment: "bg-green-100 text-green-700",
  Heritage: "bg-amber-100 text-amber-700",
}

export default function ImpactPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-[#102A43]">Impact</h1>
        <p className="text-sm text-gray-500 font-medium mt-0.5">Tracking YatraLink&apos;s social, economic, and environmental footprint</p>
      </div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Local Income Generated", value: "NPR 2.45L", sub: "this month", icon: <Wallet className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50 border-emerald-100" },
          { label: "Jobs Supported", value: "124", sub: "+8 new this month", icon: <Users className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50 border-blue-100" },
          { label: "Eco-trail Bookings", value: "312", sub: "saving 12 kg CO₂/day", icon: <TreePine className="w-5 h-5 text-green-600" />, bg: "bg-green-50 border-green-100" },
          { label: "Visitors Redirected", value: "4,280", sub: "from over-crowded spots", icon: <Globe className="w-5 h-5 text-indigo-600" />, bg: "bg-indigo-50 border-indigo-100" },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm font-semibold text-gray-500">{m.label}</p>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${m.bg}`}>{m.icon}</div>
            </div>
            <p className="text-3xl font-black text-[#102A43]">{m.value}</p>
            <p className="text-xs font-medium text-gray-400 mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* SDG Alignment */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-[#102A43]">UN SDG Alignment</h2>
              <p className="text-xs text-gray-400 mt-0.5">Contribution to Sustainable Development Goals</p>
            </div>
            <Leaf className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="space-y-5">
            {sdgGoals.map(sdg => (
              <div key={sdg.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-white bg-[#102A43] px-1.5 py-0.5 rounded">SDG {sdg.id}</span>
                    <span className="text-sm font-semibold text-[#102A43]">{sdg.goal}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-500">{sdg.pct}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                  <div className={`h-full ${sdg.color} rounded-full transition-all`} style={{ width: `${sdg.pct}%` }} />
                </div>
                <p className="text-xs text-gray-400"><span className="font-semibold text-[#102A43]">{sdg.metric}</span> {sdg.subtext}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Impact Events */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-[#102A43]">Recent Impact Events</h2>
              <p className="text-xs text-gray-400 mt-0.5">Live updates from the field</p>
            </div>
            <button className="text-xs font-semibold text-[#086C6E] hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-4">
            {recentImpacts.map((impact, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50/50 transition-colors">
                <div className="mt-0.5">
                  <TrendingUp className="w-4 h-4 text-[#086C6E]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-[#102A43] leading-tight">{impact.title}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${typeColors[impact.type]}`}>{impact.type}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{impact.desc}</p>
                  <p className="text-[10px] text-gray-400 font-medium mt-2">{impact.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
