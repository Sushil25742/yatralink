"use client"
import React, { useState } from "react";
import { useManagementState } from "@/components/manager/useManagementState";
import { Clock, Plus } from "lucide-react";

export default function CalendarPage() {
  const { state, loading, error, act } = useManagementState();
  const [exp, setExp] = useState(state?.experiences[0]?.id || "");
  const [time, setTime] = useState("5:00 PM");
  const [capacity, setCapacity] = useState(8);

  if (loading) return <div style={{padding: '2rem'}}>Loading calendar...</div>;
  if (error || !state) return <div style={{padding: '2rem'}}>Error loading calendar</div>;

  return (
    <>
      <header className="mc-header">
        <h1>Calendar</h1>
        <p>Manage availability and time slots.</p>
      </header>
      <div className="mc-scroll">
        <div className="mc-card mc-slot-create">
          <h2>Add availability</h2>
          <div>
            <select value={exp} onChange={(e) => setExp(e.target.value)}>
              {state.experiences.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
            <input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="5:00 PM"
            />
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
            />
            <button
              className="mc-primary"
              onClick={() =>
                act("availability.create", {
                  experienceId: exp || state.experiences[0]?.id,
                  day: "Today",
                  time,
                  capacity,
                })
              }
            >
              <Plus />
              Add slot
            </button>
          </div>
        </div>
        <div className="mc-calendar">
          <section className="mc-card">
            <h2>Today</h2>
            <div className="mc-slot-grid">
              {state.slots
                .filter((x) => x.day === "Today")
                .map((s) => (
                  <button
                    key={s.id}
                    className={s.available ? "available" : "closed"}
                    onClick={() =>
                      act("availability.toggle", {
                        id: s.id,
                        available: !s.available,
                      })
                    }
                  >
                    <Clock />
                    <strong>{s.time}</strong>
                    <span>
                      {s.available
                        ? `${s.capacity - s.booked} seats open`
                        : "Closed"}
                    </span>
                  </button>
                ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
