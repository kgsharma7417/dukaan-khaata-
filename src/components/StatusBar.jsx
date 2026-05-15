import React from "react";
import { COLORS } from "../constants/colors";

export default function StatusBar({ state, text }) {
  const colors = { ok: "#16a34a", err: "#dc2626", loading: "#d97706" };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        color: COLORS.muted,
        justifyContent: "flex-end",
        padding: "4px 0 12px",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: colors[state] || colors.loading,
          display: "inline-block",
        }}
      />
      {text}
    </div>
  );
}
