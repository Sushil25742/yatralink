import { createClient, type RealtimeChannel } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY as
  string | undefined;
const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
      })
    : null;

type ApiResponse<T = any> = { data: T };
type MessageHandler = (message: any) => void;

type Subscription = { entity_type: string; entity_id: string };
class Connection {
  connectionId = crypto.randomUUID();
  ready = Promise.resolve();
  private listeners = new Set<MessageHandler>();
  private subscriptions = new Map<string, Subscription>();
  private channel: RealtimeChannel | null = null;

  constructor() {
    connections.set(this.connectionId, this);
    if (supabase) {
      this.channel = supabase
        .channel(`yatralink-events-${this.connectionId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "realtime_events" },
          (payload) => {
            const row = payload.new as {
              entity_type: string;
              entity_id: string;
              payload: any;
            };
            const key = `${row.entity_type}:${row.entity_id}`;
            if (!this.subscriptions.has(key)) return;
            const message = {
              v: 1,
              type: "entity.update",
              payload: {
                entity_type: row.entity_type,
                entity_id: row.entity_id,
                data: row.payload,
              },
            };
            this.listeners.forEach((fn) => fn(message));
          },
        )
        .subscribe();
    }
  }
  onMessage(fn: MessageHandler) {
    this.listeners.add(fn);
  }
  onOpen(_fn: () => void) {}
  onClose(_fn: () => void) {}
  onError(_fn: (err: any) => void) {}
  add(type: string, id: string) {
    this.subscriptions.set(`${type}:${id}`, {
      entity_type: type,
      entity_id: id,
    });
  }
  remove(type: string, id: string) {
    this.subscriptions.delete(`${type}:${id}`);
  }
  disconnect() {
    if (this.channel && supabase) supabase.removeChannel(this.channel);
    this.listeners.clear();
    connections.delete(this.connectionId);
  }
}

const connections = new Map<string, Connection>();

async function request(
  method: string,
  url: string,
  data?: any,
): Promise<ApiResponse> {
  if (url === "/api/subscriptions" && method === "POST") {
    const conn = connections.get(data?.connection_id);
    conn?.add(data?.entity_type, data?.entity_id);
    return { data: { ok: true } };
  }
  if (url === "/api/subscriptions/remove" && method === "POST") {
    const conn = connections.get(data?.connection_id);
    conn?.remove(data?.entity_type, data?.entity_id);
    return { data: { ok: true } };
  }
  let target = url;
  const options: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (method === "GET" && data) {
    const qs = new URLSearchParams();
    Object.entries(data).forEach(([k, v]) => v != null && qs.set(k, String(v)));
    target += `${url.includes("?") ? "&" : "?"}${qs.toString()}`;
  } else if (data !== undefined) {
    options.body = JSON.stringify(data);
  }
  const res = await fetch(target, options);
  const body = await res
    .json()
    .catch(() => ({ error: `Request failed (${res.status})` }));
  if (!res.ok) {
    const err = new Error(
      body?.error || body?.message || `Request failed (${res.status})`,
    ) as Error & { status?: number; data?: any };
    err.status = res.status;
    err.data = body;
    throw err;
  }
  return { data: body };
}

export const api = {
  get: (url: string, data?: any) => request("GET", url, data),
  post: (url: string, data?: any) => request("POST", url, data),
  put: (url: string, data?: any) => request("PUT", url, data),
  delete: (url: string, data?: any) => request("DELETE", url, data),
};
export const ws = { connect: () => new Connection() };
