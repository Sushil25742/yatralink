"use client"

import * as React from "react"
import { User, Bell, Shield, Globe, Palette, Database, LogOut, ChevronRight, Camera, Save } from "lucide-react"

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "regional", label: "Regional", icon: Globe },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "data", label: "Data & Privacy", icon: Database },
]

export default function SettingsPage() {
  const [active, setActive] = React.useState("profile")
  const [saved, setSaved] = React.useState(false)
  const [notifState, setNotifState] = React.useState({
    crowdAlerts: true,
    bookingUpdates: true,
    weeklyReport: true,
    operatorApprovals: false,
    marketingEmails: false,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#102A43]">Settings</h1>
        <p className="text-sm text-gray-500 font-medium mt-0.5">Manage your account and platform preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-56 shrink-0 space-y-1">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                active === id
                  ? "bg-[#086C6E] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {active === id && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
            </button>
          ))}
          <div className="pt-4 border-t border-gray-100 mt-4">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Content Panel */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">

          {/* Profile */}
          {active === "profile" && (
            <>
              <h2 className="text-base font-bold text-[#102A43] border-b border-gray-100 pb-4">Profile Information</h2>
              
              {/* Avatar */}
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#086C6E] to-[#054E50] flex items-center justify-center text-white text-2xl font-black shadow-lg">
                    A
                  </div>
                  <button className="absolute bottom-0 right-0 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
                    <Camera className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                </div>
                <div>
                  <p className="font-bold text-[#102A43]">Admin Manager</p>
                  <p className="text-sm text-gray-400">Lalitpur Heritage Zone</p>
                  <button className="text-xs font-semibold text-[#086C6E] mt-1 hover:underline">Change photo</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "First Name", placeholder: "Admin", value: "Admin" },
                  { label: "Last Name", placeholder: "Manager", value: "Manager" },
                  { label: "Email Address", placeholder: "admin@yatralink.com", value: "admin@yatralink.com" },
                  { label: "Phone Number", placeholder: "+977-9801234567", value: "+977-9801234567" },
                ].map(field => (
                  <div key={field.label} className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{field.label}</label>
                    <input
                      defaultValue={field.value}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#086C6E]/20 focus:border-[#086C6E] transition-all"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Zone / Region</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#086C6E]/20 focus:border-[#086C6E] transition-all bg-white">
                  <option>Lalitpur Heritage Zone</option>
                  <option>Kathmandu Valley Zone</option>
                  <option>Pokhara Region</option>
                  <option>Chitwan Zone</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Bio / Notes</label>
                <textarea
                  rows={3}
                  defaultValue="Managing sustainable tourism for Lalitpur Heritage Zone since 2023."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#086C6E]/20 focus:border-[#086C6E] transition-all resize-none"
                />
              </div>
            </>
          )}

          {/* Notifications */}
          {active === "notifications" && (
            <>
              <h2 className="text-base font-bold text-[#102A43] border-b border-gray-100 pb-4">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { key: "crowdAlerts", label: "Crowd Alerts", desc: "Get notified when crowd levels reach high or critical thresholds" },
                  { key: "bookingUpdates", label: "Booking Updates", desc: "Receive updates when new bookings are made or cancelled" },
                  { key: "weeklyReport", label: "Weekly Report", desc: "Automated weekly summary of all destination performance metrics" },
                  { key: "operatorApprovals", label: "Operator Approvals", desc: "Alerts when new operator applications require your review" },
                  { key: "marketingEmails", label: "Marketing Emails", desc: "Occasional platform updates and feature announcements" },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-start justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <div className="flex-1 mr-6">
                      <p className="text-sm font-semibold text-[#102A43]">{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifState(s => ({ ...s, [key]: !s[key as keyof typeof s] }))}
                      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                        notifState[key as keyof typeof notifState] ? "bg-[#086C6E]" : "bg-gray-200"
                      }`}
                    >
                      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 m-0.5 ${
                        notifState[key as keyof typeof notifState] ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Security */}
          {active === "security" && (
            <>
              <h2 className="text-base font-bold text-[#102A43] border-b border-gray-100 pb-4">Security Settings</h2>
              <div className="space-y-5">
                <div className="p-4 rounded-xl border border-gray-100 space-y-4">
                  <p className="text-sm font-bold text-[#102A43]">Change Password</p>
                  {["Current Password", "New Password", "Confirm New Password"].map(label => (
                    <div key={label} className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{label}</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#086C6E]/20 focus:border-[#086C6E] transition-all" />
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#102A43]">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-400 mt-0.5">Add an extra layer of security to your account</p>
                    </div>
                    <button className="text-sm font-semibold text-[#086C6E] border border-[#086C6E] px-4 py-2 rounded-xl hover:bg-[#086C6E]/5 transition-colors">Enable</button>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-red-100 bg-red-50/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-red-600">Active Sessions</p>
                      <p className="text-xs text-red-400 mt-0.5">2 active sessions — Kathmandu, Nepal</p>
                    </div>
                    <button className="text-sm font-semibold text-red-500 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors">Revoke All</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Regional */}
          {active === "regional" && (
            <>
              <h2 className="text-base font-bold text-[#102A43] border-b border-gray-100 pb-4">Regional Preferences</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Language", options: ["English", "Nepali (नेपाली)", "Hindi", "Chinese"] },
                  { label: "Timezone", options: ["Asia/Kathmandu (NPT, UTC+5:45)", "Asia/Kolkata (IST)", "UTC"] },
                  { label: "Date Format", options: ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"] },
                  { label: "Currency", options: ["NPR — Nepali Rupee", "USD — US Dollar", "EUR — Euro"] },
                ].map(({ label, options }) => (
                  <div key={label} className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{label}</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#086C6E]/20 focus:border-[#086C6E] bg-white transition-all">
                      {options.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Appearance */}
          {active === "appearance" && (
            <>
              <h2 className="text-base font-bold text-[#102A43] border-b border-gray-100 pb-4">Appearance</h2>
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-bold text-[#102A43] mb-3">Color Theme</p>
                  <div className="flex gap-3">
                    {[
                      { label: "Teal (Default)", color: "bg-[#086C6E]", active: true },
                      { label: "Crimson", color: "bg-red-600", active: false },
                      { label: "Indigo", color: "bg-indigo-600", active: false },
                      { label: "Amber", color: "bg-amber-500", active: false },
                    ].map(theme => (
                      <button key={theme.label} className={`flex flex-col items-center gap-2 group`}>
                        <div className={`w-10 h-10 rounded-xl ${theme.color} shadow-sm ${theme.active ? "ring-2 ring-offset-2 ring-[#086C6E]" : "hover:scale-105 transition-transform"}`} />
                        <span className="text-[11px] font-semibold text-gray-500">{theme.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#102A43] mb-3">Mode</p>
                  <div className="flex gap-3">
                    {["Light", "Dark", "System"].map(mode => (
                      <button key={mode} className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${mode === "Light" ? "bg-[#086C6E] text-white border-[#086C6E]" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-bold text-[#102A43]">Sidebar Density</p>
                  <div className="flex gap-3">
                    {["Comfortable", "Compact"].map(d => (
                      <button key={d} className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${d === "Comfortable" ? "bg-[#086C6E] text-white border-[#086C6E]" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Data & Privacy */}
          {active === "data" && (
            <>
              <h2 className="text-base font-bold text-[#102A43] border-b border-gray-100 pb-4">Data & Privacy</h2>
              <div className="space-y-4">
                {[
                  { label: "Export My Data", desc: "Download a copy of all your account data and activity logs as a CSV or JSON file.", btn: "Export", btnStyle: "border-gray-200 text-gray-700 hover:bg-gray-50" },
                  { label: "Analytics Data Sharing", desc: "Allow anonymized usage data to be shared to improve the platform.", btn: "Enabled", btnStyle: "bg-emerald-100 text-emerald-700 border-emerald-200" },
                  { label: "Delete Account", desc: "Permanently delete your account and all associated data. This action cannot be undone.", btn: "Delete", btnStyle: "border-red-200 text-red-500 hover:bg-red-50" },
                ].map(({ label, desc, btn, btnStyle }) => (
                  <div key={label} className={`p-4 rounded-xl border ${label === "Delete Account" ? "border-red-100 bg-red-50/30" : "border-gray-100"}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className={`text-sm font-bold ${label === "Delete Account" ? "text-red-600" : "text-[#102A43]"}`}>{label}</p>
                        <p className="text-xs text-gray-400 mt-0.5 max-w-md">{desc}</p>
                      </div>
                      <button className={`text-sm font-semibold border px-4 py-2 rounded-xl shrink-0 transition-colors ${btnStyle}`}>{btn}</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Save Button */}
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                saved
                  ? "bg-emerald-500 text-white"
                  : "bg-[#086C6E] text-white hover:bg-[#086C6E]/90 shadow-sm"
              }`}
            >
              <Save className="w-4 h-4" />
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
