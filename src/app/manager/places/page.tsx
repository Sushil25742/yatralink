"use client"

import * as React from "react"
import { MapPin, Star, Eye, Pencil, Trash2, Plus, Search, Filter } from "lucide-react"

const places = [
  { id: 1, name: "Patan Durbar Square", zone: "Lalitpur Heritage Zone", status: "Active", visitors: "1,240", rating: 4.8, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop" },
  { id: 2, name: "Golden Temple (Hiranya Varna Mahavihar)", zone: "Lalitpur Heritage Zone", status: "Active", visitors: "890", rating: 4.7, image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=80&h=80&fit=crop" },
  { id: 3, name: "Mangal Bazaar", zone: "Lalitpur Heritage Zone", status: "Active", visitors: "650", rating: 4.5, image: "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?w=80&h=80&fit=crop" },
  { id: 4, name: "Kumbheshwar Temple", zone: "Lalitpur Heritage Zone", status: "Restricted", visitors: "320", rating: 4.6, image: "https://images.unsplash.com/photo-1588614959060-4d144f28b2ea?w=80&h=80&fit=crop" },
  { id: 5, name: "Oku Bahal", zone: "Lalitpur Heritage Zone", status: "Active", visitors: "210", rating: 4.4, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop" },
  { id: 6, name: "Machhendra Bahal", zone: "Lalitpur Heritage Zone", status: "Maintenance", visitors: "0", rating: 4.3, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=80&h=80&fit=crop" },
]

const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Restricted: "bg-amber-100 text-amber-700 border-amber-200",
  Maintenance: "bg-red-100 text-red-700 border-red-200",
}

export default function PlacesPage() {
  const [search, setSearch] = React.useState("")
  const filtered = places.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#102A43]">Places</h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">Manage all registered destinations and heritage sites</p>
        </div>
        <button className="flex items-center gap-2 bg-[#086C6E] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#086C6E]/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Place
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search places..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#086C6E]/20 focus:border-[#086C6E]"
          />
        </div>
        <button className="flex items-center gap-2 text-sm font-semibold text-gray-600 border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Place</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Zone</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Visitors Today</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Rating</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(place => (
              <tr key={place.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img src={place.image} alt={place.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    <span className="font-semibold text-[#102A43]">{place.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{place.zone}</span>
                  </div>
                </td>
                <td className="px-5 py-4 font-semibold text-[#102A43]">{place.visitors}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-[#102A43]">{place.rating}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${statusColors[place.status]}`}>
                    {place.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#086C6E]"><Eye className="w-4 h-4" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#086C6E]"><Pencil className="w-4 h-4" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
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
