"use client"

import * as React from "react"
import { ArrowLeft, Star, ThumbsUp, MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"

const reviews = [
  { id: 1, guest: "Sarah M.", avatar: "S", rating: 5, date: "Aug 20, 2026", experience: "Woodcarving Workshop", comment: "An absolutely incredible experience! The craft master was incredibly patient and the workshop was very well organised. I learned so much and left with a beautiful piece I carved myself." },
  { id: 2, guest: "Raj S.", avatar: "R", rating: 5, date: "Aug 18, 2026", experience: "Woodcarving Workshop", comment: "Highly recommend this! The host was super welcoming and made the session really interactive. Worth every rupee." },
  { id: 3, guest: "Liu W.", avatar: "L", rating: 4, date: "Aug 15, 2026", experience: "Woodcarving Workshop", comment: "Great experience overall. It would be even better with a bit more time allocated for the finishing steps." },
  { id: 4, guest: "Emma J.", avatar: "E", rating: 5, date: "Aug 12, 2026", experience: "Woodcarving Workshop", comment: "One of the best activities I've done in Nepal. Authentic, intimate, and truly memorable." },
  { id: 5, guest: "Carlos R.", avatar: "C", rating: 3, date: "Aug 10, 2026", experience: "Village Cooking Class", comment: "Good experience, but the session ran a bit late. The food we cooked was delicious though!" },
]

export default function OperatorReviewsPage() {
  const router = useRouter()
  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      <div className="bg-[#102A43] pt-14 pb-8 px-5 rounded-b-[32px] text-white shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Reviews</h1>
        </div>

        {/* Rating Summary */}
        <div className="flex items-center gap-5 ml-12">
          <div>
            <p className="text-4xl font-black">{avgRating}</p>
            <div className="flex items-center gap-0.5 mt-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-3.5 h-3.5 ${parseFloat(avgRating) >= i ? "fill-amber-400 text-amber-400" : "text-white/30"}`} />
              ))}
            </div>
            <p className="text-[11px] text-white/50 mt-1">{reviews.length} reviews</p>
          </div>
          <div className="flex-1 space-y-1">
            {[5,4,3,2,1].map(star => {
              const count = reviews.filter(r => r.rating === star).length
              const pct = (count / reviews.length) * 100
              return (
                <div key={star} className="flex items-center gap-2 text-[10px] text-white/60">
                  <span className="w-3 text-right">{star}</span>
                  <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-3">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <main className="px-5 py-6 space-y-3 max-w-lg mx-auto">
        {reviews.map(review => (
          <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#086C6E] flex items-center justify-center text-white font-black text-sm">
                  {review.avatar}
                </div>
                <div>
                  <p className="font-bold text-[#102A43]">{review.guest}</p>
                  <p className="text-[10px] text-gray-400">{review.experience} · {review.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-3 h-3 ${review.rating >= i ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
            <div className="flex items-center gap-3 pt-1 border-t border-gray-50">
              <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-[#086C6E] transition-colors">
                <ThumbsUp className="w-3.5 h-3.5" /> Helpful
              </button>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-[#086C6E] transition-colors">
                <MessageCircle className="w-3.5 h-3.5" /> Reply
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
