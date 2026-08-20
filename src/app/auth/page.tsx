"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/platform";
import { AlertTriangle, ArrowLeft, ArrowRight, Eye, EyeOff, Lock, LogIn, MapPinned, ShieldCheck, User } from "lucide-react";
import "@/components/ref/access.css";

const SESSION_KEY = "yatralink_vercel_session";

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

function AuthLayout({
  title,
  subtitle,
  onBack,
  children,
}: {
  title: string;
  subtitle: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="auth-visual__photo" />
        <div className="auth-visual__overlay" />
        <div>
          <MarkLogo />
          <h1>
            Move with the city,<br />not against it.
          </h1>
          <p>Smarter timing creates better journeys and stronger local economies.</p>
        </div>
      </section>
      <section className="auth-panel">
        <button className="auth-back" onClick={onBack}>
          <ArrowLeft />
          Back
        </button>
        <div className="auth-card">
          <span className="eyebrow">YATRALINK ACCESS</span>
          <h2>{title}</h2>
          <p>{subtitle}</p>
          {children}
        </div>
      </section>
    </main>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const [view, setView] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSuccess = (data: { session_id: string; user: any }) => {
    localStorage.setItem(SESSION_KEY, data.session_id);
    if (data.user.role === 'superadmin' || data.user.role === 'operator') {
      router.push('/manager');
    } else if (data.user.role === 'engineer') {
      router.push('/engineer');
    } else {
      router.push('/');
    }
  };

  const onBack = () => {
    router.push('/');
  };

  const loginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/api/demo-auth/login", { email, password });
      onSuccess(data);
    } catch {
      setError("The email or password is incorrect.");
    } finally {
      setBusy(false);
    }
  };

  const signupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/api/demo-auth/signup", { name, email, password });
      onSuccess(data);
    } catch (err: any) {
      setError(err?.message || "Unable to create this account.");
    } finally {
      setBusy(false);
    }
  };

  if (view === "login") {
    return (
      <AuthLayout title="Welcome back" subtitle="Sign in to your YatraLink workspace." onBack={onBack}>
        <form className="access-form" onSubmit={loginSubmit}>
          <label>
            Email address
            <div>
              <User />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
            </div>
          </label>
          <label>
            Password
            <div>
              <Lock />
              <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" />
              <button type="button" onClick={() => setShow(!show)}>
                {show ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </label>
          {error && <div className="access-error"><AlertTriangle />{error}</div>}
          <button className="access-primary" disabled={busy}>
            {busy ? "Signing in…" : <>Sign in <LogIn /></>}
          </button>
        </form>
        <div className="auth-switch">
          New to YatraLink? <button type="button" onClick={() => setView("signup")}>Create an account</button>
        </div>
        <div className="demo-role-note">
          <ShieldCheck />
          <div>
            <strong>Role-aware access</strong>
            <p>Your account automatically opens the correct Traveler, Operator, Superadmin or Route Engineer workspace.</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create your account" subtitle="New accounts start with Traveler access." onBack={onBack}>
      <form className="access-form" onSubmit={signupSubmit}>
        <label>
          Full name
          <div>
            <User />
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
        </label>
        <label>
          Email address
          <div>
            <User />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
        </label>
        <label>
          Password
          <div>
            <Lock />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 characters" />
          </div>
        </label>
        <label>
          Confirm password
          <div>
            <Lock />
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" />
          </div>
        </label>
        {error && <div className="access-error"><AlertTriangle />{error}</div>}
        <button className="access-primary" disabled={busy}>
          {busy ? "Creating account…" : <>Create account <ArrowRight /></>}
        </button>
      </form>
      <div className="auth-switch">
        Already registered? <button type="button" onClick={() => setView("login")}>Sign in</button>
      </div>
    </AuthLayout>
  );
}
