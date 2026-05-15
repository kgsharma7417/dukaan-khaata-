import { useMemo, useRef, useState } from "react";
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  sendOtpToPhone,
  verifyPhoneOtp,
} from "../../lib/auth";
import "../../auth.css";

function validateEmail(email) {
  return /.+@.+\..+/.test(email);
}

function normalizePhoneInput(phone) {
  const trimmed = String(phone || "").trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("+")) return "+" + trimmed.slice(1).replace(/\D/g, "");
  return trimmed.replace(/\D/g, "");
}

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // login | signup

  // Email auth
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Shared UI state
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Choose login method: phone otp | google
  const [loginMethod, setLoginMethod] = useState("phone"); // phone | google

  // Phone OTP login state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaElRef = useRef(null);

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

  async function handleSendOtp() {
    setError("");

    const normalized = normalizePhoneInput(phoneNumber);
    if (!normalized) return setError("Please enter a valid phone number.");

    try {
      setBusy(true);
      setOtpSent(false);
      setOtpCode("");
      setConfirmationResult(null);

      const el = recaptchaElRef.current;
      const confirmation = await sendOtpToPhone(normalized, el);

      setConfirmationResult(confirmation);
      setOtpSent(true);
      setError("");
    } catch (err) {
      setError(err?.message || "OTP send failed.");
      setOtpSent(false);
      setConfirmationResult(null);
    } finally {
      setBusy(false);
    }
  }

  async function handleVerifyOtp(e) {
    e?.preventDefault?.();
    setError("");

    if (!confirmationResult) return setError("OTP session missing.");
    const code = String(otpCode || "").trim();
    if (code.length < 4) return setError("Please enter the OTP code.");

    try {
      setBusy(true);
      await verifyPhoneOtp(code, confirmationResult);
    } catch (err) {
      setError(err?.message || "OTP verification failed.");
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

        {/* Choose method (as per request) */}
        <div className="auth-form" style={{ marginTop: 10 }}>
          <div className="auth-divider" style={{ margin: "6px 0 14px" }} />
          <div
            className="auth-mode"
            style={{ justifyContent: "center", gap: 10 }}
          >
            <button
              type="button"
              className={
                loginMethod === "phone"
                  ? "auth-pill auth-pill--active"
                  : "auth-pill"
              }
              onClick={() => {
                setLoginMethod("phone");
                setError("");
              }}
            >
              📱 Mobile OTP
            </button>
            <button
              type="button"
              className={
                loginMethod === "google"
                  ? "auth-pill auth-pill--active"
                  : "auth-pill"
              }
              onClick={() => {
                setLoginMethod("google");
                setError("");
              }}
            >
              🔎 Google
            </button>
          </div>

          {loginMethod === "google" ? (
            <button
              type="button"
              className="auth-submit"
              style={{ background: "#111827", marginTop: 14 }}
              disabled={busy}
              onClick={handleGoogle}
              title="Continue with Google"
            >
              {busy ? "Please wait..." : "Continue with Google"}
            </button>
          ) : (
            <>
              <div className="auth-divider" style={{ margin: "14px 0" }} />
              <div className="auth-label" style={{ marginBottom: 6 }}>
                Mobile (OTP)
              </div>

              <label className="auth-label">
                Phone number
                <input
                  className="auth-input"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  type="tel"
                  inputMode="tel"
                  placeholder="+91 9876543210"
                  autoComplete="tel"
                />
              </label>

              {otpSent ? (
                <form onSubmit={handleVerifyOtp} style={{ marginTop: 10 }}>
                  <label className="auth-label">
                    OTP
                    <input
                      className="auth-input"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter OTP"
                      autoComplete="one-time-code"
                    />
                  </label>

                  <button className="auth-submit" type="submit" disabled={busy}>
                    {busy ? "Verifying..." : "Verify OTP"}
                  </button>
                </form>
              ) : (
                <button
                  className="auth-submit"
                  type="button"
                  style={{ marginTop: 10 }}
                  disabled={busy}
                  onClick={handleSendOtp}
                >
                  {busy ? "Sending OTP..." : "Send OTP"}
                </button>
              )}

              {/* Recaptcha container (Firebase renders here) */}
              <div
                ref={recaptchaElRef}
                style={{ marginTop: 10 }}
                aria-hidden="true"
              />
            </>
          )}

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
