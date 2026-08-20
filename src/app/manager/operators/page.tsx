"use client"
import React from "react";
import { useManagementState } from "@/components/manager/useManagementState";
import { Badge, money } from "@/components/manager/SharedUI";

export default function OperatorsPage() {
  const { state, loading, error, act } = useManagementState();

  if (loading) return <div style={{padding: '2rem'}}>Loading operators...</div>;
  if (error || !state) return <div style={{padding: '2rem'}}>Error loading operators</div>;

  return (
    <>
      <header className="mc-header">
        <h1>Operators</h1>
        <p>Verify local businesses and experience providers.</p>
      </header>
      <div className="mc-scroll">
        <div className="mc-operator-grid">
          {state.operators.map((o) => (
            <article className="mc-operator-card" key={o.id}>
              <header>
                <span className="mc-avatar">{o.name[0]}</span>
                <div>
                  <h3>{o.business}</h3>
                  <p>
                    {o.name} · {o.email}
                  </p>
                </div>
                <Badge tone={o.status === "Verified" ? "verified" : "moderate"}>
                  {o.status}
                </Badge>
              </header>
              <div className="mc-operator-metrics">
                <span>
                  <b>{o.experiences}</b>Experiences
                </span>
                <span>
                  <b>{o.rating}</b>Rating
                </span>
                <span>
                  <b>{money(o.revenue)}</b>Revenue
                </span>
              </div>
              <button
                className="mc-secondary"
                onClick={() =>
                  act("operator.status", {
                    id: o.id,
                    status: o.status === "Suspended" ? "Verified" : "Suspended",
                  })
                }
              >
                {o.status === "Suspended" ? "Restore" : "Suspend"}
              </button>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
