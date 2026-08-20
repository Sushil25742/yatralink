"use client"

import * as React from "react"
import { TopAppBar } from "@/components/ui/top-app-bar"
import { BottomNav } from "@/components/ui/bottom-nav"
import { Calendar, Clock, Search } from "lucide-react"

import { useApp } from "@/context/AppContext"

export default function BookingsPage() {
  const [activeTab, setActiveTab] = React.useState<"Upcoming" | "Completed">("Upcoming")

  const { state } = useApp()

  // We'll combine static demo bookings with whatever was dynamically booked.
  const staticBookings = [
    {
      id: "YL12345",
      title: "Traditional Woodcarving Workshop",
      date: "12 May 2026",
      time: "10:00 AM",
      status: "Confirmed" as const,
      imageUrl: "https://images.unsplash.com/photo-1605648916319-cf082f7524a1?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: "YL12346",
      title: "Newari Lunch Experience",
      date: "12 May 2026",
      time: "12:00 PM",
      status: "Confirmed" as const,
      imageUrl: "https://images.unsplash.com/photo-1546549095-5a3cb5b9c1bc?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: "YL12347",
      title: "Heritage Walk Patan",
      date: "12 May 2026",
      time: "3:30 PM",
      status: "Pending" as const,
      imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=400&auto=format&fit=crop"
    }
  ]

  // Add the dynamic bookings from context
  const dynamicBookings = state.bookings.map((b: any, i: number) => ({
    id: `DYN${8000 + i}`,
    title: b.title,
    date: "12 May 2026",
    time: "Next Available",
    status: "Confirmed" as const,
    imageUrl: b.imageUrl
  }))

  const allBookings = [...dynamicBookings, ...staticBookings]

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] pb-28">
      <TopAppBar 
        title="My Bookings" 
        trailing={<SearchIcon />}
      />

      {/* Tabs */}
      <div className="sticky top-0 z-30 bg-[var(--color-bg-base)]/90 backdrop-blur-md pt-2 pb-4 px-5 shadow-sm border-b border-[var(--color-brand-secondary)]/5 flex gap-6">
        <button 
          onClick={() => setActiveTab("Upcoming")}
          className={`pb-2 font-bold transition-colors relative ${activeTab === "Upcoming" ? "text-[var(--color-brand-secondary)]" : "text-[var(--color-brand-secondary)]/40"}`}
        >
          Upcoming
          {activeTab === "Upcoming" && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-[var(--color-brand-primary)] rounded-t-full" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab("Completed")}
          className={`pb-2 font-bold transition-colors relative ${activeTab === "Completed" ? "text-[var(--color-brand-secondary)]" : "text-[var(--color-brand-secondary)]/40"}`}
        >
          Completed
          {activeTab === "Completed" && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-[var(--color-brand-primary)] rounded-t-full" />
          )}
        </button>
      </div>

      <main className="px-4 py-6 space-y-4">
        
        {activeTab === "Upcoming" ? (
          <>
            {allBookings.map(booking => (
              <BookingCard 
                key={booking.id}
                title={booking.title}
                date={booking.date}
                time={booking.time}
                bookingId={booking.id}
                status={booking.status}
                imageUrl={booking.imageUrl}
              />
            ))}
          </>
        ) : (
          <div className="pt-20 text-center flex flex-col items-center">
            <Calendar className="w-12 h-12 text-[var(--color-brand-secondary)]/20 mb-4" />
            <h3 className="text-lg font-bold text-[var(--color-brand-secondary)] mb-2">No past bookings yet</h3>
            <p className="text-sm font-medium text-[var(--color-brand-secondary)]/60">
              When you complete local experiences, they will appear here.
            </p>
          </div>
        )}

      </main>

      <BottomNav />
    </div>
  )
}

function SearchIcon() {
  return (
    <button className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--color-brand-secondary)] hover:bg-[var(--color-brand-secondary)]/5 transition">
      <Search className="w-5 h-5" />
    </button>
  )
}

interface BookingCardProps {
  title: string
  date: string
  time: string
  bookingId: string
  status: "Confirmed" | "Pending"
  imageUrl: string
}

function BookingCard({ title, date, time, bookingId, status, imageUrl }: BookingCardProps) {
  const isConfirmed = status === "Confirmed"
  
  return (
    <div className="bg-white rounded-[20px] p-3 shadow-sm border border-[var(--color-brand-secondary)]/5 flex gap-4 cursor-pointer hover:shadow-md transition-shadow">
      
      {/* Image */}
      <div className="relative w-24 h-28 rounded-xl overflow-hidden shrink-0 bg-[var(--color-brand-secondary)]/5">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between py-1 min-w-0 pr-1">
        
        <div>
          <div className="flex justify-between items-start mb-1">
            <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm ${isConfirmed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {status}
            </span>
            <span className="text-[10px] font-bold text-[var(--color-brand-secondary)]/40 uppercase">
              {bookingId}
            </span>
          </div>
          
          <h3 className="font-bold text-[15px] text-[var(--color-brand-secondary)] leading-tight mb-2 line-clamp-2">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-[var(--color-brand-secondary)]/70">
          <div className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1 text-[var(--color-brand-primary)]" />
            {date}
          </div>
          <div className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1 text-[var(--color-brand-primary)]" />
            {time}
          </div>
        </div>

      </div>
    </div>
  )
}
