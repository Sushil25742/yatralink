"use client"
import React from "react";
import { useRouter } from "next/navigation";
import { useManagementState } from "@/components/manager/useManagementState";
import {
  Activity,
  ChevronRight,
  CircleDollarSign,
  Star,
  TicketCheck,
  Users,
  BookOpen
} from "lucide-react";

const money = (n: number) => `NPR ${Math.round(n).toLocaleString()}`;
const crowdClass = (x: string) => x.toLowerCase().replace(/\s+/g, "-");
const kathmanduDate = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: string; }) {
  return <span className={`mc-badge mc-badge--${tone}`}>{children}</span>;
}

function Stat({ icon, value, label, delta }: { icon: React.ReactNode; value: string; label: string; delta?: string; }) {
  return (
    <div className="mc-stat">
      <span>{icon}</span>
      <div>
        <strong>{value}</strong>
        <small>{label}</small>
      </div>
      {delta && <em>{delta}</em>}
    </div>
  );
}

function AdminOverview({ state, nav }: any) {
  const revenue = state.bookings
    .filter((b: any) => !["Cancelled", "Refunded"].includes(b.status))
    .reduce((s: number, b: any) => s + b.amount, 0);

  return (
    <>
      <div className="mc-stats">
        <Stat
          icon={<Users />}
          value={state.places.reduce((s: number, p: any) => s + p.visits, 0).toLocaleString()}
          label="Prototype visitors"
        />
        <Stat icon={<TicketCheck />} value={String(state.bookings.length)} label="Bookings" />
        <Stat icon={<CircleDollarSign />} value={money(revenue)} label="Booking value" />
        <Stat
          icon={<Activity />}
          value={String(Math.max(...state.crowdSites.map((x: any) => x.score), 0))}
          label="Peak crowd score"
        />
      </div>
      <div className="mc-dashboard-grid">
        <section className="mc-card">
          <div className="mc-card__head">
            <div>
              <small>LIVE / DEMO SIGNALS</small>
              <h2>Destination pressure</h2>
            </div>
            <button onClick={() => nav("/manager/crowd")}>Open monitor <ChevronRight /></button>
          </div>
          {state.crowdSites.map((s: any) => (
            <div className="mc-site-line" key={s.id}>
              <div>
                <strong>{s.name}</strong>
                <small>{s.source || "Demo estimate"} · {s.wait}</small>
              </div>
              <Badge tone={crowdClass(s.level)}>{s.level}</Badge>
              <b>{s.score}</b>
            </div>
          ))}
        </section>
        <section className="mc-card">
          <div className="mc-card__head">
            <div>
              <small>MODERATION</small>
              <h2>Needs attention</h2>
            </div>
          </div>
          <button className="mc-task" onClick={() => nav("/manager/experiences")}>
            <BookOpen />
            <span>
              <b>
                {state.experiences.filter((x: any) => x.status === "Pending").length} pending experiences
              </b>
              <small>Admin approval required</small>
            </span>
            <ChevronRight />
          </button>
          <button className="mc-task" onClick={() => nav("/manager/bookings")}>
            <TicketCheck />
            <span>
              <b>
                {state.bookings.filter((x: any) => x.status === "Pending").length} booking exceptions
              </b>
              <small>Review status</small>
            </span>
            <ChevronRight />
          </button>
        </section>
      </div>
    </>
  );
}

function OperatorOverview({ state, operator, nav }: any) {
  const today = state.bookings.filter((x: any) => x.date === kathmanduDate());
  return (
    <>
      <div className="mc-stats">
        <Stat icon={<TicketCheck />} value={String(today.length)} label="Bookings today" />
        <Stat icon={<CircleDollarSign />} value={money(today.reduce((s: number, b: any) => s + b.amount, 0))} label="Revenue today" />
        <Stat icon={<Users />} value={String(today.reduce((s: number, b: any) => s + b.guests, 0))} label="Guests today" />
        <Stat icon={<Star />} value={String(operator?.rating || 0)} label="Guest rating" />
      </div>
      <section className="mc-card">
        <div className="mc-card__head">
          <div>
            <small>NEPAL LOCAL DATE · {kathmanduDate()}</small>
            <h2>Guest schedule</h2>
          </div>
          <button onClick={() => nav("/manager/bookings")}>All bookings <ChevronRight /></button>
        </div>
        {today.length ? (
          today.map((b: any) => (
            <div className="mc-guest-line" key={b.id}>
              <time>{b.time}</time>
              <span className="mc-avatar small">{b.guest[0]}</span>
              <div>
                <strong>{b.guest}</strong>
                <small>{b.guests} guests · {b.id}</small>
              </div>
              <Badge tone="verified">{b.status}</Badge>
            </div>
          ))
        ) : (
          <div className="mc-empty">
            <TicketCheck />
            <p>No bookings scheduled for today.</p>
          </div>
        )}
      </section>
    </>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { state, user, loading, error } = useManagementState();

  if (loading) return <div style={{padding: '2rem'}}>Loading dashboard...</div>;
  if (error || !state || !user) return <div style={{padding: '2rem'}}>Error loading dashboard</div>;

  const handleNav = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <header className="mc-header">
        <h1>Overview</h1>
        <div className="mc-profile-stub">
          <span>{user.name[0].toUpperCase()}</span>
          {user.name}
        </div>
      </header>
      <div className="mc-scroll">
        {user.role === "superadmin" ? (
          <AdminOverview state={state} nav={handleNav} />
        ) : (
          <OperatorOverview state={state} operator={state.operators[0]} nav={handleNav} />
        )}
      </div>
    </>
  );
}
