import * as React from "react"
import Link from "next/link"
import { 
  LayoutDashboard, 
  Map, 
  Users, 
  Ticket, 
  CalendarCheck, 
  Store, 
  LineChart, 
  Heart, 
  Settings 
} from "lucide-react"

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#102A43] text-white flex flex-col shrink-0 h-screen sticky top-0">
        <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
          <span className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <div className="w-6 h-6 bg-[#D6A84B] rounded flex items-center justify-center">
              <span className="text-[#102A43] text-xs font-black">Y</span>
            </div>
            YatraLink <span className="text-white/60 font-medium text-sm ml-1">Manager</span>
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
          <NavItem href="/manager" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" />
          <NavItem href="/manager/places" icon={<Map className="w-4 h-4" />} label="Places" />
          <NavItem href="/manager/crowd" icon={<Users className="w-4 h-4" />} label="Crowd Monitor" />
          <NavItem href="/manager/experiences" icon={<Ticket className="w-4 h-4" />} label="Experiences" />
          <NavItem href="/manager/bookings" icon={<CalendarCheck className="w-4 h-4" />} label="Bookings" />
          <NavItem href="/manager/operators" icon={<Store className="w-4 h-4" />} label="Local Operators" />
          <NavItem href="/manager/analytics" icon={<LineChart className="w-4 h-4" />} label="Analytics" />
          <NavItem href="/manager/impact" icon={<Heart className="w-4 h-4" />} label="Impact" />
        </div>
        
        <div className="p-3 border-t border-white/10 shrink-0">
          <NavItem href="/manager/settings" icon={<Settings className="w-4 h-4" />} label="Settings" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto h-screen">
        {children}
      </main>

    </div>
  )
}

function NavItem({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  const active = typeof window !== 'undefined' ? window.location.pathname === href : false;
  return (
    <Link 
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
        active 
          ? 'bg-[#086C6E] text-white shadow-sm' 
          : 'text-white/70 hover:bg-white/5 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </Link>
  )
}

