"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, QrCode, MapPin, Calendar, Clock, Users } from "lucide-react"
import Link from "next/link"

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] flex flex-col pb-10">
      
      {/* Premium Header */}
      <div className="bg-[var(--color-brand-primary)] pt-20 pb-16 px-5 relative rounded-b-[40px] shadow-sm">
        <div className="flex flex-col items-center justify-center text-center text-white relative z-10">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-6 shadow-sm border border-white/20">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <span className="text-sm font-bold tracking-[0.2em] uppercase text-white/70 mb-2">Success</span>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Booking Confirmed</h1>
        </div>
        
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10" 
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} 
        />
      </div>

      <div className="flex-1 px-5 -mt-8 relative z-20">
        
        {/* Ticket / Receipt Card */}
        <div className="bg-white rounded-[24px] w-full shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-[var(--color-brand-secondary)]/5 flex flex-col overflow-hidden">
          
          <div className="p-6 pb-8 border-b border-dashed border-[var(--color-brand-secondary)]/20 relative">
            {/* Ticket punch holes */}
            <div className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-[var(--color-bg-base)] shadow-inner" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 rounded-full bg-[var(--color-bg-base)] shadow-inner" />

            <h2 className="text-xl font-bold text-[var(--color-brand-secondary)] mb-1 leading-tight">
              Traditional Woodcarving Workshop
            </h2>
            <div className="flex items-center text-sm font-semibold text-[var(--color-brand-secondary)]/60 mb-6">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              Patan, Lalitpur
            </div>

            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
              <div>
                <span className="block text-[10px] font-bold uppercase text-[var(--color-brand-secondary)]/50 tracking-wider mb-1">Date</span>
                <div className="flex items-center text-sm font-bold text-[var(--color-brand-secondary)]">
                  <Calendar className="w-4 h-4 mr-1.5 text-[var(--color-brand-primary)]" />
                  12 May
                </div>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-[var(--color-brand-secondary)]/50 tracking-wider mb-1">Time</span>
                <div className="flex items-center text-sm font-bold text-[var(--color-brand-secondary)]">
                  <Clock className="w-4 h-4 mr-1.5 text-[var(--color-brand-primary)]" />
                  10:00 AM
                </div>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-[var(--color-brand-secondary)]/50 tracking-wider mb-1">Guests</span>
                <div className="flex items-center text-sm font-bold text-[var(--color-brand-secondary)]">
                  <Users className="w-4 h-4 mr-1.5 text-[var(--color-brand-primary)]" />
                  2
                </div>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-[var(--color-brand-secondary)]/50 tracking-wider mb-1">Booking ID</span>
                <div className="text-sm font-bold text-[var(--color-brand-secondary)]">
                  YL12345
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="p-6 flex flex-col items-center justify-center bg-gray-50/50">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-[var(--color-brand-secondary)]/10 mb-4">
              <QrCode className="w-32 h-32 text-[var(--color-brand-secondary)]" strokeWidth={1} />
            </div>
            <p className="text-xs font-semibold text-[var(--color-brand-secondary)]/50 uppercase tracking-wider mb-1">
              Show to Host
            </p>
          </div>

        </div>

        {/* Impact Message */}
        <div className="mt-8 text-center px-4">
          <p className="text-sm font-medium text-[var(--color-brand-secondary)]/80 leading-relaxed">
            Your booking supports a local experience provider.
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 space-y-3">
          <Link href="/journey/itinerary" className="block w-full">
            <Button className="w-full h-14 text-base font-bold shadow-sm">
              View Journey
            </Button>
          </Link>
          
          <Button variant="outline" className="w-full h-14 text-base font-bold bg-white border-[var(--color-brand-secondary)]/20 shadow-sm">
            View Booking
          </Button>
        </div>

      </div>
    </div>
  )
}
