"use client"

import * as React from "react"
import { ArrowLeft, Camera, Clock, Users, Star, Tag, Pencil, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

const experiences = [
  { id: 1, title: "Traditional Woodcarving Workshop", duration: "3 hrs", maxGuests: 6, price: "NPR 2,500", category: "Craft", rating: 4.8, active: true },
  { id: 2, title: "Village Cooking Class", duration: "2 hrs", maxGuests: 8, price: "NPR 1,800", category: "Food", rating: 4.6, active: true },
  { id: 3, title: "Sunset Heritage Walk", duration: "2.5 hrs", maxGuests: 10, price: "NPR 1,200", category: "Tour", rating: 4.5, active: false },
]

export default function OperatorListingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      <div className="bg-[#102A43] pt-14 pb-8 px-5 rounded-b-[32px] text-white shadow-md">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Experience Listing</h1>
          </div>
          <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-white/60 ml-12">Manage your listed experiences</p>
      </div>

      <main className="px-5 py-6 space-y-4 max-w-lg mx-auto">
        {experiences.map(exp => (
          <div key={exp.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Image placeholder */}
            <div className="h-32 bg-gradient-to-br from-[#086C6E]/20 to-[#102A43]/20 flex items-center justify-center relative">
              <Camera className="w-8 h-8 text-gray-300" />
              <div className="absolute top-3 right-3 flex gap-2">
                <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50">
                  <Pencil className="w-3.5 h-3.5 text-gray-600" />
                </button>
                <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50">
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
              <div className="absolute top-3 left-3">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${exp.active ? "bg-emerald-500 text-white" : "bg-gray-400 text-white"}`}>
                  {exp.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-[#102A43]">{exp.title}</h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-semibold text-gray-500">{exp.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{exp.duration}</span>
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />Max {exp.maxGuests}</span>
                <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" />{exp.category}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                <span className="text-lg font-black text-[#102A43]">{exp.price}</span>
                <span className="text-xs text-gray-400 font-medium">per person</span>
                <button className="text-sm font-bold text-[#086C6E] border border-[#086C6E]/30 px-4 py-1.5 rounded-xl hover:bg-[#086C6E]/5 transition-colors">Edit</button>
              </div>
            </div>
          </div>
        ))}

        {/* Add New */}
        <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-semibold text-sm flex items-center justify-center gap-2 hover:border-[#086C6E]/40 hover:text-[#086C6E] transition-colors">
          <Plus className="w-4 h-4" /> Add New Experience
        </button>
      </main>
    </div>
  )
}
