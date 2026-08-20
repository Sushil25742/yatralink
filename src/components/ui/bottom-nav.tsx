"use client"

import * as React from "react"
import { Home, Map, Route, Bookmark, User } from "lucide-react"
import { cn } from "@/utils/cn"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Map", icon: Map, href: "/map" },
  { label: "Journey", icon: Route, href: "/journey" },
  { label: "Bookings", icon: Bookmark, href: "/bookings" },
  { label: "Profile", icon: User, href: "/profile" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[var(--color-brand-secondary)]/10 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-[var(--color-brand-primary)]" : "text-[var(--color-brand-secondary)]/50 hover:text-[var(--color-brand-secondary)]/80"
              )}
            >
              <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
