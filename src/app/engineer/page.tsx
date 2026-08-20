"use client"
import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { api } from "@/lib/platform";
import { MapPinned, Settings as SettingsIcon, LogOut, MapPin, GitBranch, Check, Save, LocateFixed, Trash2, X } from "lucide-react";
import type { EngineerNode, EngineerRoute } from "@/components/engineer/types";
import { nodeColors } from "@/components/engineer/types";
import "@/components/ref/access.css";

const SESSION_KEY = "yatralink_vercel_session";

const EngineerMap = dynamic(() => import("@/components/engineer/EngineerMap"), { ssr: false });

function MarkLogo() {
  return (
    <div className="access-logo">
      <span>
        <MapPinned />
      </span>
      <strong>
        Yatra<b>Link</b>
      </strong>
    </div>
  );
}

function Switch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      className={`access-switch ${value ? "on" : ""}`}
      onClick={() => onChange(!value)}
      aria-pressed={value}
    >
      <span />
    </button>
  );
}

export default function EngineerPanel() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [nodes, setNodes] = useState<EngineerNode[]>([]);
  const [routes, setRoutes] = useState<EngineerRoute[]>([]);
  const [nodeType, setNodeType] = useState("Temple");
  const [nodeName, setNodeName] = useState("");
  const [addMode, setAddMode] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSession = localStorage.getItem(SESSION_KEY) || "";
    if (!savedSession) {
      router.push("/auth");
      return;
    }
    
    api.get("/api/demo-auth/session", { session_id: savedSession })
      .then(({ data }) => {
        if (data.user.role !== "engineer") {
          router.push("/");
          return;
        }
        setUser(data.user);
        return api.get("/api/engineer-map", { session_id: savedSession });
      })
      .then((res: any) => {
        if (res && res.data) {
          setNodes(res.data.map.nodes || []);
          setRoutes(res.data.map.routes || []);
        }
      })
      .catch(() => {
        localStorage.removeItem(SESSION_KEY);
        router.push("/auth");
      })
      .finally(() => setBusy(false));
  }, [router]);

  const logout = async () => {
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (sessionId) {
      await api.post("/api/demo-auth/logout", { session_id: sessionId }).catch(() => {});
    }
    localStorage.removeItem(SESSION_KEY);
    router.push("/auth");
  };

  const addPoint = (lat: number, lng: number) => {
    setNodes((x) => [
      ...x,
      {
        id: `node-${Date.now()}-${x.length}`,
        name: nodeName.trim() || `${nodeType} ${x.length + 1}`,
        type: nodeType,
        lat,
        lng,
      },
    ]);
    setNodeName("");
    setDirty(true);
  };

  const toggleSelect = (id: string) =>
    setSelected((x) =>
      x.includes(id)
        ? x.filter((v) => v !== id)
        : x.length < 2
        ? [...x, id]
        : [x[1], id]
    );

  const connect = () => {
    if (selected.length !== 2) return;
    const a = nodes.find((n) => n.id === selected[0]);
    const b = nodes.find((n) => n.id === selected[1]);
    if (!a || !b) return;
    setRoutes((x) => [
      ...x,
      {
        id: `route-${Date.now()}`,
        name: `${a.name} → ${b.name}`,
        node_ids: [a.id, b.id],
        published: false,
      },
    ]);
    setSelected([]);
    setDirty(true);
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter((n) => n.id !== id));
    setRoutes(routes.filter((r) => !r.node_ids.includes(id)));
    setSelected(selected.filter((x) => x !== id));
    setDirty(true);
  };

  const save = async () => {
    setBusy(true);
    const sessionId = localStorage.getItem(SESSION_KEY) || "";
    try {
      const { data } = await api.put("/api/engineer-map", {
        session_id: sessionId,
        nodes,
        routes,
      });
      setNodes(data.map.nodes);
      setRoutes(data.map.routes);
      setDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } finally {
      setBusy(false);
    }
  };

  const routeLines = useMemo(
    () =>
      routes
        .map((r) => ({
          route: r,
          points: r.node_ids
            .map((id) => nodes.find((n) => n.id === id))
            .filter(Boolean) as EngineerNode[],
        }))
        .filter((x) => x.points.length > 1),
    [routes, nodes]
  );

  if (busy && !user) return <div style={{padding: '2rem'}}>Loading workspace...</div>;
  if (!user) return null;

  return (
    <main className="engineer-page">
      <header className="engineer-header">
        <div>
          <MarkLogo />
          <span>Route Studio</span>
        </div>
        <div className="engineer-header__actions">
          <span>
            <b>{user.name}</b>Route Mapping Engineer
          </span>
          <button onClick={() => router.push("/manager/settings")}>
            <SettingsIcon />
            Settings
          </button>
          <button onClick={logout}>
            <LogOut />
            Log out
          </button>
        </div>
      </header>
      <div className="engineer-layout">
        <aside className="engineer-tools">
          <h1>Special Place Route Builder</h1>
          <p>
            Map temples, heritage zones, gates, queue points and safe walking
            links where generic navigation is not enough.
          </p>
          <div className="tool-card">
            <label>
              Point type
              <select
                value={nodeType}
                onChange={(e) => setNodeType(e.target.value)}
              >
                {Object.keys(nodeColors).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
            <label>
              Point name
              <input
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                placeholder={`e.g. East ${nodeType}`}
              />
            </label>
            <button
              className={`map-mode ${addMode ? "active" : ""}`}
              onClick={() => setAddMode(!addMode)}
            >
              <MapPin />
              {addMode ? "Click map to add point" : "Point adding paused"}
            </button>
          </div>
          <div className="tool-card">
            <strong>Connect route · {selected.length}/2 selected</strong>
            <p>Select two mapped points, then connect them.</p>
            <button
              className="access-secondary"
              disabled={selected.length !== 2}
              onClick={connect}
            >
              <GitBranch />
              Connect selected points
            </button>
          </div>
          <div className="engineer-summary">
            <span>
              <b>{nodes.length}</b>Mapped points
            </span>
            <span>
              <b>{routes.length}</b>Routes
            </span>
            <span>
              <b>{routes.filter((r) => r.published).length}</b>Published
            </span>
          </div>
          <button
            className="access-primary engineer-save"
            disabled={!dirty || busy}
            onClick={save}
          >
            {saved ? (
              <>
                <Check />
                Map saved
              </>
            ) : (
              <>
                <Save />
                {busy ? "Saving…" : "Save map changes"}
              </>
            )}
          </button>
        </aside>
        <section className="engineer-map-wrap">
          <div className="engineer-map-toolbar">
            <div>
              <LocateFixed />
              Patan special-place mapping workspace
            </div>
            <span className={dirty ? "dirty" : "saved"}>
              {dirty ? "Unsaved changes" : "All changes saved"}
            </span>
          </div>
          <EngineerMap 
            addMode={addMode}
            addPoint={addPoint}
            routeLines={routeLines}
            nodes={nodes}
            selected={selected}
            toggleSelect={toggleSelect}
            removeNode={removeNode}
          />
        </section>
        <aside className="engineer-list">
          <h3>Mapped points</h3>
          {nodes.map((n) => (
            <button
              className={selected.includes(n.id) ? "selected" : ""}
              key={n.id}
              onClick={() => toggleSelect(n.id)}
            >
              <i style={{ background: nodeColors[n.type] }} />
              <div>
                <strong>{n.name}</strong>
                <span>{n.type}</span>
              </div>
              <Trash2
                onClick={(e) => {
                  e.stopPropagation();
                  removeNode(n.id);
                }}
              />
            </button>
          ))}
          <h3>Route segments</h3>
          {routes.map((r) => (
            <div className="route-row" key={r.id}>
              <div>
                <strong>{r.name}</strong>
                <span>
                  {r.published ? "Visible to travelers" : "Draft route"}
                </span>
              </div>
              <Switch
                value={r.published}
                onChange={(v) => {
                  setRoutes(
                    routes.map((x) =>
                      x.id === r.id ? { ...x, published: v } : x
                    )
                  );
                  setDirty(true);
                }}
              />
              <button
                onClick={() => {
                  setRoutes(routes.filter((x) => x.id !== r.id));
                  setDirty(true);
                }}
              >
                <X />
              </button>
            </div>
          ))}
        </aside>
      </div>
    </main>
  );
}
