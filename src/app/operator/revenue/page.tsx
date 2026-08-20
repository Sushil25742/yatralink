"use client"

import * as React from "react"
import { ArrowLeft, TrendingUp, Download, CalendarCheck, Users } from "lucide-react"
import { useRouter } from "next/navigation"

const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"]
const revenueData = [12400, 18600, 22000, 19800, 26400, 31200]

const transactions = [
  { id: "TXN-4821", guest: "Sarah M.", experience: "Woodcarving Workshop", date: "Aug 20", amount: 5000, status: "Paid" },
  { id: "TXN-4820", guest: "Raj S.", experience: "Woodcarving Workshop", date: "Aug 18", amount: 2500, status: "Paid" },
  { id: "TXN-4819", guest: "Liu W.", experience: "Woodcarving Workshop", date: "Aug 15", amount: 7500, status: "Paid" },
  { id: "TXN-4818", guest: "Emma J.", experience: "Village Cooking Class", date: "Aug 12", amount: 3600, status: "Paid" },
  { id: "TXN-4817", guest: "Carlos R.", experience: "Woodcarving Workshop", date: "Aug 10", amount: 2500, status: "Pending" },
]

export default function OperatorRevenuePage() {
  const router = useRouter()
  const maxRevenue = Math.max(...revenueData)
  const totalMonth = revenueData[revenueData.length - 1]

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      <div className="bg-[#102A43] pt-14 pb-8 px-5 rounded-b-[32px] text-white shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Revenue</h1>
          </div>
          <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>

        <div className="ml-12">
          <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">This Month</p>
          <p className="text-4xl font-black mt-0.5">NPR {totalMonth.toLocaleString()}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400">+18% vs last month</span>
          </div>
        </div>
      </div>

      <main className="px-5 py-6 space-y-5 max-w-lg mx-auto">
        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CalendarCheck className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold text-gray-500">Bookings</span>
            </div>
            <p className="text-2xl font-black text-[#102A43]">28</p>
            <p className="text-[10px] text-gray-400 mt-0.5">This month</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-bold text-gray-500">Guests Hosted</span>
            </div>
            <p className="text-2xl font-black text-[#102A43]">62</p>
            <p className="text-[10px] text-gray-400 mt-0.5">This month</p>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-bold text-[#102A43] mb-5">Monthly Revenue (NPR)</h2>
          <div className="flex items-end gap-2 h-36">
            {revenueData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer">
                <div
                  className={`w-full rounded-t-lg transition-colors ${i === revenueData.length - 1 ? "bg-[#086C6E]" : "bg-[#086C6E]/20 group-hover:bg-[#086C6E]/40"}`}
                  style={{ height: `${(val / maxRevenue) * 100}%` }}
                />
                <span className="text-[9px] text-gray-400 font-semibold">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-50">
            <h2 className="text-sm font-bold text-[#102A43]">Recent Transactions</h2>
            <button className="text-xs font-semibold text-[#086C6E] hover:underline">View All</button>
          </div>
          {transactions.map((txn, i) => (
            <div key={txn.id} className={`flex items-center justify-between p-4 ${i < transactions.length - 1 ? "border-b border-gray-50" : ""} hover:bg-gray-50/50 transition-colors`}>
              <div>
                <p className="text-sm font-bold text-[#102A43]">{txn.guest}</p>
                <p className="text-[10px] text-gray-400">{txn.experience} · {txn.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-[#102A43]">+ NPR {txn.amount.toLocaleString()}</p>
                <span className={`text-[9px] font-bold uppercase tracking-wider ${txn.status === "Paid" ? "text-emerald-600" : "text-amber-500"}`}>{txn.status}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
