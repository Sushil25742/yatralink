"use client"

import * as React from "react"
import { TrendingUp, TrendingDown, Users, Wallet, Star, ArrowUpRight } from "lucide-react"

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]
const visitorData = [1200, 1800, 2400, 2100, 3200, 4100, 3800, 4782]
const revenueData = [48000, 72000, 95000, 84000, 128000, 164000, 152000, 245600]

const topPlaces = [
  { name: "Patan Durbar Square", visitors: 1240, growth: "+14%" },
  { name: "Golden Temple", visitors: 890, growth: "+8%" },
  { name: "Mangal Bazaar", visitors: 650, growth: "+22%" },
  { name: "Kumbheshwar Temple", visitors: 320, growth: "-3%" },
]

export default function AnalyticsPage() {
  const maxVisitors = Math.max(...visitorData)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-[#102A43]">Analytics</h1>
        <p className="text-sm text-gray-500 font-medium mt-0.5">Destination performance insights and trends</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Visitors This Month", value: "4,782", delta: "+12%", up: true, icon: <Users className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50 border-blue-100" },
          { label: "Revenue Generated", value: "NPR 2.45L", delta: "+18%", up: true, icon: <Wallet className="w-5 h-5 text-indigo-600" />, bg: "bg-indigo-50 border-indigo-100" },
          { label: "Avg. Experience Rating", value: "4.7 ★", delta: "+0.2", up: true, icon: <Star className="w-5 h-5 text-amber-500" />, bg: "bg-amber-50 border-amber-100" },
          { label: "Repeat Visitors", value: "38%", delta: "-2%", up: false, icon: <TrendingUp className="w-5 h-5 text-[#086C6E]" />, bg: "bg-[#086C6E]/5 border-[#086C6E]/20" },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm font-semibold text-gray-500">{kpi.label}</p>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${kpi.bg}`}>{kpi.icon}</div>
            </div>
            <p className="text-3xl font-black text-[#102A43]">{kpi.value}</p>
            <div className={`flex items-center gap-1 mt-1 text-xs font-bold ${kpi.up ? "text-emerald-600" : "text-red-500"}`}>
              {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {kpi.delta} vs last month
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visitor Trend Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-[#102A43]">Monthly Visitor Trend</h2>
            <span className="text-xs font-semibold text-[#086C6E] bg-[#086C6E]/10 px-3 py-1 rounded-full">2026</span>
          </div>
          <div className="flex items-end gap-3 h-48">
            {visitorData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2 h-full group cursor-pointer">
                <div className="text-[10px] text-gray-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">{val.toLocaleString()}</div>
                <div 
                  className="w-full rounded-t-lg bg-[#086C6E]/20 group-hover:bg-[#086C6E]/40 transition-colors relative overflow-hidden"
                  style={{ height: `${(val / maxVisitors) * 100}%` }}
                >
                  <div className="absolute bottom-0 w-full bg-[#086C6E] rounded-t-lg" style={{ height: "70%" }} />
                </div>
                <span className="text-[10px] text-gray-400 font-medium">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Places */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-[#102A43]">Top Places Today</h2>
            <button className="text-xs font-semibold text-[#086C6E] hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-4">
            {topPlaces.map((place, i) => (
              <div key={place.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-gray-300 w-5">#{i + 1}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#102A43]">{place.name}</p>
                    <p className="text-xs text-gray-400">{place.visitors.toLocaleString()} visitors</p>
                  </div>
                </div>
                <span className={`text-xs font-bold ${place.growth.startsWith("+") ? "text-emerald-600" : "text-red-500"}`}>
                  {place.growth}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue by Category */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-base font-bold text-[#102A43] mb-6">Revenue by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { label: "Experiences", pct: 42, amount: "NPR 1,03,152", color: "bg-[#086C6E]" },
            { label: "Crafts & Souvenirs", pct: 28, amount: "NPR 68,768", color: "bg-[#D6A84B]" },
            { label: "Food & Dining", pct: 21, amount: "NPR 51,576", color: "bg-emerald-600" },
            { label: "Guided Tours", pct: 9, amount: "NPR 22,104", color: "bg-indigo-500" },
          ].map(cat => (
            <div key={cat.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-[#102A43]">{cat.label}</span>
                <span className="font-bold text-gray-500">{cat.pct}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.pct}%` }} />
              </div>
              <p className="text-xs text-gray-400 font-medium">{cat.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
