"use client"

import * as React from "react"
import { CalendarCheck, Search, Eye, CheckCircle2, XCircle, Clock } from "lucide-react"

const bookings = [
  { id: "BK-1042", guest: "Sarah Mitchell", experience: "Thangka Painting Workshop", date: "Aug 21, 2026", amount: "NPR 2,500", status: "Confirmed" },
  { id: "BK-1041", guest: "Raj Sharma", experience: "Heritage Walking Tour", date: "Aug 21, 2026", amount: "NPR 1,200", status: "Confirmed" },
  { id: "BK-1040", guest: "Liu Wei", experience: "Traditional Newari Feast", date: "Aug 21, 2026", amount: "NPR 1,800", status: "Pending" },
  { id: "BK-1039", guest: "Emma Johnson", experience: "Sunrise Yoga at Patan", date: "Aug 20, 2026", amount: "NPR 800", status: "Completed" },
  { id: "BK-1038", guest: "Carlos Ruiz", experience: "Singing Bowl Meditation", date: "Aug 20, 2026", amount: "NPR 1,500", status: "Completed" },
  { id: "BK-1037", guest: "Aiko Tanaka", experience: "Pottery Making Class", date: "Aug 20, 2026", amount: "NPR 2,000", status: "Cancelled" },
  { id: "BK-1036", guest: "David Kim", experience: "Heritage Walking Tour", date: "Aug 19, 2026", amount: "NPR 1,200", status: "Completed" },
  { id: "BK-1035", guest: "Fatima Al-Rashid", experience: "Thangka Painting Workshop", date: "Aug 19, 2026", amount: "NPR 2,500", status: "Confirmed" },
]

const statusStyles: Record<string, { style: string; icon: React.ReactNode }> = {
  Confirmed: { style: "bg-blue-100 text-blue-700 border-blue-200", icon: <CheckCircle2 className="w-3 h-3" /> },
  Pending: { style: "bg-amber-100 text-amber-700 border-amber-200", icon: <Clock className="w-3 h-3" /> },
  Completed: { style: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <CheckCircle2 className="w-3 h-3" /> },
  Cancelled: { style: "bg-red-100 text-red-700 border-red-200", icon: <XCircle className="w-3 h-3" /> },
}

export default function BookingsPage() {
  const [search, setSearch] = React.useState("")
  const [filter, setFilter] = React.useState("All")
  const statusFilters = ["All", "Confirmed", "Pending", "Completed", "Cancelled"]

  const filtered = bookings.filter(b =>
    (filter === "All" || b.status === filter) &&
    (b.guest.toLowerCase().includes(search.toLowerCase()) || b.experience.toLowerCase().includes(search.toLowerCase()))
  )

  const totalRevenue = bookings.filter(b => b.status !== "Cancelled").reduce((sum, b) => {
    return sum + parseInt(b.amount.replace(/[^0-9]/g, ""))
  }, 0)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-[#102A43]">Bookings</h1>
        <p className="text-sm text-gray-500 font-medium mt-0.5">Track and manage all experience bookings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Bookings", value: bookings.length.toString() },
          { label: "Confirmed", value: bookings.filter(b => b.status === "Confirmed").length.toString() },
          { label: "Pending Review", value: bookings.filter(b => b.status === "Pending").length.toString() },
          { label: "Total Revenue", value: `NPR ${totalRevenue.toLocaleString()}` },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-[#102A43] truncate">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters Row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search guest or experience..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#086C6E]/20 focus:border-[#086C6E]" />
        </div>
        <div className="flex items-center gap-2">
          {statusFilters.map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all ${filter === s ? "bg-[#086C6E] text-white border-[#086C6E]" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Booking ID</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Guest</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Experience</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Date</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Amount</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(booking => (
              <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-5 py-4 font-mono text-xs font-bold text-[#086C6E]">{booking.id}</td>
                <td className="px-5 py-4 font-semibold text-[#102A43]">{booking.guest}</td>
                <td className="px-5 py-4 text-gray-600">{booking.experience}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <CalendarCheck className="w-3.5 h-3.5" />{booking.date}
                  </div>
                </td>
                <td className="px-5 py-4 font-semibold text-[#102A43]">{booking.amount}</td>
                <td className="px-5 py-4">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border flex items-center gap-1 w-fit ${statusStyles[booking.status].style}`}>
                    {statusStyles[booking.status].icon}{booking.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#086C6E]">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
