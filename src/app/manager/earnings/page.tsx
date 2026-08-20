"use client"
import React from "react";
import { useManagementState } from "@/components/manager/useManagementState";
import { Stat, money, download } from "@/components/manager/SharedUI";
import { CircleDollarSign, TrendingUp, TicketCheck, Star, ArrowDownToLine } from "lucide-react";

export default function EarningsPage() {
  const { state, loading, error } = useManagementState();

  if (loading) return <div style={{padding: '2rem'}}>Loading earnings...</div>;
  if (error || !state) return <div style={{padding: '2rem'}}>Error loading earnings</div>;

  const active = state.bookings.filter(
    (x) => !["Cancelled", "Refunded"].includes(x.status),
  );
  const gross = active.reduce((s, b) => s + b.amount, 0);

  return (
    <>
      <header className="mc-header">
        <h1>Earnings</h1>
        <p>Track your revenue, payouts and active bookings.</p>
      </header>
      <div className="mc-scroll">
        <div className="mc-stats">
          <Stat
            icon={<CircleDollarSign />}
            value={money(gross)}
            label="Gross booking value"
          />
          <Stat
            icon={<TrendingUp />}
            value={money(gross * 0.88)}
            label="Estimated payout"
          />
          <Stat
            icon={<TicketCheck />}
            value={String(active.length)}
            label="Active bookings"
          />
          <Stat icon={<Star />} value="4.8" label="Average rating" />
        </div>
        <button
          className="mc-secondary"
          onClick={() =>
            download("operator-statement.csv", [
              ["Booking", "Guest", "Amount", "Status"],
              ...active.map((b) => [b.id, b.guest, String(b.amount), b.status]),
            ])
          }
        >
          <ArrowDownToLine />
          Download statement
        </button>
      </div>
    </>
  );
}
