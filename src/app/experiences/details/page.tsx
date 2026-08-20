"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { FilterChip } from "@/components/ui/filter-chip"
import { ArrowLeft, Share, Star, Clock, Users, CheckCircle2, Minus, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useApp } from "@/context/AppContext"

export default function ExperienceDetailsPage() {
  const router = useRouter()
  const { bookExperience } = useApp()
  const [activeTime, setActiveTime] = React.useState("10:00 AM")
  const [guests, setGuests] = React.useState(1)
  const pricePerGuest = 800
  const totalPrice = guests * pricePerGuest
  const [isBooking, setIsBooking] = React.useState(false)

  const handleBookNow = () => {
    setIsBooking(true)
    setTimeout(() => {
      bookExperience({
        title: "Traditional Woodcarving Workshop",
        price: totalPrice,
        imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=400"
      })
      router.push("/bookings/success")
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] pb-28">
      
      {/* Hero Image */}
      <div className="relative h-72 w-full bg-gray-200">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1605648916319-cf082f7524a1?q=80&w=1000&auto=format&fit=crop")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute top-0 inset-x-0 p-4 pt-safe flex justify-between items-center">
          <Link href="/experiences" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition">
            <Share className="w-5 h-5" />
          </button>
        </div>
      </div>

      <main className="px-5 py-6 -mt-6 relative bg-[var(--color-bg-base)] rounded-t-[24px]">
        
        {/* Title & Host */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--color-brand-secondary)] leading-tight mb-2">Traditional Woodcarving Workshop</h1>
          <p className="text-sm font-medium text-[var(--color-brand-secondary)]/60">
            Hosted by <span className="text-[var(--color-brand-secondary)] font-bold">Local Patan Artisan</span>
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white rounded-xl p-3 shadow-sm border border-[var(--color-brand-secondary)]/5 flex flex-col items-center justify-center">
            <Star className="w-5 h-5 fill-[var(--color-brand-accent)] text-[var(--color-brand-accent)] mb-1" />
            <span className="text-sm font-bold text-[var(--color-brand-secondary)]">4.8</span>
            <span className="text-[10px] uppercase font-bold text-[var(--color-brand-secondary)]/50 tracking-wider">Rating</span>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-[var(--color-brand-secondary)]/5 flex flex-col items-center justify-center">
            <Clock className="w-5 h-5 text-[var(--color-brand-primary)] mb-1" />
            <span className="text-sm font-bold text-[var(--color-brand-secondary)]">45 min</span>
            <span className="text-[10px] uppercase font-bold text-[var(--color-brand-secondary)]/50 tracking-wider">Duration</span>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-[var(--color-brand-secondary)]/5 flex flex-col items-center justify-center">
            <Users className="w-5 h-5 text-[var(--color-brand-primary)] mb-1" />
            <span className="text-sm font-bold text-[var(--color-brand-secondary)]">2–8</span>
            <span className="text-[10px] uppercase font-bold text-[var(--color-brand-secondary)]/50 tracking-wider">Group Size</span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <p className="text-[15px] text-[var(--color-brand-secondary)]/80 leading-relaxed font-medium">
            Learn traditional Newari woodcarving directly from local artisans and create your own small piece.
          </p>
        </div>

        {/* What's Included */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[var(--color-brand-secondary)] mb-4">What&apos;s Included</h3>
          <ul className="space-y-3">
            {["Materials", "Artisan Guide", "Cultural Storytelling", "Your Creation"].map(item => (
              <li key={item} className="flex items-center text-sm font-semibold text-[var(--color-brand-secondary)]/80">
                <CheckCircle2 className="w-5 h-5 mr-3 text-[var(--color-brand-primary)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <hr className="border-[var(--color-brand-secondary)]/10 mb-8" />

        {/* Booking Selection */}
        <div className="space-y-8">
          
          {/* Times */}
          <div>
            <h3 className="text-lg font-bold text-[var(--color-brand-secondary)] mb-4">Available Times</h3>
            <div className="flex flex-wrap gap-2">
              {["10:00 AM", "11:30 AM", "2:00 PM", "4:00 PM"].map(time => (
                <FilterChip 
                  key={time} 
                  active={activeTime === time}
                  onClick={() => setActiveTime(time)}
                >
                  {time}
                </FilterChip>
              ))}
            </div>
          </div>

          {/* Guests */}
          <div>
            <h3 className="text-lg font-bold text-[var(--color-brand-secondary)] mb-4">Guests</h3>
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-[var(--color-brand-secondary)]/10 shadow-sm">
              <span className="font-bold text-[var(--color-brand-secondary)]">Adults</span>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-8 h-8 rounded-full border border-[var(--color-brand-secondary)]/20 flex items-center justify-center text-[var(--color-brand-secondary)] disabled:opacity-30"
                  disabled={guests <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-lg w-4 text-center text-[var(--color-brand-secondary)]">{guests}</span>
                <button 
                  onClick={() => setGuests(Math.min(8, guests + 1))}
                  className="w-8 h-8 rounded-full border border-[var(--color-brand-secondary)]/20 flex items-center justify-center text-[var(--color-brand-secondary)] disabled:opacity-30"
                  disabled={guests >= 8}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-[var(--color-brand-secondary)]/10 p-4 pt-4 pb-safe-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[var(--color-brand-secondary)]/50 uppercase tracking-wider">Total</span>
            <span className="text-xl font-bold text-[var(--color-brand-secondary)]">NPR {totalPrice.toLocaleString()}</span>
          </div>
          <Button 
            className="flex-1 font-bold h-14 text-base"
            onClick={handleBookNow}
            isLoading={isBooking}
          >
            Book Now
          </Button>
        </div>
      </div>

    </div>
  )
}
