"use client"

import React, { useState } from "react"
import { ArrowLeft, User, Bell, LogOut, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function EngineerSettingsPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [notif, setNotif] = useState({ systemAlerts: true, crowdCritical: true, offlineNodes: true })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      <div className="bg-[#1a2b4b] pt-14 pb-8 px-5 rounded-b-[32px] text-white shadow-md">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">System Settings</h1>
        </div>
        <p className="text-sm text-white/60 ml-12">Configure alerts and profile</p>
      </div>

      <main className="px-5 py-6 space-y-5 max-w-lg mx-auto">

        {/* Profile */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-[#1a2b4b]" />
            <h2 className="text-sm font-bold text-[#1a2b4b] uppercase tracking-wide">Engineer Profile</h2>
          </div>

          <div className="flex items-center gap-4 pb-2 border-b border-gray-50">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#086C6E] to-[#1a2b4b] flex items-center justify-center text-white text-lg font-black shadow-sm">
              {user?.avatar || "E"}
            </div>
            <div>
              <p className="font-bold text-[#1a2b4b] text-lg">{user?.name || "Engineer"}</p>
              <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">Level 3 Access</p>
            </div>
          </div>
          
          <div className="space-y-4 pt-1">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
              <p className="text-sm font-semibold text-gray-800">{user?.email}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Department</label>
              <p className="text-sm font-semibold text-gray-800">Route & Crowd Control</p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-5">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#1a2b4b]" />
            <h2 className="text-sm font-bold text-[#1a2b4b] uppercase tracking-wide">Alert Preferences</h2>
          </div>
          
          {[
            { key: "systemAlerts", label: "System Alerts", desc: "Routing engine health and updates" },
            { key: "crowdCritical", label: "Critical Crowd Warnings", desc: "When any location reaches 90% capacity" },
            { key: "offlineNodes", label: "Offline Sensor Nodes", desc: "When IoT people counters drop offline" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <p className="text-sm font-semibold text-[#1a2b4b]">{label}</p>
                <p className="text-[11px] text-gray-400">{desc}</p>
              </div>
              <button
                onClick={() => setNotif(s => ({ ...s, [key]: !s[key as keyof typeof s] }))}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${notif[key as keyof typeof notif] ? "bg-[#1a2b4b]" : "bg-gray-200"}`}
              >
                <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 m-0.5 ${notif[key as keyof typeof notif] ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          ))}
        </div>

        <button onClick={handleSave} className={`w-full py-3.5 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm ${saved ? "bg-emerald-500 text-white" : "bg-[#1a2b4b] text-white hover:bg-[#1a2b4b]/90"}`}>
          <Save className="w-4 h-4" />
          {saved ? "Preferences Saved!" : "Save Preferences"}
        </button>

        <button onClick={handleLogout} className="w-full py-3.5 font-bold text-sm rounded-2xl border border-red-200 text-red-500 flex items-center justify-center gap-2 hover:bg-red-50 transition-colors">
          <LogOut className="w-4 h-4" /> Secure Sign Out
        </button>

      </main>
    </div>
  )
}
