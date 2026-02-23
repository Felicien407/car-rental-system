import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as api from "../api/mockApi";

export default function AuthPage() {
  const { login } = useAuth();
  const [tab, setTab]       = useState("login");
  const [form, setForm]     = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const switchTab = (t) => { setTab(t); setError(""); };

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const res =
        tab === "login"
          ? await api.login(form.email, form.password)
          : await api.register(form.name, form.email, form.password);
      login(res.user);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <span className="auth-logo-icon">🚗</span>
          <h1>RENT-A-CAR</h1>
          <p>Unlock Your Journey</p>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <div
            className={`auth-tab ${tab === "login" ? "active" : ""}`}
            onClick={() => switchTab("login")}
          >
            Sign In
          </div>
          <div
            className={`auth-tab ${tab === "register" ? "active" : ""}`}
            onClick={() => switchTab("register")}
          >
            Sign Up
          </div>
        </div>

        {/* Fields */}
        {tab === "register" && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>

        {error && <p className="error-text">⚠ {error}</p>}

        {tab === "login" && (
          <p className="text-muted" style={{ marginBottom: 16, marginTop: 4, fontSize: 12 }}>
            Demo — admin@rentacar.com / admin123 &nbsp;|&nbsp; alice@example.com / alice123
          </p>
        )}

        <button
          className="btn btn-primary btn-full"
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Please wait…" : tab === "login" ? "Sign In" : "Create Account"}
        </button>
      </div>
    </div>
  );
}
