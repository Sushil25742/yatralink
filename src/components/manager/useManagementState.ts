import { useState, useEffect } from "react";
import { api } from "@/lib/platform";

export type Role = "operator" | "superadmin";

export type Place = {
  id: string;
  name: string;
  category: string;
  zone: string;
  status: string;
  crowd: string;
  capacity: number;
  visits: number;
  lat: number;
  lng: number;
};

export type Experience = {
  id: string;
  title: string;
  operatorId: string;
  category: string;
  price: number;
  capacity: number;
  status: string;
  bookings: number;
  rating: number;
};

export type Booking = {
  id: string;
  guest: string;
  userEmail: string;
  experienceId: string;
  experienceTitle: string;
  operatorId: string;
  date: string;
  time: string;
  guests: number;
  amount: number;
  status: string;
  createdAt: number;
};

export type Operator = {
  id: string;
  name: string;
  business: string;
  email: string;
  status: string;
  experiences: number;
  rating: number;
  revenue: number;
};

export type CrowdSite = {
  id: string;
  name: string;
  level: string;
  score: number;
  wait: string;
  lat: number;
  lng: number;
  source?: string;
};

export type Slot = {
  id: string;
  experienceId: string;
  operatorId: string;
  day: string;
  time: string;
  available: boolean;
  capacity: number;
  booked: number;
};

export type Review = {
  id: string;
  guest: string;
  rating: number;
  text: string;
  reply: string;
};

export type State = {
  places: Place[];
  experiences: Experience[];
  bookings: Booking[];
  operators: Operator[];
  crowdSites: CrowdSite[];
  slots: Slot[];
  reviews: Review[];
  updated_at: number;
};

const SESSION_KEY = "yatralink_vercel_session";

export function useManagementState() {
  const [state, setState] = useState<State | null>(null);
  const [user, setUser] = useState<{name: string, email: string, role: Role} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      setLoading(false);
      return;
    }

    api.get("/api/management/state", { session_id: sessionId })
      .then(({ data }) => {
        setState(data.state);
        // Also fetch user session to get user details
        return api.get("/api/demo-auth/session", { session_id: sessionId });
      })
      .then(({ data }) => {
        setUser(data.user);
      })
      .catch((err) => {
        setError(err.message || "Failed to load state");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const act = async (action: string, payload?: Record<string, unknown>) => {
    try {
      const sessionId = localStorage.getItem(SESSION_KEY);
      const { data } = await api.post("/api/management/action", {
        session_id: sessionId,
        action,
        payload,
      });
      setState(data.state);
      return true;
    } catch (e: any) {
      alert("Action failed: " + e.message);
      return false;
    }
  };

  return { state, user, loading, error, act };
}
