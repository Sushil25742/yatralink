"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"

const slides = [
  {
    id: "splash",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "slide1",
    image: "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&q=80&w=1200",
    title: "Discover Authentic Nepal",
    description: "Find unique homestays and immersive cultural experiences off the beaten path.",
  },
  {
    id: "slide2",
    image: "https://images.unsplash.com/photo-1588614959060-4d144f28b2ea?auto=format&fit=crop&q=80&w=1200",
    title: "Journey with Confidence",
    description: "Verified hosts, secure bookings, and 24/7 community support for your peace of mind.",
  }
]

export default function WelcomePage() {
  const router = useRouter()
  const [step, setStep] = useState(0)

  // Auto-progress splash screen after 2.5s
  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => {
        setStep(1)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [step])

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(prev => prev + 1)
    } else {
      router.push("/login")
    }
  }

  const handleSkip = () => {
    router.push("/login")
  }

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-black font-sans">
      <AnimatePresence initial={false}>
        <motion.div
          key={step}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <Image
            src={slides[step].image}
            alt="Background"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          {/* Subtle overlay to make text readable */}
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Splash Screen Content */}
      <AnimatePresence>
        {step === 0 && (
          <motion.div
            className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-24 px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl font-extrabold text-white mb-24 tracking-tight drop-shadow-lg">
              YatraLink
            </h1>
            <p className="text-white text-lg font-medium drop-shadow-md tracking-wide">
              Authentic Nepal, Locally Lived
            </p>
            <div className="mt-8 flex gap-2">
              <motion.div 
                className="w-12 h-1 bg-white/50 rounded-full overflow-hidden"
              >
                <motion.div 
                  className="h-full bg-white"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, ease: "linear" }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onboarding Sliders (Step 1 & 2) */}
      <AnimatePresence>
        {step > 0 && (
          <motion.div
            className="absolute inset-0 z-20 flex flex-col justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Top Bar */}
            <div className="flex justify-between items-center px-6 py-12">
              <h2 className="text-2xl font-bold text-[var(--color-brand-primary)] drop-shadow-sm">YatraLink</h2>
              <button 
                onClick={handleSkip}
                className="text-[var(--color-brand-secondary)] font-semibold text-sm hover:opacity-80 transition-opacity bg-white/80 px-4 py-1.5 rounded-full backdrop-blur-sm"
              >
                Skip
              </button>
            </div>

            {/* Bottom Card */}
            <motion.div 
              className="bg-white/95 backdrop-blur-md rounded-t-[32px] px-6 py-10 flex flex-col items-center text-center shadow-2xl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200, delay: 0.1 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8"
                >
                  <h3 className="text-3xl font-extrabold text-[var(--color-brand-secondary)] mb-4 tracking-tight leading-tight">
                    {slides[step].title}
                  </h3>
                  <p className="text-[var(--color-brand-secondary)]/70 text-base font-medium leading-relaxed max-w-sm mx-auto px-4">
                    {slides[step].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Pagination Dots */}
              <div className="flex justify-center gap-2 mb-8">
                {[1, 2].map((idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      step === idx ? "w-8 bg-[var(--color-brand-primary)]" : "w-2 bg-[var(--color-brand-primary)]/20"
                    }`}
                  />
                ))}
              </div>

              {/* Action Button */}
              <button 
                onClick={handleNext}
                className="w-full bg-[var(--color-brand-primary)] text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-[var(--color-brand-primary)]/90 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {step === 1 ? "Next" : "Get Started"}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
