import { useEffect, useState } from "react";
import { authListen } from "../../lib/auth";
import LoginPage from "./LoginPage.jsx";
import AppRouter from "../../AppRouter.jsx";

function isPreviewNoLoginEnabled() {
  try {
    const v = window.localStorage?.getItem("previewProfileNoLogin");
    return v === "1";
  } catch {
    return false;
  }
}

function shouldBypassAuthForPath() {
  // Production/normal flow me route-based bypass mat rakho.
  // Sirf explicit preview flag se bypass hoga.
  return false;
}

export default function AuthGate() {
  const bypass = isPreviewNoLoginEnabled() || shouldBypassAuthForPath();

  const [user, setUser] = useState(() => (bypass ? { id: "preview" } : null));
  const [loading, setLoading] = useState(() => (bypass ? false : true));

  useEffect(() => {
    if (bypass) return;

    const unsub = authListen((u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsub?.();
  }, [bypass]);

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-spinner" />
        <div className="auth-loading-text">Loading...</div>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  return <AppRouter user={user} />;
}
