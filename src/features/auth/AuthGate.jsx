import { useEffect, useState } from "react";
import { authListen } from "../../lib/auth";
import LoginPage from "./LoginPage.jsx";
import AppRouter from "../../AppRouter.jsx";

export default function AuthGate() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = authListen((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub?.();
  }, []);

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
