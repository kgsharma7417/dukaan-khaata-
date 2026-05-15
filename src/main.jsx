import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AuthGate from "./features/auth/AuthGate.jsx";
import "./lib/firebase.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthGate />
  </StrictMode>,
);
