"use client"

import * as React from "react"
import { BottomNav } from "@/components/ui/bottom-nav"
import { 
  Calendar, 
  Heart, 
  Award, 
  TrendingUp, 
  Globe, 
  ShieldCheck, 
  Bell, 
  HelpCircle, 
  ChevronRight,
  User
} from "lucide-react"
import Link from "next/link"

import { useApp } from "@/context/AppContext"

export default function ProfilePage() {
  const [locationShared, setLocationShared] = React.useState(false)
  const { state } = useApp()

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] pb-28">
      
      {/* Top Header */}
      <div className="bg-[var(--color-brand-primary)] pt-16 pb-12 px-5 rounded-b-[32px] shadow-sm relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 shrink-0 overflow-hidden shadow-sm">
            {/* Avatar placeholder - use a real image if available */}
            <User className="w-10 h-10 text-white" />
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-white mb-1">Aarav Sharma</h1>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-sm">
                Explorer Level 3
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-white/90 font-medium text-sm">
              <Award className="w-4 h-4 text-[var(--color-brand-accent)] fill-[var(--color-brand-accent)]" />
              <span className="font-bold text-white">{state.heritagePoints}</span> Heritage Points
            </div>
          </div>
        </div>
      </div>

      <main className="px-5 py-6 space-y-6 -mt-4 relative z-20">
        
        {/* Core Menu */}
        <div className="bg-white rounded-[24px] shadow-sm border border-[var(--color-brand-secondary)]/5 overflow-hidden">
          
          <Link href="/bookings" className="flex items-center justify-between p-4 border-b border-[var(--color-brand-secondary)]/5 active:bg-gray-50 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand-secondary)]/5 flex items-center justify-center group-hover:bg-[var(--color-brand-primary)]/10 transition-colors">
                <Calendar className="w-5 h-5 text-[var(--color-brand-secondary)] group-hover:text-[var(--color-brand-primary)] transition-colors" />
              </div>
              <span className="font-semibold text-[var(--color-brand-secondary)]">My Bookings</span>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--color-brand-secondary)]/30" />
          </Link>
          
          <Link href="/saved" className="flex items-center justify-between p-4 border-b border-[var(--color-brand-secondary)]/5 active:bg-gray-50 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand-secondary)]/5 flex items-center justify-center group-hover:bg-[var(--color-brand-primary)]/10 transition-colors">
                <Heart className="w-5 h-5 text-[var(--color-brand-secondary)] group-hover:text-[var(--color-brand-primary)] transition-colors" />
              </div>
              <span className="font-semibold text-[var(--color-brand-secondary)]">Saved Places</span>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--color-brand-secondary)]/30" />
          </Link>
          
          <Link href="/rewards" className="flex items-center justify-between p-4 border-b border-[var(--color-brand-secondary)]/5 active:bg-gray-50 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand-secondary)]/5 flex items-center justify-center group-hover:bg-[var(--color-brand-primary)]/10 transition-colors">
                <Award className="w-5 h-5 text-[var(--color-brand-secondary)] group-hover:text-[var(--color-brand-primary)] transition-colors" />
              </div>
              <span className="font-semibold text-[var(--color-brand-secondary)]">Heritage Points & Rewards</span>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--color-brand-secondary)]/30" />
          </Link>

          <Link href="/impact" className="flex items-center justify-between p-4 active:bg-gray-50 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand-secondary)]/5 flex items-center justify-center group-hover:bg-[var(--color-brand-primary)]/10 transition-colors">
                <TrendingUp className="w-5 h-5 text-[var(--color-brand-secondary)] group-hover:text-[var(--color-brand-primary)] transition-colors" />
              </div>
              <span className="font-semibold text-[var(--color-brand-secondary)]">My Impact</span>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--color-brand-secondary)]/30" />
          </Link>
          
        </div>

        {/* Privacy Settings Section */}
        <div>
          <h2 className="text-sm font-bold text-[var(--color-brand-secondary)] mb-3 px-1 uppercase tracking-wider">Privacy & Security</h2>
          <div className="bg-white rounded-[24px] shadow-sm border border-[var(--color-brand-secondary)]/5 overflow-hidden p-4">
            
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-brand-secondary)]/5 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[var(--color-brand-secondary)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-brand-secondary)] leading-tight">Location Sharing</h3>
                  <p className="text-xs text-[var(--color-brand-secondary)]/60 font-medium mt-1 pr-4 leading-snug">
                    Allow anonymous location signals to improve crowd estimates.
                  </p>
                </div>
              </div>
              
              {/* Toggle Switch */}
              <button 
                onClick={() => setLocationShared(!locationShared)}
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center shrink-0 mt-1 ${locationShared ? 'bg-[var(--color-brand-primary)]' : 'bg-gray-200'}`}
              >
                <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-sm ${locationShared ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            
            <div className="mt-3 bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-emerald-800 leading-relaxed">
                Your exact location is never displayed to destination managers.
              </p>
            </div>

          </div>
        </div>

        {/* App Settings */}
        <div>
          <h2 className="text-sm font-bold text-[var(--color-brand-secondary)] mb-3 px-1 uppercase tracking-wider">Settings</h2>
          <div className="bg-white rounded-[24px] shadow-sm border border-[var(--color-brand-secondary)]/5 overflow-hidden">
            
            <button className="w-full flex items-center justify-between p-4 border-b border-[var(--color-brand-secondary)]/5 active:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-brand-secondary)]/5 flex items-center justify-center group-hover:bg-[var(--color-brand-primary)]/10 transition-colors">
                  <Globe className="w-5 h-5 text-[var(--color-brand-secondary)] group-hover:text-[var(--color-brand-primary)] transition-colors" />
                </div>
                <span className="font-semibold text-[var(--color-brand-secondary)]">Language</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--color-brand-secondary)]/30" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 border-b border-[var(--color-brand-secondary)]/5 active:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-brand-secondary)]/5 flex items-center justify-center group-hover:bg-[var(--color-brand-primary)]/10 transition-colors">
                  <Bell className="w-5 h-5 text-[var(--color-brand-secondary)] group-hover:text-[var(--color-brand-primary)] transition-colors" />
                </div>
                <span className="font-semibold text-[var(--color-brand-secondary)]">Notifications</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--color-brand-secondary)]/30" />
            </button>

            <button className="w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-brand-secondary)]/5 flex items-center justify-center group-hover:bg-[var(--color-brand-primary)]/10 transition-colors">
                  <HelpCircle className="w-5 h-5 text-[var(--color-brand-secondary)] group-hover:text-[var(--color-brand-primary)] transition-colors" />
                </div>
                <span className="font-semibold text-[var(--color-brand-secondary)]">Help & Support</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--color-brand-secondary)]/30" />
            </button>

          </div>
        </div>

      </main>

      <BottomNav />
    </div>
  )
}
