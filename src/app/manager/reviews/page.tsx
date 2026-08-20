"use client"
import React, { useState } from "react";
import { useManagementState } from "@/components/manager/useManagementState";
import { MessageSquare } from "lucide-react";

export default function ReviewsPage() {
  const { state, loading, error, act } = useManagementState();
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  if (loading) return <div style={{padding: '2rem'}}>Loading reviews...</div>;
  if (error || !state) return <div style={{padding: '2rem'}}>Error loading reviews</div>;

  return (
    <>
      <header className="mc-header">
        <h1>Reviews</h1>
        <p>Read what guests are saying and reply to reviews.</p>
      </header>
      <div className="mc-scroll">
        <div className="mc-review-list">
          {state.reviews.map((r) => (
            <article className="mc-card" key={r.id}>
              <header>
                <span className="mc-avatar">{r.guest[0]}</span>
                <strong>
                  {r.guest} · {r.rating}/5
                </strong>
              </header>
              <p>“{r.text}”</p>
              {r.reply ? (
                <div className="mc-reply">
                  <MessageSquare />
                  <p>{r.reply}</p>
                </div>
              ) : (
                <div className="mc-reply-form">
                  <textarea
                    value={drafts[r.id] || ""}
                    onChange={(e) =>
                      setDrafts({ ...drafts, [r.id]: e.target.value })
                    }
                  />
                  <button
                    className="mc-primary"
                    disabled={!drafts[r.id]?.trim()}
                    onClick={() =>
                      act("review.reply", { id: r.id, reply: drafts[r.id] })
                    }
                  >
                    Reply
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
