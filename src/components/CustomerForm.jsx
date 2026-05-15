import React, { useState } from "react";
import { COLORS } from "../constants/colors";
import { calcByaaj, initials, rupees } from "../lib/girviUtils";

// --- Sub Components ---
function Tag({ label, type = "green" }) {
  const c =
    COLORS["tag" + type.charAt(0).toUpperCase() + type.slice(1)] ||
    COLORS.tagGreen;
  return (
    <span
      style={{
        fontSize: 11,
        padding: "3px 10px",
        borderRadius: 20,
        background: c.bg,
        color: c.text,
        fontWeight: 500,
      }}
    >
      {label}
    </span>
  );
}

function Avatar({ name }) {
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: "#e8f5e9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        fontWeight: 600,
        color: COLORS.primary,
        border: `2px solid ${COLORS.accent}44`,
      }}
    >
      {initials(name)}
    </div>
  );
}

function TotalBox({ b }) {
  return (
    <div
      style={{
        background: "#fafaf7",
        border: `0.5px solid ${COLORS.border}`,
        borderRadius: 10,
        padding: "10px 12px",
        marginBottom: 10,
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 6,
        textAlign: "center",
      }}
    >
      {[
        { label: "Mool raqam", val: rupees(b.raqam), color: "#166534" },
        { label: "Byaaj ab tak", val: rupees(b.byaaj), color: "#92400e" },
        { label: "Kul dena hai", val: rupees(b.total), color: "#1e40af" },
      ].map((item) => (
        <div key={item.label}>
          <div style={{ fontSize: 10, color: COLORS.muted, marginBottom: 3 }}>
            {item.label}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: item.color }}>
            {item.val}
          </div>
        </div>
      ))}
      <div
        style={{
          gridColumn: "1/-1",
          fontSize: 11,
          color: COLORS.muted,
          marginTop: 2,
        }}
      >
        🕐 {b.days} din se girvi rakha hai
      </div>
    </div>
  );
}

// --- Main Component ---
export default function CustomerCard({ c, onEdit, onDelete, onToggleWapas }) {
  const b = calcByaaj(c.raqam, c.byaajDar, c.tarikh);
  const [confirmDel, setConfirmDel] = useState(false);

  return (
    <div
      style={{
        background: COLORS.card,
        border: `0.5px solid ${COLORS.border}`,
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <Avatar name={c.naam} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.primary }}>
            {c.naam}
          </div>
          <div style={{ fontSize: 12, color: COLORS.muted }}>
            📍 {c.village || "—"}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6px 12px",
          marginBottom: 10,
        }}
      >
        <div>
          <div style={{ fontSize: 10, color: COLORS.muted }}>Raqam diya</div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>
            {rupees(parseFloat(c.raqam) || 0)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: COLORS.muted }}>Byaaj dar</div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>
            {c.byaajDar ? `${c.byaajDar}% / maah` : "—"}
          </div>
        </div>
      </div>

      {c.saamaan && (
        <div
          style={{
            background: "#fafaf7",
            border: `0.5px solid ${COLORS.border}`,
            padding: "8px 10px",
            borderRadius: 8,
            fontSize: 13,
            marginBottom: 10,
          }}
        >
          📦 <strong>Saamaan:</strong> {c.saamaan}
        </div>
      )}

      {b && !c.wapas && <TotalBox b={b} />}

      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {c.wapas ? (
          <Tag label="✓ Wapas ho gaya" type="green" />
        ) : (
          <Tag label="Girvi chal raha" type="amber" />
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          borderTop: `0.5px solid ${COLORS.border}`,
          paddingTop: 10,
        }}
      >
        <button
          onClick={() => onEdit(c.id)}
          style={{
            cursor: "pointer",
            background: "none",
            border: `1px solid ${COLORS.border}`,
            padding: "4px 10px",
            borderRadius: 6,
          }}
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => onToggleWapas(c.id)}
          style={{
            cursor: "pointer",
            background: "none",
            border: `1px solid ${COLORS.border}`,
            padding: "4px 10px",
            borderRadius: 6,
          }}
        >
          {c.wapas ? "Reopen" : "Wapas hua"}
        </button>
        <button
          onClick={() => setConfirmDel(true)}
          style={{
            cursor: "pointer",
            background: "none",
            border: `1px solid #fca5a5`,
            color: COLORS.danger,
            padding: "4px 10px",
            borderRadius: 6,
            marginLeft: "auto",
          }}
        >
          🗑️
        </button>
      </div>

      {confirmDel && (
        <div
          style={{
            marginTop: 10,
            background: "#fff5f5",
            padding: 10,
            borderRadius: 8,
            border: "1px solid #fca5a5",
          }}
        >
          <div style={{ fontSize: 12, color: COLORS.danger, marginBottom: 8 }}>
            Pakka delete karna hai?
          </div>
          <button
            onClick={() => {
              onDelete(c.id);
              setConfirmDel(false);
            }}
            style={{
              background: COLORS.danger,
              color: "#fff",
              border: "none",
              padding: "4px 10px",
              borderRadius: 4,
              marginRight: 8,
            }}
          >
            Haan
          </button>
          <button
            onClick={() => setConfirmDel(false)}
            style={{
              background: "#ccc",
              border: "none",
              padding: "4px 10px",
              borderRadius: 4,
            }}
          >
            Nahi
          </button>
        </div>
      )}
    </div>
  );
}
