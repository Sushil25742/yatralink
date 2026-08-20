"use client"

import * as React from "react"
import { Store, Star, Phone, MapPin, CheckCircle2, Clock, XCircle, Plus, Search, Eye } from "lucide-react"

const operators = [
  { id: 1, name: "Hari Arts Studio", type: "Craft & Art", location: "Patan Durbar Sq.", phone: "+977-9801234567", rating: 4.9, experiences: 3, revenue: "NPR 48,500", status: "Verified" },
  { id: 2, name: "Momo House Patan", type: "Food & Dining", location: "Mangal Bazaar", phone: "+977-9851234567", rating: 4.8, experiences: 2, revenue: "NPR 32,400", status: "Verified" },
  { id: 3, name: "Lalitpur Guides Co.", type: "Tour & Travel", location: "Lalitpur", phone: "+977-9841234567", rating: 4.7, experiences: 5, revenue: "NPR 74,400", status: "Verified" },
  { id: 4, name: "Bhaktapur Crafts", type: "Craft & Art", location: "Bhaktapur", phone: "+977-9861234567", rating: 4.6, experiences: 1, revenue: "NPR 12,000", status: "Pending" },
  { id: 5, name: "Nepal Wellness Hub", type: "Wellness", location: "Patan", phone: "+977-9811234567", rating: 4.5, experiences: 2, revenue: "NPR 26,400", status: "Verified" },
  { id: 6, name: "Himalayan Sound Healing", type: "Wellness", location: "Lalitpur", phone: "+977-9821234567", rating: 4.9, experiences: 2, revenue: "NPR 33,000", status: "Pending" },
  { id: 7, name: "Mountain Trekkers Nepal", type: "Tour & Travel", location: "Kathmandu", phone: "+977-9831234567", rating: 3.2, experiences: 0, revenue: "NPR 0", status: "Suspended" },
]

const statusStyles: Record<string, { style: string; icon: React.ReactNode }> = {
  Verified: { style: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <CheckCircle2 className="w-3 h-3" /> },
  Pending: { style: "bg-amber-100 text-amber-700 border-amber-200", icon: <Clock className="w-3 h-3" /> },
  Suspended: { style: "bg-red-100 text-red-700 border-red-200", icon: <XCircle className="w-3 h-3" /> },
}

export default function OperatorsPage() {
  const [search, setSearch] = React.useState("")
  const filtered = operators.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.type.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#102A43]">Local Operators</h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">Manage and verify local experience providers</p>
        </div>
        <button className="flex items-center gap-2 bg-[#086C6E] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#086C6E]/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Operator
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Operators</p>
          <p className="text-3xl font-black text-[#102A43]">{operators.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Verified</p>
          <p className="text-3xl font-black text-emerald-600">{operators.filter(o => o.status === "Verified").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Pending Approval</p>
          <p className="text-3xl font-black text-amber-500">{operators.filter(o => o.status === "Pending").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Revenue</p>
          <p className="text-2xl font-black text-[#102A43]">NPR 2.26L</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search operators..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#086C6E]/20 focus:border-[#086C6E]" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Operator</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Location</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Contact</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Rating</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Experiences</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Revenue</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(op => (
              <tr key={op.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#086C6E]/10 flex items-center justify-center shrink-0">
                      <Store className="w-4 h-4 text-[#086C6E]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#102A43]">{op.name}</p>
                      <p className="text-xs text-gray-400">{op.type}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <MapPin className="w-3.5 h-3.5" />{op.location}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Phone className="w-3.5 h-3.5" />{op.phone}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-[#102A43]">{op.rating}</span>
                  </div>
                </td>
                <td className="px-5 py-4 font-semibold text-[#102A43]">{op.experiences}</td>
                <td className="px-5 py-4 font-semibold text-[#102A43]">{op.revenue}</td>
                <td className="px-5 py-4">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border flex items-center gap-1 w-fit ${statusStyles[op.status].style}`}>
                    {statusStyles[op.status].icon}{op.status}
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
