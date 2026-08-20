"use client"

import React, { useState } from "react"
import { motion, Variants } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate signup delay then redirect
    setTimeout(() => {
      setLoading(false)
      alert("Account created successfully! Please login.")
      router.push("/login")
    }, 800)
  }

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  }
  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col pt-12 px-6 font-sans overflow-y-auto pb-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center mb-10"
      >
        <h1 className="text-2xl font-extrabold text-[var(--color-brand-primary)] tracking-tight mb-4">
          YatraLink
        </h1>
        <h2 className="text-3xl font-bold text-[#1a2b4b] tracking-tight mb-2">Create Account</h2>
        <p className="text-[var(--color-brand-secondary)]/60 font-medium text-[15px] text-center max-w-[280px]">
          Join us to travel better, support locals, and preserve heritage.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-4 w-full max-w-sm mx-auto"
      >
        {/* Social Buttons */}
        <div className="flex gap-3">
          <motion.button variants={item} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors font-semibold text-[14px] text-[#1a2b4b]">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </motion.button>
          <motion.button variants={item} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors font-semibold text-[14px] text-[#1a2b4b]">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.641-.026 2.669-1.48 3.666-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.702z"/>
            </svg>
            Apple
          </motion.button>
        </div>

        <motion.div variants={item} className="flex items-center gap-4 my-1">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs font-semibold text-gray-400 tracking-wider">OR REGISTER WITH EMAIL</span>
          <div className="flex-1 h-px bg-gray-200" />
        </motion.div>

        {/* Form */}
        <motion.form variants={item} onSubmit={handleSignUp} className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#1a2b4b]">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)] transition-all placeholder:text-gray-400 text-[15px]"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#1a2b4b]">Email address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)] transition-all placeholder:text-gray-400 text-[15px]"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#1a2b4b]">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)] transition-all placeholder:text-gray-400 text-[15px]"
              required
              minLength={6}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#1a2b4b]">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/20 focus:border-[var(--color-brand-primary)] transition-all placeholder:text-gray-400 text-[15px]"
              required
              minLength={6}
            />
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-xs font-semibold text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || (password !== confirmPassword && confirmPassword !== "")}
            className="w-full mt-2 bg-[var(--color-brand-primary)] text-white font-bold text-[15px] py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(195,59,34,0.39)] hover:bg-[var(--color-brand-primary)]/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:shadow-none"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Create Account <ArrowRight className="w-5 h-5" /></>
            )}
          </motion.button>
        </motion.form>

        <motion.div variants={item} className="mt-2 text-center">
          <p className="text-[14px] font-medium text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--color-brand-primary)] font-semibold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
