"use client"

import * as React from "react"
import { ArrowLeft, User, Bell, Shield, Globe, LogOut, ChevronRight, Camera, Save } from "lucide-react"
import { useRouter } from "next/navigation"

export default function OperatorSettingsPage() {
  const router = useRouter()
  const [notif, setNotif] = React.useState({ newBooking: true, cancellation: true, review: true, payout: false })
  const [saved, setSaved] = React.useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      <div className="bg-[#102A43] pt-14 pb-8 px-5 rounded-b-[32px] text-white shadow-md">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
        <p className="text-sm text-white/60 ml-12">Manage your profile and preferences</p>
      </div>

      <main className="px-5 py-6 space-y-5 max-w-lg mx-auto">

        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-[#086C6E]" />
            <h2 className="text-sm font-bold text-[#102A43] uppercase tracking-wide">Profile</h2>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#086C6E] to-[#054E50] flex items-center justify-center text-white text-xl font-black shadow-md">H</div>
              <button className="absolute bottom-0 right-0 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm">
                <Camera className="w-3 h-3 text-gray-500" />
              </button>
            </div>
            <div>
              <p className="font-bold text-[#102A43]">Hari Arts Studio</p>
              <p className="text-xs text-gray-400">Verified Operator · Patan</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: "Business Name", value: "Hari Arts Studio" },
              { label: "Owner Name", value: "Hari Prasad Shrestha" },
              { label: "Email", value: "hari@hariartstudio.com" },
              { label: "Phone", value: "+977-9801234567" },
              { label: "Location", value: "Patan Durbar Square, Lalitpur" },
            ].map(field => (
              <div key={field.label} className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{field.label}</label>
                <input defaultValue={field.value} className="w-full px-3.5 py-3 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#086C6E]/20 focus:border-[#086C6E] transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#086C6E]" />
            <h2 className="text-sm font-bold text-[#102A43] uppercase tracking-wide">Notifications</h2>
          </div>
          {[
            { key: "newBooking", label: "New Booking", desc: "Alert when a guest books your experience" },
            { key: "cancellation", label: "Cancellation", desc: "Alert when a booking is cancelled" },
            { key: "review", label: "New Review", desc: "Alert when a guest leaves a review" },
            { key: "payout", label: "Payout Received", desc: "Alert when payment is transferred" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <p className="text-sm font-semibold text-[#102A43]">{label}</p>
                <p className="text-[11px] text-gray-400">{desc}</p>
              </div>
              <button
                onClick={() => setNotif(s => ({ ...s, [key]: !s[key as keyof typeof s] }))}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${notif[key as keyof typeof notif] ? "bg-[#086C6E]" : "bg-gray-200"}`}
              >
                <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 m-0.5 ${notif[key as keyof typeof notif] ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          ))}
        </div>

        {/* Security & Regional */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {[
            { icon: <Shield className="w-5 h-5 text-gray-500" />, label: "Security & Password" },
            { icon: <Globe className="w-5 h-5 text-gray-500" />, label: "Language & Region" },
          ].map((item, i, arr) => (
            <button key={item.label} className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">{item.icon}</div>
                <span className="font-semibold text-sm text-[#102A43]">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
          ))}
        </div>

        {/* Save Button */}
        <button onClick={handleSave} className={`w-full py-3.5 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm ${saved ? "bg-emerald-500 text-white" : "bg-[#086C6E] text-white hover:bg-[#086C6E]/90"}`}>
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Changes"}
        </button>

        {/* Sign Out */}
        <button className="w-full py-3.5 font-bold text-sm rounded-2xl border border-red-200 text-red-500 flex items-center justify-center gap-2 hover:bg-red-50 transition-colors">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </main>
    </div>
  )
}
