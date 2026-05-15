import React, { useState } from "react";
import { COLORS } from "../constants/colors";

const inputStyle = {
  width: "100%",
  fontSize: 13,
  padding: "8px 10px",
  border: `1px solid ${COLORS.border}`,
  borderRadius: 8,
  background: "#FFFFFF",
  color: "#111111",
  outline: "none",
  boxSizing: "border-box",
};

export default function CustomerForm({ editId, customers, onSave, onCancel }) {
  const existing = editId ? customers.find((c) => c.id === editId) : {};
  const [form, setForm] = useState({
    naam: existing?.naam || "",
    village: existing?.village || "",
    mobile: existing?.mobile || "",
    tarikh: existing?.tarikh || "",
    raqam: existing?.raqam || "",
    byaajDar: existing?.byaajDar || "",
    saamaan: existing?.saamaan || "",
    notes: existing?.notes || "",
  });

  const handleSave = () => {
    if (!form.naam.trim() || !form.village.trim()) {
      alert("Naam aur Village zaroori hai!");
      return;
    }
    onSave({
      id: editId || Date.now().toString(),
      ...form,
      raqam: Math.round(parseFloat(form.raqam) || 0).toString(),
      wapas: editId ? existing?.wapas || false : false,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div
      style={{
        background: COLORS.card,
        border: `0.5px solid ${COLORS.border}`,
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
      }}
    >
      <h3 style={{ margin: "0 0 14px", color: COLORS.primary }}>
        {editId ? "✏️ Edit Karo" : "➕ Naya Grahak"}
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <input
          style={inputStyle}
          value={form.naam}
          onChange={(e) => setForm({ ...form, naam: e.target.value })}
          placeholder="Naam *"
        />
        <input
          style={inputStyle}
          value={form.village}
          onChange={(e) => setForm({ ...form, village: e.target.value })}
          placeholder="Village *"
        />
        <input
          style={inputStyle}
          value={form.raqam}
          onChange={(e) => setForm({ ...form, raqam: e.target.value })}
          placeholder="Raqam (₹) *"
          type="number"
        />
        <input
          style={inputStyle}
          value={form.byaajDar}
          onChange={(e) => setForm({ ...form, byaajDar: e.target.value })}
          placeholder="Byaaj (%) *"
          type="number"
        />
      </div>
      <textarea
        style={{ ...inputStyle, height: 60, marginTop: 8 }}
        value={form.saamaan}
        onChange={(e) => setForm({ ...form, saamaan: e.target.value })}
        placeholder="Kya saamaan rakha hai?"
      />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={handleSave}
          style={{
            background: COLORS.primary,
            color: "#fff",
            border: "none",
            padding: "8px 20px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Save
        </button>
        <button
          onClick={onCancel}
          style={{
            background: "none",
            border: `1px solid ${COLORS.border}`,
            padding: "8px 20px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
