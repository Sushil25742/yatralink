"use client"
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useManagementState, CrowdSite } from "@/components/manager/useManagementState";
import { Badge, crowdClass, Stat } from "@/components/manager/SharedUI";
import { Activity, Clock, ShieldCheck } from "lucide-react";

const CrowdMap = dynamic(() => import("@/components/manager/CrowdMap"), { ssr: false });

export default function CrowdPage() {
  const { state, loading, error, act } = useManagementState();
  const [selected, setSelected] = useState<CrowdSite | null>(null);

  useEffect(() => {
    if (state && state.crowdSites.length > 0 && !selected) {
      setSelected(state.crowdSites[0]);
    } else if (state && selected) {
      const fresh = state.crowdSites.find((s) => s.id === selected.id);
      if (fresh) setSelected(fresh);
    }
  }, [state, selected]);

  if (loading) return <div style={{padding: '2rem'}}>Loading crowd monitor...</div>;
  if (error || !state) return <div style={{padding: '2rem'}}>Error loading crowd monitor</div>;

  const color = (l: string) =>
    l === "Low" ? "#2e9f5b" : l === "Moderate" ? "#dfa21d" : l === "High" ? "#d9514e" : "#25292d";

  return (
    <>
      <header className="mc-header">
        <h1>Crowd monitor</h1>
        <p>Manage destination pressure and traveler redistribution.</p>
      </header>
      <div className="mc-scroll">
        <div className="mc-crowd-layout">
          <section className="mc-card mc-crowd-map">
            <CrowdMap 
              crowdSites={state.crowdSites}
              selectedId={selected?.id || ""}
              onSelect={setSelected}
              color={color}
            />
          </section>
          {selected && (
            <aside className="mc-card mc-crowd-inspector">
              <Badge tone={crowdClass(selected.level)}>{selected.level}</Badge>
              <h2>{selected.name}</h2>
              <p>{selected.source || "Demo estimate"}</p>
              <div className="mc-inspector-grid">
                <Stat icon={<Activity />} value={String(selected.score)} label="Crowd score" />
                <Stat icon={<Clock />} value={selected.wait} label="Estimated wait" />
              </div>
              <h3>Set crowd level</h3>
              <div className="mc-level-buttons">
                {["Low", "Moderate", "High", "Critical"].map((l) => (
                  <button
                    key={l}
                    className={`${crowdClass(l)} ${selected.level === l ? "selected" : ""}`}
                    onClick={() => act("crowd.site", { id: selected.id, level: l })}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <div className="mc-info">
                <ShieldCheck />
                <div>
                  <strong>Privacy-aware prototype</strong>
                  <p>No face recognition is required for the product concept.</p>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
