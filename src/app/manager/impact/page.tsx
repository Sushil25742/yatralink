"use client"
import React from "react";
import { ShieldCheck } from "lucide-react";

export default function ImpactPage() {
  return (
    <>
      <header className="mc-header">
        <h1>Impact</h1>
        <p>Monitor sustainable practices and local community benefits.</p>
      </header>
      <div className="mc-scroll">
        <div className="mc-demo-banner">
          <ShieldCheck />
          <div>
            <strong>COMING SOON</strong>
            <span>
              The impact dashboard is currently under development and will be available in a future release.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
