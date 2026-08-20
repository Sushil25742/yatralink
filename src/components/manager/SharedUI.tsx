import React from "react";
import { X, Search } from "lucide-react";
import { State, Place, Experience, Booking, Operator, CrowdSite, Slot, Review } from "./useManagementState";

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: string; }) {
  return <span className={`mc-badge mc-badge--${tone}`}>{children}</span>;
}

export function Stat({ icon, value, label, delta }: { icon: React.ReactNode; value: string; label: string; delta?: string; }) {
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

export function Drawer({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode; }) {
  return (
    <div
      className="mc-drawer-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <aside className="mc-drawer">
        <header>
          <h2>{title}</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </header>
        {children}
      </aside>
    </div>
  );
}

export function Toolbar({ q, setQ, children }: { q: string; setQ: (q: string) => void; children?: React.ReactNode; }) {
  return (
    <div className="mc-toolbar">
      <div className="mc-search">
        <Search />
        <input
          placeholder="Search items…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {children}
    </div>
  );
}

export const money = (n: number) => `NPR ${Math.round(n).toLocaleString()}`;
export const crowdClass = (x: string) => x.toLowerCase().replace(/\s+/g, "-");
export const kathmanduDate = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

export function download(name: string, rows: string[][]) {
  const csv = rows
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const u = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = u;
  a.download = name;
  a.click();
  URL.revokeObjectURL(u);
}
