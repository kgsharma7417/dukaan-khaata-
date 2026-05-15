import { useMemo, useState } from "react";
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
} from "../../lib/auth";
import "../../auth.css";

function validateEmail(email) {
  return /.+@.+\..+/.test(email);
}

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // login | signup

  // Email auth
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Shared UI state
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const subtitle = useMemo(
    () =>
      mode === "login" ? "Login to continue" : "Sign up to start using the app",
    [mode],
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) return setError("Please enter a valid email.");
    if ((password || "").length < 6)
      return setError("Password must be at least 6 characters.");

    try {
      setBusy(true);
      if (mode === "login") await loginWithEmail(email, password);
      else await registerWithEmail(email, password);
    } catch (err) {
      setError(err?.message || "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError("");
    try {
      setBusy(true);
      await loginWithGoogle();
    } catch (err) {
      setError(err?.message || "Google login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-backdrop" />

      <div
        className="auth-card"
        role="main"
        aria-label="Login"
        style={{ color: "#0f172a" }}
      >
        <div className="auth-brand">
          <div className="auth-logo">🏦</div>
          <div>
            <div className="auth-title">Dukaan Khaata</div>
            <div className="auth-subtitle">{subtitle}</div>
          </div>
        </div>

        <div className="auth-divider" />

        <div className="auth-mode">
          <button
            type="button"
            className={
              mode === "login" ? "auth-pill auth-pill--active" : "auth-pill"
            }
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            Login
          </button>

          <button
            type="button"
            className={
              mode === "signup" ? "auth-pill auth-pill--active" : "auth-pill"
            }
            onClick={() => {
              setMode("signup");
              setError("");
            }}
          >
            Sign up
          </button>
        </div>

        {/* Login options */}
        <div className="auth-form" style={{ marginTop: 10 }}>
          <div className="auth-divider" style={{ margin: "6px 0 14px" }} />

          <button
            type="button"
            className="auth-submit"
            style={{ background: "#111827", marginTop: 0 }}
            disabled={busy}
            onClick={handleGoogle}
            title="Continue with Google"
          >
            {busy ? "Please wait..." : "Continue with Google"}
          </button>

          {error ? (
            <div className="auth-error" style={{ marginTop: 10 }}>
              {error}
            </div>
          ) : null}
        </div>

        {/* Email login/signup */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div style={{ marginTop: 14 }} />

          <label className="auth-label">
            Email
            <input
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="auth-label">
            Password
            <input
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              placeholder="••••••"
              required
            />
          </label>

          {/* Keep this message near email section as well */}
          {error ? <div className="auth-error">{error}</div> : null}

          <button className="auth-submit" type="submit" disabled={busy}>
            {busy
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Create account"}
          </button>

          <div className="auth-hint">
            By continuing, you agree to our{" "}
            <span className="auth-link">Terms</span> &{" "}
            <span className="auth-link">Privacy</span>.
          </div>
        </form>
      </div>
    </div>
  );
}
