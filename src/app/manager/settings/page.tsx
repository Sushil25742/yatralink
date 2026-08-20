"use client"
import React, { useState, useEffect } from "react";
import { api } from "@/lib/platform";
import { useManagementState } from "@/components/manager/useManagementState";
import { Settings as SettingsIcon, ShieldCheck, Bell, Languages, AlertTriangle, Check, Save } from "lucide-react";

const SESSION_KEY = "yatralink_vercel_session";

function Switch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      className={`access-switch ${value ? "on" : ""}`}
      onClick={() => onChange(!value)}
      aria-pressed={value}
      style={{
        display: "inline-flex",
        width: "36px",
        height: "20px",
        borderRadius: "10px",
        background: value ? "#3273f6" : "#444",
        position: "relative",
        border: "none",
        cursor: "pointer",
        transition: "background 0.2s"
      }}
    >
      <span style={{
        position: "absolute",
        top: "2px",
        left: value ? "18px" : "2px",
        width: "16px",
        height: "16px",
        borderRadius: "8px",
        background: "#fff",
        transition: "left 0.2s"
      }} />
    </button>
  );
}

export default function SettingsPage() {
  const { user, loading, error: authError } = useManagementState();
  const [settings, setSettings] = useState<any>({
    name: "",
    language: "English",
    crowd_alerts: true,
    location_sharing: false,
    accessibility: "Standard",
    travel_pace: "Balanced",
    dark_mode: false,
  });
  const [tab, setTab] = useState<"general" | "privacy" | "notifications" | "language">("general");
  const [busy, setBusy] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const sessionId = localStorage.getItem(SESSION_KEY) || "";
    if (!sessionId) return;
    api
      .get("/api/user-settings", { session_id: sessionId })
      .then(({ data }) => setSettings(data.settings))
      .catch(() => setError("Unable to load settings."))
      .finally(() => setBusy(false));
  }, []);

  const save = async () => {
    setBusy(true);
    setError("");
    try {
      const sessionId = localStorage.getItem(SESSION_KEY) || "";
      const { data } = await api.put("/api/user-settings", {
        session_id: sessionId,
        settings,
      });
      setSettings(data.settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch {
      setError("Settings could not be saved. Try again.");
    } finally {
      setBusy(false);
    }
  };

  if (loading || busy) return <div style={{padding: '2rem'}}>Loading settings...</div>;
  if (authError || !user) return <div style={{padding: '2rem'}}>Error loading settings</div>;

  return (
    <>
      <header className="mc-header">
        <h1>Settings</h1>
        <p>Manage your account preferences.</p>
      </header>
      <div className="mc-scroll" style={{ display: 'flex', gap: '2rem' }}>
        <aside style={{ width: '200px' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              className={tab === "general" ? "mc-primary" : "mc-secondary"}
              style={{ justifyContent: 'flex-start' }}
              onClick={() => setTab("general")}
            >
              <SettingsIcon size={18} /> General
            </button>
            <button
              className={tab === "privacy" ? "mc-primary" : "mc-secondary"}
              style={{ justifyContent: 'flex-start' }}
              onClick={() => setTab("privacy")}
            >
              <ShieldCheck size={18} /> Privacy
            </button>
            <button
              className={tab === "notifications" ? "mc-primary" : "mc-secondary"}
              style={{ justifyContent: 'flex-start' }}
              onClick={() => setTab("notifications")}
            >
              <Bell size={18} /> Notifications
            </button>
            <button
              className={tab === "language" ? "mc-primary" : "mc-secondary"}
              style={{ justifyContent: 'flex-start' }}
              onClick={() => setTab("language")}
            >
              <Languages size={18} /> Language
            </button>
          </nav>
        </aside>
        
        <section className="mc-card" style={{ flex: 1, maxWidth: '600px' }}>
          <div className="mc-form">
            {error && (
              <div className="access-error" style={{ color: '#d9514e', display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <AlertTriangle size={18} />
                {error}
              </div>
            )}
            
            {tab === "general" && (
              <>
                <label>
                  Display name
                  <input
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  />
                </label>
                <label>
                  Travel pace
                  <select
                    value={settings.travel_pace}
                    onChange={(e) => setSettings({ ...settings, travel_pace: e.target.value })}
                  >
                    <option>Relaxed</option>
                    <option>Balanced</option>
                    <option>Fast-paced</option>
                  </select>
                </label>
                <label>
                  Accessibility
                  <select
                    value={settings.accessibility}
                    onChange={(e) => setSettings({ ...settings, accessibility: e.target.value })}
                  >
                    <option>Standard</option>
                    <option>Reduced walking</option>
                    <option>Step-free preferred</option>
                    <option>High contrast</option>
                  </select>
                </label>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <div>
                    <strong>Dark workspace</strong>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#999' }}>Use a darker account settings workspace.</p>
                  </div>
                  <Switch
                    value={settings.dark_mode}
                    onChange={(v) => setSettings({ ...settings, dark_mode: v })}
                  />
                </div>
              </>
            )}

            {tab === "privacy" && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <div>
                  <strong>Anonymous location sharing</strong>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#999' }}>Opt in to privacy-preserving location features.</p>
                </div>
                <Switch
                  value={settings.location_sharing}
                  onChange={(v) => setSettings({ ...settings, location_sharing: v })}
                />
              </div>
            )}

            {tab === "notifications" && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <div>
                  <strong>Crowd alerts</strong>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#999' }}>Surface crowd changes that affect your planned destinations.</p>
                </div>
                <Switch
                  value={settings.crowd_alerts}
                  onChange={(v) => setSettings({ ...settings, crowd_alerts: v })}
                />
              </div>
            )}

            {tab === "language" && (
              <label>
                Language
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                >
                  <option>English</option>
                  <option>नेपाली</option>
                  <option>हिन्दी</option>
                  <option>中文</option>
                </select>
                <small style={{ display: 'block', marginTop: '0.25rem', color: '#999' }}>
                  Preference is persisted; full interface translation remains a prototype extension.
                </small>
              </label>
            )}

            <button
              className="mc-primary"
              style={{ marginTop: '2rem' }}
              disabled={busy}
              onClick={save}
            >
              {saved ? (
                <>
                  <Check size={18} />
                  Saved
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save settings
                </>
              )}
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
