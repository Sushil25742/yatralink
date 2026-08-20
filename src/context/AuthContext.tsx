"use client"

import React, { createContext, useContext, useState } from "react"

// ── User definitions ──────────────────────────────────────────────────────────
export type UserRole = "traveller" | "operator" | "admin" | "engineer"

export interface AuthUser {
  name: string
  email: string
  role: UserRole
  avatar: string
}

const USERS: (AuthUser & { password: string })[] = [
  { name: "Harry", email: "hary123@gmail.com", password: "123456", role: "traveller", avatar: "H" },
  { name: "Pratima", email: "pratima@gmail.com", password: "123456", role: "traveller", avatar: "P" },
  { name: "Asim", email: "asim@operator.com", password: "123456", role: "operator", avatar: "A" },
  { name: "Sushil", email: "sushil@admin.com", password: "sushil@123456", role: "admin", avatar: "S" },
  { name: "Hemanta", email: "hemanta@engineer.com", password: "1234567", role: "engineer", avatar: "H" },
]

export const ROLE_HOME: Record<UserRole, string> = {
  traveller: "/",
  operator: "/operator",
  admin: "/manager",
  engineer: "/engineer",
}

// ── Auth Context ──────────────────────────────────────────────────────────────
interface AuthContextType {
  user: AuthUser | null
  login: (email: string, password: string) => { success: boolean; error?: string }
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null
    try {
      const saved = localStorage.getItem("yatralink_user")
      return saved ? (JSON.parse(saved) as AuthUser) : null
    } catch { return null }
  })

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const match = USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!match) return { success: false, error: "Invalid email or password" }
    const { password: _pw, ...authUser } = match
    void _pw
    setUser(authUser)
    localStorage.setItem("yatralink_user", JSON.stringify(authUser))
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("yatralink_user")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
