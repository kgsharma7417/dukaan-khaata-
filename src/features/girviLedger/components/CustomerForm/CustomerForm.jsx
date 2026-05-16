import { useState } from "react";

import { COLORS } from "../../constants/colors.js";

function Field({ label, children }) {
  return (
    <div>
      <label
        style={{
          fontSize: 12,
          color: COLORS.muted,
          display: "block",
          marginBottom: 4,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function inputStyle() {
  return {
    width: "100%",
    fontSize: 13,
    padding: "8px 10px",
    border: `0.5px solid ${COLORS.border}`,
    borderRadius: 8,
    background: COLORS.bg,
    color: "#111",
    outline: "none",
    boxSizing: "border-box",
  };
}

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

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = () => {
    if (!form.naam.trim() || !form.village.trim()) {
      alert("Naam aur Village zaroori hai!");
      return;
    }

    const round2 = (v) => Math.round(parseFloat(v ?? 0) * 100) / 100;

    const obj = {
      id: editId || Date.now().toString(),
      ...form,
      raqam: String(round2(form.raqam)),
      byaajDar: String(round2(form.byaajDar)),
      wapas: editId ? existing?.wapas || false : false,
      updatedAt: new Date().toISOString(),
    };

    onSave(obj);
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
      <div
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: COLORS.primary,
          marginBottom: 14,
        }}
      >
        {editId ? "✏️ Customer Edit Karo" : "➕ Naya Customer Jodo"}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <Field label="Naam *">
          <input
            style={inputStyle()}
            value={form.naam}
            onChange={set("naam")}
            placeholder="Ramesh Kumar"
          />
        </Field>
        <Field label="Village *">
          <input
            style={inputStyle()}
            value={form.village}
            onChange={set("village")}
            placeholder="Khandoli"
          />
        </Field>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <Field label="Mobile">
          <input
            style={inputStyle()}
            value={form.mobile}
            onChange={set("mobile")}
            placeholder="9876543210"
          />
        </Field>
        <Field label="Tarikh">
          <input
            type="date"
            style={inputStyle()}
            value={form.tarikh}
            onChange={set("tarikh")}
          />
        </Field>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <Field label="Raqam diya (₹)">
          <input
            type="number"
            step="1"
            style={inputStyle()}
            value={form.raqam}
            onChange={set("raqam")}
            placeholder="2000"
          />
        </Field>
        <Field label="Byaaj dar (% / maah)">
          <input
            type="number"
            step="0.1"
            style={inputStyle()}
            value={form.byaajDar}
            onChange={set("byaajDar")}
            placeholder="2"
          />
        </Field>
      </div>

      <div style={{ marginBottom: 8 }}>
        <Field label="Saamaan girvi rakha">
          <textarea
            style={{ ...inputStyle(), height: 60, resize: "vertical" }}
            value={form.saamaan}
            onChange={set("saamaan")}
            placeholder="Sona ki anguthi, chandi ki payal…"
          />
        </Field>
      </div>

      <div style={{ marginBottom: 12 }}>
        <Field label="Notes">
          <textarea
            style={{ ...inputStyle(), height: 50, resize: "vertical" }}
            value={form.notes}
            onChange={set("notes")}
            placeholder="Koi zaruri baat…"
          />
        </Field>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={handleSave}
          style={{
            fontSize: 13,
            padding: "0 18px",
            height: 36,
            background: COLORS.primary,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          ✓ {editId ? "Update" : "Save"}
        </button>
        <button
          onClick={onCancel}
          style={{
            fontSize: 13,
            padding: "0 14px",
            height: 36,
            background: "transparent",
            border: `0.5px solid ${COLORS.border}`,
            borderRadius: 8,
            cursor: "pointer",
            color: "#111",
          }}
        >
          Raho jane do
        </button>
      </div>
    </div>
  );
}
