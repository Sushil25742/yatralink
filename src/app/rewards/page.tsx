"use client"

import * as React from "react"
import { TopAppBar } from "@/components/ui/top-app-bar"
import { BottomNav } from "@/components/ui/bottom-nav"
import { Award, Clock, Store, Map, Coffee, Ticket, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useApp } from "@/context/AppContext"

export default function RewardsPage() {
  const { state } = useApp()
  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] pb-28">
      <TopAppBar 
        title="Heritage Points" 
        leading={
          <Link href="/profile" className="p-2 -ml-2 rounded-full hover:bg-[var(--color-brand-secondary)]/5 text-[var(--color-brand-secondary)]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        }
      />

      <main className="px-5 py-6 space-y-8">
        
        {/* Balance Card */}
        <div className="bg-[var(--color-brand-primary)] rounded-[24px] p-6 text-white text-center shadow-lg relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-5xl font-bold tracking-tight mb-1">{state.heritagePoints} <span className="text-3xl">Points</span></span>
            <span className="text-sm font-semibold tracking-wide text-white/80 mb-5">Bronze Traveler</span>
            
            <button className="bg-white text-[var(--color-brand-primary)] font-bold text-sm px-6 py-2.5 rounded-full hover:bg-white/90 transition-colors shadow-sm">
              Redeem Rewards
            </button>
          </div>
        </div>

        {/* Earning Examples */}
        <section>
          <h2 className="text-lg font-bold text-[var(--color-brand-secondary)] mb-4">How to Earn</h2>
          <div className="grid grid-cols-2 gap-3">
            
            <EarningCard 
              icon={<Clock className="w-5 h-5 text-emerald-600" />}
              title="Visit during off-peak hours"
              points="+50"
            />
            
            <EarningCard 
              icon={<Store className="w-5 h-5 text-emerald-600" />}
              title="Book local experience"
              points="+100"
            />
            
            <EarningCard 
              icon={<Award className="w-5 h-5 text-emerald-600" />}
              title="Support local artisan"
              points="+75"
            />
            
            <EarningCard 
              icon={<Map className="w-5 h-5 text-emerald-600" />}
              title="Choose alternative route"
              points="+25"
            />

          </div>
        </section>

        {/* Rewards Store */}
        <section>
          <h2 className="text-lg font-bold text-[var(--color-brand-secondary)] mb-4">Available Rewards</h2>
          <div className="space-y-3">
            
            <RewardCard 
              icon={<Coffee className="w-5 h-5 text-[var(--color-brand-accent)]" />}
              title="Local Café Discount"
              points="100 pts"
              color="bg-[var(--color-brand-accent)]/10"
            />
            
            <RewardCard 
              icon={<Ticket className="w-5 h-5 text-blue-500" />}
              title="Craft Workshop Discount"
              points="200 pts"
              color="bg-blue-500/10"
            />
            
            <RewardCard 
              icon={<Award className="w-5 h-5 text-[var(--color-brand-primary)]" />}
              title="Local Experience Reward"
              points="300 pts"
              color="bg-[var(--color-brand-primary)]/10"
            />

          </div>
        </section>

      </main>

      <BottomNav />
    </div>
  )
}

function EarningCard({ icon, title, points }: { icon: React.ReactNode, title: string, points: string }) {
  return (
    <div className="bg-white p-4 rounded-[20px] shadow-sm border border-[var(--color-brand-secondary)]/5 flex flex-col items-start gap-3">
      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-[var(--color-brand-secondary)] leading-tight">{title}</span>
        <span className="text-sm font-bold text-emerald-600">{points} pts</span>
      </div>
    </div>
  )
}

function RewardCard({ icon, title, points, color }: { icon: React.ReactNode, title: string, points: string, color: string }) {
  return (
    <div className="bg-white p-4 rounded-[20px] shadow-sm border border-[var(--color-brand-secondary)]/5 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-[var(--color-brand-secondary)] text-sm mb-1 line-clamp-1">{title}</h3>
        <span className="text-xs font-bold text-[var(--color-brand-secondary)]/60 uppercase tracking-wider">{points}</span>
      </div>
      <button className="px-4 py-2 bg-[var(--color-brand-secondary)]/5 hover:bg-[var(--color-brand-secondary)]/10 rounded-full text-xs font-bold text-[var(--color-brand-secondary)] transition-colors">
        Redeem
      </button>
    </div>
  )
}
