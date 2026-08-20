"use client"

import * as React from "react"
import { TopAppBar } from "@/components/ui/top-app-bar"
import { BottomNav } from "@/components/ui/bottom-nav"
import { Button } from "@/components/ui/button"
import { Award, Wallet, Store, Map, Heart, TrendingUp, Info } from "lucide-react"
import Link from "next/link"
import { useApp } from "@/context/AppContext"

export default function ProfilePage() {
  const { state } = useApp()
  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] pb-28">
      <TopAppBar title="Profile" />

      <main className="px-5 py-6 space-y-6">
        
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-secondary)] mb-1">Your Impact So Far</h1>
          <p className="text-sm font-medium text-[var(--color-brand-secondary)]/60">
            Keep exploring responsibly.
          </p>
        </div>

        {/* Hero Impact Card (Financial) */}
        <div className="relative overflow-hidden rounded-[24px] bg-[var(--color-brand-primary)] shadow-md">
          {/* Subtle Nepal Landscape Illustration (Abstract shapes) */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
              <path d="M0 200 L 100 80 L 150 120 L 250 50 L 350 140 L 400 100 L 400 200 Z" fill="#FFFFFF" />
              <path d="M0 200 L 150 150 L 250 180 L 400 130 L 400 200 Z" fill="#D6A84B" />
              <circle cx="300" cy="40" r="20" fill="#D6A84B" />
            </svg>
          </div>
          
          <div className="relative z-10 p-6 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-8">
              <span className="text-white/80 font-semibold tracking-wider uppercase text-xs">Total Local Spend</span>
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xl font-bold text-white/80">NPR</span>
                <span className="text-4xl font-bold text-white tracking-tight">{state.impact.localSpend.toLocaleString()}</span>
              </div>
              <p className="text-sm text-white/90 font-medium"> injected directly into the local economy.</p>
            </div>
          </div>
        </div>

        {/* Grid Stats */}
        <div className="grid grid-cols-2 gap-3">
          
          <div className="bg-white p-4 rounded-[20px] shadow-sm border border-[var(--color-brand-secondary)]/5 flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
              <Store className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-[var(--color-brand-secondary)]">{state.impact.businessesSupported}</span>
            <span className="text-xs font-bold text-[var(--color-brand-secondary)]/60 leading-tight">Local Businesses<br/>Supported</span>
          </div>

          <div className="bg-white p-4 rounded-[20px] shadow-sm border border-[var(--color-brand-secondary)]/5 flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
              <Map className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-[var(--color-brand-secondary)]">{state.impact.placesAvoided}</span>
            <span className="text-xs font-bold text-[var(--color-brand-secondary)]/60 leading-tight">Crowded Places<br/>Avoided</span>
          </div>

        </div>

        {/* Heritage Contribution Special Card */}
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-[var(--color-brand-secondary)]/10">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--color-brand-accent)]/10 flex items-center justify-center">
                <Heart className="w-4 h-4 text-[var(--color-brand-accent)]" />
              </div>
              <h3 className="font-bold text-[var(--color-brand-secondary)]">Heritage Contribution</h3>
            </div>
            <span className="text-xl font-bold text-[var(--color-brand-secondary)]">NPR {Math.floor(state.impact.localSpend * 0.1).toLocaleString()}</span>
          </div>
          <div className="bg-amber-50 p-2 rounded-md flex items-start gap-2 mt-3 border border-amber-100">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[10px] font-semibold text-amber-800 uppercase tracking-wider leading-relaxed">
              Prototype Note: These contribution values are for demo purposes only and do not reflect real accounting.
            </p>
          </div>
        </div>

        {/* Discovery Stat */}
        <div className="bg-white p-4 rounded-[20px] shadow-sm border border-[var(--color-brand-secondary)]/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-[var(--color-brand-secondary)] leading-tight">Cultural Experiences<br/>Discovered</span>
          </div>
          <span className="text-3xl font-bold text-[var(--color-brand-secondary)]">{state.impact.culturalExperiences}</span>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Button variant="outline" className="w-full h-14 text-base font-bold bg-white border-[var(--color-brand-secondary)]/20 shadow-sm">
            View Impact History
          </Button>
        </div>

        {/* Quick Link to Rewards */}
        <Link href="/rewards" className="block">
          <div className="bg-[var(--color-brand-secondary)]/5 p-4 rounded-xl flex items-center justify-between active:bg-[var(--color-brand-secondary)]/10 transition-colors">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-[var(--color-brand-secondary)]" />
              <span className="font-bold text-[var(--color-brand-secondary)] text-sm">View Heritage Points</span>
            </div>
            <span className="font-bold text-[var(--color-brand-primary)]">{state.heritagePoints} pts</span>
          </div>
        </Link>

      </main>

      <BottomNav />
    </div>
  )
}
