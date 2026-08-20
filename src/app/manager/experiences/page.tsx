"use client"
import React, { useState } from "react";
import { useManagementState, Experience } from "@/components/manager/useManagementState";
import { Toolbar, Badge, money } from "@/components/manager/SharedUI";
import { ExperienceEditor } from "@/components/manager/ExperienceEditor";
import { Plus, Edit3, Check, MoreHorizontal, BookOpen } from "lucide-react";

export default function ExperiencesPage() {
  const { state, user, loading, error, act } = useManagementState();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Experience | null | undefined>();

  if (loading) return <div style={{padding: '2rem'}}>Loading experiences...</div>;
  if (error || !state || !user) return <div style={{padding: '2rem'}}>Error loading experiences</div>;

  const isAdmin = user.role === "superadmin";

  const experiences = isAdmin
    ? state.experiences
    : state.experiences.filter((x) => x.operatorId === state.operators[0]?.id);

  const filtered = experiences.filter((x) =>
    x.title.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <header className="mc-header">
        <h1>{isAdmin ? "Experiences" : "My experiences"}</h1>
        <p>{isAdmin ? "Review and manage local experience inventory." : "Manage what travelers can discover and book."}</p>
      </header>
      <div className="mc-scroll">
        <Toolbar q={q} setQ={setQ}>
          <button className="mc-primary" onClick={() => setEditing(null)}>
            <Plus />
            Add experience
          </button>
        </Toolbar>
        <div className="mc-cards-list">
          {filtered.map((x) => (
            <article className="mc-experience-row" key={x.id}>
              <div className="mc-experience-thumb">
                <BookOpen />
              </div>
              <div>
                <small>{x.category}</small>
                <h3>{x.title}</h3>
                <p>
                  {money(x.price)} · {x.capacity} guests
                </p>
              </div>
              <Badge
                tone={
                  x.status === "Published"
                    ? "verified"
                    : x.status === "Pending"
                    ? "moderate"
                    : "muted"
                }
              >
                {x.status}
              </Badge>
              <div className="mc-row-actions">
                <button onClick={() => setEditing(x)}>
                  <Edit3 />
                </button>
                {isAdmin && x.status !== "Published" && (
                  <button
                    title="Approve"
                    onClick={() =>
                      act("experience.status", {
                        id: x.id,
                        status: "Published",
                      })
                    }
                  >
                    <Check />
                  </button>
                )}
                <button
                  onClick={() =>
                    act("experience.status", {
                      id: x.id,
                      status: x.status === "Paused" ? "Published" : "Paused",
                    })
                  }
                >
                  <MoreHorizontal />
                </button>
              </div>
            </article>
          ))}
        </div>
        {editing !== undefined && (
          <ExperienceEditor
            item={editing}
            operators={state.operators}
            operatorMode={!isAdmin}
            close={() => setEditing(undefined)}
            save={async (p) => {
              if (
                await act(
                  editing ? "experience.update" : "experience.create",
                  editing ? { id: editing.id, ...p } : p
                )
              )
                setEditing(undefined);
            }}
          />
        )}
      </div>
    </>
  );
}
