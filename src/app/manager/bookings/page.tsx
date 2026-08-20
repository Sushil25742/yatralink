"use client"
import React, { useState } from "react";
import { useManagementState, Booking } from "@/components/manager/useManagementState";
import { Drawer, money } from "@/components/manager/SharedUI";
import { Eye } from "lucide-react";

export default function BookingsPage() {
  const { state, user, loading, error, act } = useManagementState();
  const [selected, setSelected] = useState<Booking | null>(null);

  if (loading) return <div style={{padding: '2rem'}}>Loading bookings...</div>;
  if (error || !state || !user) return <div style={{padding: '2rem'}}>Error loading bookings</div>;

  const admin = user.role === "superadmin";
  const bookings = admin
    ? state.bookings
    : state.bookings.filter((b) => b.operatorId === state.operators[0]?.id);

  return (
    <>
      <header className="mc-header">
        <h1>Bookings</h1>
        <p>{admin ? "Track reservations and guest status." : "Review upcoming reservations and manage check-ins."}</p>
      </header>
      <div className="mc-scroll">
        <div className="mc-table-card">
          <table>
            <thead>
              <tr>
                <th>Booking</th>
                <th>Guest</th>
                <th>Experience</th>
                <th>Date & time</th>
                <th>Value</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.guest}</td>
                  <td>
                    {b.experienceTitle ||
                      state.experiences.find((e) => e.id === b.experienceId)?.title}
                  </td>
                  <td>
                    {b.date}
                    <small>{b.time}</small>
                  </td>
                  <td>{money(b.amount)}</td>
                  <td>{b.status}</td>
                  <td>
                    <button className="mc-icon" onClick={() => setSelected(b)}>
                      <Eye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selected && (
          <Drawer title={selected.id} onClose={() => setSelected(null)}>
            <div className="mc-form">
              <strong>{selected.guest}</strong>
              <p>{selected.experienceTitle || state.experiences.find(e => e.id === selected.experienceId)?.title}</p>
              {!admin && selected.status === "Confirmed" && (
                <>
                  <button
                    className="mc-primary"
                    onClick={async () => {
                      await act("booking.status", {
                        id: selected.id,
                        status: "Checked In",
                      });
                      setSelected(null);
                    }}
                  >
                    Check in guest
                  </button>
                  <button
                    className="mc-secondary"
                    onClick={async () => {
                      await act("booking.status", {
                        id: selected.id,
                        status: "No Show",
                      });
                      setSelected(null);
                    }}
                  >
                    Mark no-show
                  </button>
                </>
              )}
              {admin && !["Cancelled", "Refunded"].includes(selected.status) && (
                <button
                  className="mc-secondary danger-text"
                  style={{ color: "#d9514e" }}
                  onClick={async () => {
                    await act("booking.status", {
                      id: selected.id,
                      status: "Cancelled",
                    });
                    setSelected(null);
                  }}
                >
                  Cancel and restore seats
                </button>
              )}
              {admin && selected.status === "Cancelled" && (
                <button
                  className="mc-secondary"
                  onClick={async () => {
                    await act("booking.status", {
                      id: selected.id,
                      status: "Refunded",
                    });
                    setSelected(null);
                  }}
                >
                  Mark refunded
                </button>
              )}
            </div>
          </Drawer>
        )}
      </div>
    </>
  );
}
