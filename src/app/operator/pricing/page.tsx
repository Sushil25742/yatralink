"use client"

import * as React from "react"
import { ArrowLeft, Pencil, Save, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

const initialPricing = [
  { id: 1, experience: "Traditional Woodcarving Workshop", basePrice: "2500", groupDiscount: "10", seasonalMultiplier: "1.2", active: true },
  { id: 2, experience: "Village Cooking Class", basePrice: "1800", groupDiscount: "15", seasonalMultiplier: "1.0", active: true },
  { id: 3, experience: "Sunset Heritage Walk", basePrice: "1200", groupDiscount: "5", seasonalMultiplier: "1.1", active: false },
]

export default function OperatorPricingPage() {
  const router = useRouter()
  const [pricing, setPricing] = React.useState(initialPricing)
  const [editing, setEditing] = React.useState<number | null>(null)
  const [saved, setSaved] = React.useState(false)

  const handleSave = () => {
    setEditing(null)
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
          <h1 className="text-xl font-bold">Pricing</h1>
        </div>
        <p className="text-sm text-white/60 ml-12">Set rates, discounts and seasonal pricing</p>
      </div>

      <main className="px-5 py-6 space-y-4 max-w-lg mx-auto">

        {/* Info Banner */}
        <div className="bg-[#086C6E]/10 border border-[#086C6E]/20 rounded-2xl p-4">
          <p className="text-xs font-semibold text-[#086C6E]">💡 Tip: Group discounts apply automatically for 4+ guests. Seasonal multiplier affects peak season pricing.</p>
        </div>

        {pricing.map(item => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-[#102A43] text-sm flex-1 mr-3">{item.experience}</h3>
              <div className="flex gap-2">
                <button onClick={() => setEditing(editing === item.id ? null : item.id)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#086C6E]/10 transition-colors">
                  <Pencil className="w-3.5 h-3.5 text-gray-600" />
                </button>
                <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-50 transition-colors">
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            </div>

            {editing === item.id ? (
              <div className="space-y-3">
                {[
                  { label: "Base Price (NPR per person)", key: "basePrice", prefix: "NPR" },
                  { label: "Group Discount (%)", key: "groupDiscount", prefix: "%" },
                  { label: "Seasonal Multiplier", key: "seasonalMultiplier", prefix: "×" },
                ].map(({ label, key, prefix }) => (
                  <div key={key} className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{label}</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-400 w-8">{prefix}</span>
                      <input
                        type="number"
                        value={item[key as keyof typeof item] as string}
                        onChange={e => setPricing(p => p.map(x => x.id === item.id ? { ...x, [key]: e.target.value } : x))}
                        className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#086C6E]/20 focus:border-[#086C6E]"
                      />
                    </div>
                  </div>
                ))}
                <button onClick={handleSave} className="w-full py-2.5 bg-[#086C6E] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-[#086C6E]/90 transition-colors">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Base Price</p>
                  <p className="text-base font-black text-[#102A43]">NPR {Number(item.basePrice).toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Group Disc.</p>
                  <p className="text-base font-black text-[#102A43]">{item.groupDiscount}%</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Seasonal</p>
                  <p className="text-base font-black text-[#102A43]">×{item.seasonalMultiplier}</p>
                </div>
              </div>
            )}
          </div>
        ))}

        {saved && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-lg">
            ✓ Pricing saved
          </div>
        )}
      </main>
    </div>
  )
}
