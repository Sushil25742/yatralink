"use client"
import React, { useState } from "react";
import { useManagementState } from "@/components/manager/useManagementState";
import { Stat, money, download } from "@/components/manager/SharedUI";
import { ShieldCheck, TicketCheck, CircleDollarSign, BookOpen, Store, ArrowDownToLine } from "lucide-react";

export default function AnalyticsPage() {
  const { state, loading, error } = useManagementState();
  const [range, setRange] = useState("7 days");

  if (loading) return <div style={{padding: '2rem'}}>Loading analytics...</div>;
  if (error || !state) return <div style={{padding: '2rem'}}>Error loading analytics</div>;

  const revenue = state.bookings
    .filter((x) => !["Cancelled", "Refunded"].includes(x.status))
    .reduce((s, b) => s + b.amount, 0);

  return (
    <>
      <header className="mc-header">
        <h1>Analytics</h1>
        <p>Prototype analytics are clearly labeled where simulated.</p>
      </header>
      <div className="mc-scroll">
        <div className="mc-demo-banner">
          <ShieldCheck />
          <div>
            <strong>DEMO ANALYTICS</strong>
            <span>
              Booking value uses shared prototype records. Funnel and
              alternative-acceptance metrics below are illustrative until event
              tracking is connected.
            </span>
          </div>
        </div>
        <div className="mc-analytics-toolbar">
          <div className="mc-segment">
            {["7 days", "30 days", "90 days"].map((r) => (
              <button
                key={r}
                className={range === r ? "active" : ""}
                onClick={() => setRange(r)}
              >
                {r}
              </button>
            ))}
          </div>
          <button
            className="mc-secondary"
            onClick={() =>
              download("yatralink-analytics.csv", [
                ["Metric", "Value"],
                ["Bookings", String(state.bookings.length)],
                ["Booking value", String(revenue)],
              ])
            }
          >
            <ArrowDownToLine />
            Export CSV
          </button>
        </div>
        <div className="mc-stats">
          <Stat
            icon={<TicketCheck />}
            value={String(state.bookings.length)}
            label="Shared bookings"
          />
          <Stat
            icon={<CircleDollarSign />}
            value={money(revenue)}
            label="Booking value"
          />
          <Stat
            icon={<BookOpen />}
            value={String(state.experiences.length)}
            label="Inventory"
          />
          <Stat
            icon={<Store />}
            value={String(
              state.operators.filter((o) => o.status === "Verified").length,
            )}
            label="Verified operators"
          />
        </div>
        <div className="mc-dashboard-grid">
          <section className="mc-card">
            <h2>Illustrative booking funnel</h2>
            <div className="mc-funnel">
              <span>
                <b>9,840</b>Place views
              </span>
              <span>
                <b>3,420</b>Experience views
              </span>
              <span>
                <b>812</b>Booking starts
              </span>
              <span>
                <b>312</b>Completed
              </span>
            </div>
          </section>
          <section className="mc-card">
            <h2>Illustrative redistribution</h2>
            <div className="mc-big-metric">
              <strong>38%</strong>
              <span>demo alternative acceptance</span>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
