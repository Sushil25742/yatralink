"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { CrowdBadge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Map, Info, BookOpen, Camera, Star, Lightbulb, MapPin, Share } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function PlaceDetailsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] pb-28">
      
      {/* Hero Image Section */}
      <div className="relative h-72 w-full bg-gray-200">
        {/* Placeholder for the image. In a real app, use next/image with a real URL */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Top actions */}
        <div className="absolute top-0 inset-x-0 p-4 pt-safe flex justify-between items-center">
          <Link href="/home" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition">
            <Share className="w-5 h-5" />
          </button>
        </div>
      </div>

      <main className="px-5 py-6 -mt-6 relative bg-[var(--color-bg-base)] rounded-t-[24px]">
        
        {/* Title & Badge */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-3xl font-bold text-[var(--color-brand-secondary)] leading-tight">Patan Durbar Square</h1>
          </div>
          <CrowdBadge status="HIGH" className="shadow-sm" />
        </div>

        {/* Crowd Intelligence Alert */}
        <div className="bg-[var(--color-crowd-high)]/10 border border-[var(--color-crowd-high)]/20 rounded-xl p-4 mb-6 relative overflow-hidden">
          <div className="flex gap-3 mb-4">
            <Info className="w-5 h-5 text-[var(--color-crowd-high)] shrink-0 mt-0.5" />
            <p className="text-sm font-semibold text-[var(--color-brand-secondary)]">
              This heritage site is important and worth visiting, but there may be a better time.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 bg-white/60 rounded-lg p-3">
            <div>
              <span className="block text-[10px] font-bold uppercase text-[var(--color-brand-secondary)]/50 tracking-wider mb-1">Est. Waiting</span>
              <div className="flex items-center text-sm font-bold text-[var(--color-brand-secondary)]">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-[var(--color-crowd-high)]" />
                40–50 min
              </div>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase text-[var(--color-brand-secondary)]/50 tracking-wider mb-1">Best Time</span>
              <div className="text-sm font-bold text-[var(--color-brand-secondary)]">
                After 3:00 PM
              </div>
            </div>
          </div>
        </div>

        {/* Quick Nav Icons */}
        <div className="flex justify-between items-center mb-8 px-2">
          <QuickNavIcon icon={<BookOpen className="w-5 h-5" />} label="History" />
          <QuickNavIcon icon={<Camera className="w-5 h-5" />} label="Photos" />
          <QuickNavIcon icon={<Star className="w-5 h-5" />} label="Reviews" />
          <QuickNavIcon icon={<Lightbulb className="w-5 h-5" />} label="Tips" />
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[var(--color-brand-secondary)] mb-2">Overview</h3>
          <p className="text-sm text-[var(--color-brand-secondary)]/80 leading-relaxed font-medium">
            A marvel of Newa architecture, this square is the heart of Lalitpur. It holds centuries of history, showcasing intricate wood and stone carvings. As a living heritage site, it is a sacred space for both Hindus and Buddhists. Please explore respectfully, maintaining the sanctity of the temples.
          </p>
        </div>

        {/* Nearby Alternatives Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[var(--color-brand-secondary)]">Nearby Alternatives</h3>
            <span className="text-xs font-bold text-[var(--color-brand-primary)]">View Map</span>
          </div>

          <div className="space-y-3">
            {/* Alternative 1 */}
            <div className="p-3 border border-[var(--color-brand-secondary)]/10 rounded-[16px] bg-white flex items-center justify-between shadow-sm">
              <div>
                <h4 className="font-bold text-[var(--color-brand-secondary)] mb-1">Traditional Woodcarving Workshop</h4>
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-brand-secondary)]/60">
                  <CrowdBadge status="LOW" className="bg-transparent p-0 shadow-none gap-1 [&>span:last-child]:font-bold text-[var(--color-crowd-low)]" />
                  <span>•</span>
                  <span>5 min walk</span>
                </div>
              </div>
            </div>

            {/* Alternative 2 */}
            <div className="p-3 border border-[var(--color-brand-secondary)]/10 rounded-[16px] bg-white flex items-center justify-between shadow-sm">
              <div>
                <h4 className="font-bold text-[var(--color-brand-secondary)] mb-1">Golden Temple</h4>
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-brand-secondary)]/60">
                  <CrowdBadge status="MODERATE" className="bg-transparent p-0 shadow-none gap-1 [&>span:last-child]:font-bold text-[var(--color-crowd-mod)]" />
                  <span>•</span>
                  <span>7 min walk</span>
                </div>
              </div>
            </div>

            {/* Alternative 3 */}
            <div className="p-3 border border-[var(--color-brand-secondary)]/10 rounded-[16px] bg-white flex items-center justify-between shadow-sm">
              <div>
                <h4 className="font-bold text-[var(--color-brand-secondary)] mb-1">Mangal Bazaar</h4>
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-brand-secondary)]/60">
                  <CrowdBadge status="LOW" className="bg-transparent p-0 shadow-none gap-1 [&>span:last-child]:font-bold text-[var(--color-crowd-low)]" />
                  <span>•</span>
                  <span>8 min walk</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-[var(--color-brand-secondary)]/10 p-4 pt-4 pb-safe-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
        <div className="flex gap-3">
          <Button className="flex-[2] font-bold h-14 text-base">
            Add to Journey
          </Button>
          <Button variant="outline" className="flex-1 font-bold h-14">
            <Map className="w-5 h-5 mr-2" />
            Navigate
          </Button>
        </div>
      </div>

    </div>
  )
}

function QuickNavIcon({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer group">
      <div className="w-12 h-12 rounded-full bg-white border border-[var(--color-brand-secondary)]/10 flex items-center justify-center text-[var(--color-brand-secondary)] shadow-sm group-hover:bg-[var(--color-brand-primary)] group-hover:text-white transition-colors">
        {icon}
      </div>
      <span className="text-[11px] font-bold text-[var(--color-brand-secondary)]/70">{label}</span>
    </div>
  )
}
