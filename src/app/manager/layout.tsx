"use client"
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/platform";
import { 
  Activity, BarChart3, BookOpen, CalendarDays, CircleDollarSign, 
  Home, LayoutDashboard, MapPin, Star, Store, TicketCheck, Users, X 
} from "lucide-react";
import "@/components/ref/management.css";

const SESSION_KEY = "yatralink_vercel_session";

function Brand() {
  return (
    <div className="mc-brand">
      <span>
        <MapPin />
      </span>
      <strong>
        Yatra<b>Link</b>
      </strong>
    </div>
  );
}

function SidebarAdmin({ active, nav, logout }: any) {
  const items = [
    ["/manager", "Overview", <LayoutDashboard key="1" />],
    ["/manager/places", "Places", <MapPin key="2" />],
    ["/manager/experiences", "Experiences", <BookOpen key="3" />],
    ["/manager/bookings", "Bookings", <TicketCheck key="4" />],
    ["/manager/operators", "Operators", <Users key="5" />],
    ["/manager/crowd", "Crowd", <Activity key="6" />],
    ["/manager/analytics", "Analytics", <BarChart3 key="7" />],
    ["/manager/impact", "Impact", <Star key="8" />],
  ];
  return (
    <aside className="mc-sidebar">
      <div className="mc-sidebar__head">
        <Brand />
        <small>Destination Manager</small>
      </div>
      <nav>
        {items.map(([v, l, i]) => (
          <button
            key={v as string}
            className={active === v ? "active" : ""}
            onClick={() => nav(v)}
          >
            {i}
            <span>{l}</span>
          </button>
        ))}
      </nav>
      <div className="mc-sidebar__foot">
        <button onClick={() => nav("/manager/settings")} className="mb-2 w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-md text-slate-300">
          <Activity size={18} /> Settings
        </button>
        <button onClick={logout}>
          <X />
          Sign out
        </button>
      </div>
    </aside>
  );
}

function SidebarOperator({ active, nav, logout }: any) {
  const items = [
    ["/manager", "Overview", <Home key="1" />],
    ["/manager/experiences", "My Experiences", <Store key="2" />],
    ["/manager/bookings", "Bookings", <TicketCheck key="3" />],
    ["/manager/calendar", "Calendar", <CalendarDays key="4" />],
    ["/manager/earnings", "Earnings", <CircleDollarSign key="5" />],
    ["/manager/reviews", "Reviews", <Star key="6" />],
  ];
  return (
    <aside className="mc-sidebar mc-sidebar--operator">
      <div className="mc-sidebar__head">
        <Brand />
        <small>Operator Studio</small>
      </div>
      <nav>
        {items.map(([v, l, i]) => (
          <button
            key={v as string}
            className={active === v ? "active" : ""}
            onClick={() => nav(v)}
          >
            {i}
            <span>{l}</span>
          </button>
        ))}
      </nav>
      <div className="mc-sidebar__foot">
        <button onClick={() => nav("/manager/settings")} className="mb-2 w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-md text-slate-300">
          <Activity size={18} /> Settings
        </button>
        <button onClick={logout}>
          <X />
          Sign out
        </button>
      </div>
    </aside>
  );
}

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY) || "";
    if (!saved) {
      router.push("/auth");
      return;
    }
    api
      .get("/api/demo-auth/session", { session_id: saved })
      .then(({ data }) => {
        if (data.user.role !== "superadmin" && data.user.role !== "operator") {
          router.push("/");
          return;
        }
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem(SESSION_KEY);
        router.push("/auth");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleNav = (path: string) => {
    router.push(path);
  };

  const logout = async () => {
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (sessionId) {
      await api.post("/api/demo-auth/logout", { session_id: sessionId }).catch(() => {});
    }
    localStorage.removeItem(SESSION_KEY);
    router.push("/auth");
  };

  if (loading || !user) {
    return <div className="mc-app"><div style={{padding: '2rem'}}>Loading workspace...</div></div>;
  }

  return (
    <div className="mc-app">
      {user.role === "superadmin" ? (
        <SidebarAdmin active={pathname} nav={handleNav} logout={logout} />
      ) : (
        <SidebarOperator active={pathname} nav={handleNav} logout={logout} />
      )}
      <main className="mc-content">
        {children}
      </main>
    </div>
  );
}
