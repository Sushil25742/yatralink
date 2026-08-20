"use client"

import * as React from "react"
import { Star, Clock, Users, Plus, Search, Tag, Eye, Pencil } from "lucide-react"

const experiences = [
  { id: 1, title: "Thangka Painting Workshop", operator: "Hari Arts Studio", category: "Craft", duration: "3 hrs", price: "NPR 2,500", rating: 4.9, booked: 28, status: "Active" },
  { id: 2, title: "Traditional Newari Feast", operator: "Momo House Patan", category: "Food", duration: "2 hrs", price: "NPR 1,800", rating: 4.8, booked: 45, status: "Active" },
  { id: 3, title: "Heritage Walking Tour", operator: "Lalitpur Guides Co.", category: "Tour", duration: "4 hrs", price: "NPR 1,200", rating: 4.7, booked: 62, status: "Active" },
  { id: 4, title: "Pottery Making Class", operator: "Bhaktapur Crafts", category: "Craft", duration: "2.5 hrs", price: "NPR 2,000", rating: 4.6, booked: 18, status: "Pending" },
  { id: 5, title: "Sunrise Yoga at Patan", operator: "Nepal Wellness Hub", category: "Wellness", duration: "1.5 hrs", price: "NPR 800", rating: 4.5, booked: 33, status: "Active" },
  { id: 6, title: "Singing Bowl Meditation", operator: "Himalayan Sound Healing", category: "Wellness", duration: "1 hr", price: "NPR 1,500", rating: 4.9, booked: 22, status: "Active" },
]

const categoryColors: Record<string, string> = {
  Craft: "bg-purple-100 text-purple-700",
  Food: "bg-orange-100 text-orange-700",
  Tour: "bg-blue-100 text-blue-700",
  Wellness: "bg-emerald-100 text-emerald-700",
}
const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
}

export default function ExperiencesPage() {
  const [search, setSearch] = React.useState("")
  const filtered = experiences.filter(e => e.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#102A43]">Experiences</h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">Curate and manage all bookable cultural experiences</p>
        </div>
        <button className="flex items-center gap-2 bg-[#086C6E] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#086C6E]/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> New Experience
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Experiences</p>
          <p className="text-3xl font-black text-[#102A43]">{experiences.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Bookings Today</p>
          <p className="text-3xl font-black text-[#102A43]">{experiences.reduce((a, e) => a + e.booked, 0)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Avg. Rating</p>
          <p className="text-3xl font-black text-[#102A43]">4.7 <span className="text-amber-400 text-xl">★</span></p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search experiences..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#086C6E]/20 focus:border-[#086C6E]" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Experience</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Category</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Duration</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Price</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Booked</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(exp => (
              <tr key={exp.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-5 py-4">
                  <p className="font-semibold text-[#102A43]">{exp.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{exp.operator}</p>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit ${categoryColors[exp.category]}`}>
                    <Tag className="w-3 h-3" />{exp.category}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Clock className="w-3.5 h-3.5" />{exp.duration}
                  </div>
                </td>
                <td className="px-5 py-4 font-semibold text-[#102A43]">{exp.price}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Users className="w-3.5 h-3.5" />{exp.booked}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${statusColors[exp.status]}`}>{exp.status}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#086C6E]"><Eye className="w-4 h-4" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#086C6E]"><Pencil className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
