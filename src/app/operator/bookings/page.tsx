"use client"

import * as React from "react"
import { ArrowLeft, CalendarCheck, Clock, CheckCircle2, XCircle, User } from "lucide-react"
import { useRouter } from "next/navigation"

const bookings = [
  { id: "BK-1042", guest: "Sarah Mitchell", guests: 2, time: "10:00 AM", duration: "3 hrs", amount: "NPR 5,000", status: "Confirmed" },
  { id: "BK-1041", guest: "Raj Sharma", guests: 1, time: "1:00 PM", duration: "3 hrs", amount: "NPR 2,500", status: "Confirmed" },
  { id: "BK-1040", guest: "Liu Wei", guests: 3, time: "3:30 PM", duration: "3 hrs", amount: "NPR 7,500", status: "Pending" },
  { id: "BK-1039", guest: "Emma Johnson", guests: 2, time: "Yesterday 10:00 AM", duration: "3 hrs", amount: "NPR 5,000", status: "Completed" },
  { id: "BK-1038", guest: "Carlos Ruiz", guests: 1, time: "Yesterday 2:00 PM", duration: "3 hrs", amount: "NPR 2,500", status: "Completed" },
  { id: "BK-1037", guest: "Aiko Tanaka", guests: 4, time: "Aug 19 11:00 AM", duration: "3 hrs", amount: "NPR 10,000", status: "Cancelled" },
]

const statusConfig: Record<string, { style: string; icon: React.ReactNode }> = {
  Confirmed: { style: "bg-blue-100 text-blue-700", icon: <CheckCircle2 className="w-3 h-3" /> },
  Pending:   { style: "bg-amber-100 text-amber-700", icon: <Clock className="w-3 h-3" /> },
  Completed: { style: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 className="w-3 h-3" /> },
  Cancelled: { style: "bg-red-100 text-red-700", icon: <XCircle className="w-3 h-3" /> },
}

export default function OperatorBookingsPage() {
  const router = useRouter()
  const [tab, setTab] = React.useState("Upcoming")

  const filtered = bookings.filter(b =>
    tab === "Upcoming" ? b.status === "Confirmed" || b.status === "Pending" :
    tab === "Completed" ? b.status === "Completed" :
    b.status === "Cancelled"
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      <div className="bg-[#102A43] pt-14 pb-8 px-5 rounded-b-[32px] text-white shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Upcoming Bookings</h1>
        </div>
        <div className="flex items-center gap-2">
          {["Upcoming", "Completed", "Cancelled"].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition-all ${tab === t ? "bg-white text-[#102A43]" : "bg-white/10 text-white/70 hover:bg-white/20"}`}>{t}</button>
          ))}
        </div>
      </div>

      <main className="px-5 py-6 space-y-3 max-w-lg mx-auto">
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-400 font-semibold shadow-sm border border-gray-100">No {tab.toLowerCase()} bookings</div>
        )}
        {filtered.map(b => (
          <div key={b.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#086C6E]/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#086C6E]" />
                </div>
                <div>
                  <p className="font-bold text-[#102A43]">{b.guest}</p>
                  <p className="text-xs text-gray-400">{b.id} · {b.guests} guest{b.guests > 1 ? "s" : ""}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${statusConfig[b.status].style}`}>
                {statusConfig[b.status].icon}{b.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm border-t border-gray-50 pt-3">
              <div className="flex items-center gap-1.5 text-gray-500">
                <CalendarCheck className="w-4 h-4" />
                <span className="font-medium">{b.time}</span>
                <span className="text-gray-300">·</span>
                <span>{b.duration}</span>
              </div>
              <span className="font-bold text-[#102A43]">{b.amount}</span>
            </div>
            {b.status === "Pending" && (
              <div className="flex gap-2 pt-1">
                <button className="flex-1 py-2 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:bg-emerald-600 transition-colors">Accept</button>
                <button className="flex-1 py-2 bg-gray-100 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors">Decline</button>
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  )
}
