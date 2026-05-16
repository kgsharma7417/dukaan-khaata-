import { useMemo, useState } from "react";

import { calcByaaj, initials, rupees } from "../../../../lib/girviUtils.js";
import { COLORS } from "../../constants/colors.js";

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

function Avatar({ name, imageUrl, onUpload, uploading, onPreview }) {
  if (!imageUrl) {
    return (
      <label
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          cursor: onUpload ? "pointer" : "default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          flexShrink: 0,
          border: onUpload
            ? `2px dashed ${COLORS.accent}66`
            : `2px solid ${COLORS.accent}44`,
        }}
        title={onUpload ? "Upload customer image" : undefined}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#e8f5e9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 600,
            color: COLORS.primary,
          }}
        >
          {initials(name)}
        </div>

        {onUpload ? (
          <input
            type="file"
            accept="image/*"
            onChange={onUpload}
            style={{ display: "none" }}
          />
        ) : null}

        {uploading ? (
          <div
            style={{
              position: "absolute",
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontWeight: 900,
              color: "#111",
            }}
          >
            …
          </div>
        ) : null}
      </label>
    );
  }

  return (
    <div
      style={{
        width: 44,
        height: 44,
        position: "relative",
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <button
        type="button"
        onClick={onPreview}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          padding: 0,
          margin: 0,
          background: "transparent",
          cursor: onPreview ? "pointer" : "default",
        }}
        title={onPreview ? "Open photo preview" : undefined}
      >
        <img
          src={imageUrl}
          alt="Customer"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </button>

      {onUpload ? (
        <label
          style={{
            position: "absolute",
            right: -4,
            bottom: -4,
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${COLORS.border}`,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}
          title="Change customer image"
        >
          <input
            type="file"
            accept="image/*"
            onChange={onUpload}
            style={{ display: "none" }}
          />
          <span style={{ fontSize: 12, lineHeight: 1 }}>📷</span>
        </label>
      ) : null}

      {uploading ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 900,
            color: "#111",
          }}
        >
          …
        </div>
      ) : null}
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
        📈 {b.days} din se girvi rakha hai
      </div>
    </div>
  );
}

function Btn({ onClick, icon, label, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 12,
        padding: "0 12px",
        height: 30,
        background: "transparent",
        border: `0.5px solid ${danger ? "#fca5a5" : COLORS.border}`,
        borderRadius: 8,
        cursor: "pointer",
        color: danger ? COLORS.danger : "#111",
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {icon} {label}
    </button>
  );
}

function getCustomerAvatarStorageKey(id) {
  return `dukkan_khaata_customer_avatar_v1::id:${String(id)}`;
}

export default function CustomerCard({
  c,
  dueAmount,
  onEdit,
  onDelete,
  onToggleWapas,
  onReceivePayment,
  onWhatsApp,
  _onBill,
}) {
  void _onBill;
  const b = calcByaaj(c.raqam, c.byaajDar, c.tarikh);
  const [confirmDel, setConfirmDel] = useState(false);
  const [showWapasInfo, setShowWapasInfo] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const storageKey = useMemo(() => getCustomerAvatarStorageKey(c.id), [c.id]);

  const [avatarImageUrl, setAvatarImageUrl] = useState(() => {
    try {
      const raw = window.localStorage?.getItem(storageKey);
      return raw || "";
    } catch {
      return "";
    }
  });

  const uploadHandler = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setAvatarImageUrl(result);
      try {
        window.localStorage?.setItem(storageKey, result);
      } catch {
        // ignore
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const totalReceived = (c.paymentHistory || []).reduce(
    (sum, x) => sum + (Math.round(parseFloat(x.amount) * 100) / 100 || 0),
    0,
  );
  const _dueAmount = b ? Math.max(0, b.total - totalReceived) : 0;
  const dayTag = () => {
    if (c.wapas) return null;
    if (!b) return null;
    if (b.days > 180) return <Tag label="180+ din" type="red" />;
    if (b.days > 90) return <Tag label="90+ din" type="amber" />;
    return null;
  };

  const wapasInfo = c.wapas
    ? `✓ Wapas ho gaya • updated: ${new Date(c.updatedAt).toLocaleString("hi-IN")}`
    : "";

  const CARD_PROPS = {
    header: {
      villagePrefix: "📍",
      nameFontSize: 16,
      nameWeight: 600,
    },
    meta: {
      items: [
        {
          label: "Raqam diya",
          value: (x) =>
            rupees(Math.round(parseFloat(x.raqam) * 100) / 100 || 0),
        },
        {
          label: "Byaaj dar",
          value: (x) => (x.byaajDar ? `${x.byaajDar}% / maah` : "—"),
        },
        {
          label: "Tarikh",
          value: (x) =>
            x.tarikh ? new Date(x.tarikh).toLocaleDateString("hi-IN") : "—",
        },
        { label: "Mobile", value: (x) => x.mobile || "—" },
      ],
    },
    saamaan: { prefixIcon: "📦", label: "Saamaan:" },
    notes: { prefixIcon: "📝" },
    tags: { activeLabel: "Girvi chal raha", wapasLabel: "✓ Wapas ho gaya" },
    actions: {
      wapasLabel: (isWapas) => (isWapas ? "Reopen" : "Wapas hua"),
      wapasIcon: (isWapas) => (isWapas ? "↩️" : "✓"),
      editLabel: "Edit",
      editIcon: "✏️",
      confirmDeleteText: (name) => `${name} ka record delete karna chahte ho?`,
      confirmDeleteBtn: "Haan, delete karo",
      cancelDeleteBtn: "Nahi",
    },
  };

  return (
    <div
      className="gl-customer-card"
      style={{
        background: COLORS.card,
        border: `0.5px solid ${COLORS.border}`,
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 10,
        transition: "border-color 0.2s",
      }}
    >
      {/* ── Header: Avatar + Name + Village ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <Avatar
          name={c.naam}
          imageUrl={avatarImageUrl || ""}
          onUpload={uploadHandler}
          uploading={uploading}
          onPreview={() => setPreviewOpen(true)}
        />

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: CARD_PROPS.header.nameFontSize,
              fontWeight: CARD_PROPS.header.nameWeight,
              color: COLORS.primary,
            }}
          >
            {c.naam}
          </div>
          <div style={{ fontSize: 12, color: COLORS.muted }}>
            {CARD_PROPS.header.villagePrefix} {c.village || "—"}
          </div>
        </div>
      </div>

      {/* ── Full-screen image preview ── */}
      {previewOpen && avatarImageUrl ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.75)",
            zIndex: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setPreviewOpen(false)}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 560,
              borderRadius: 22,
              overflow: "hidden",
              background: "#fff",
              boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "none",
                background: "rgba(15, 23, 42, 0.9)",
                color: "#fff",
                cursor: "pointer",
                fontSize: 18,
                lineHeight: 1,
                zIndex: 1,
              }}
            >
              ×
            </button>
            <img
              src={avatarImageUrl}
              alt="Customer preview"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        </div>
      ) : null}

      {/* ── Meta grid: raqam, byaaj dar, tarikh, mobile ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6px 12px",
          marginBottom: 10,
        }}
      >
        {CARD_PROPS.meta.items.map((item) => {
          const val = item.value(c);
          return (
            <div key={item.label}>
              <div
                style={{ fontSize: 10, color: COLORS.muted, marginBottom: 2 }}
              >
                {item.label}
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#111" }}>
                {val}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Saamaan ── */}
      {c.saamaan && (
        <div
          style={{
            background: "#fafaf7",
            border: `0.5px solid ${COLORS.border}`,
            borderRadius: 8,
            padding: "8px 10px",
            marginBottom: 10,
            fontSize: 13,
            color: COLORS.muted,
          }}
        >
          {CARD_PROPS.saamaan.prefixIcon}{" "}
          <strong style={{ color: "#111" }}>{CARD_PROPS.saamaan.label}</strong>{" "}
          {c.saamaan}
        </div>
      )}

      {/* ── Notes ── */}
      {c.notes && (
        <div
          style={{
            fontSize: 12,
            color: COLORS.muted,
            marginBottom: 10,
            fontStyle: "italic",
          }}
        >
          {CARD_PROPS.notes.prefixIcon} {c.notes}
        </div>
      )}

      {/* ── Total box ── */}
      {b && !c.wapas && <TotalBox b={b} />}

      {/* ── Due amount ── */}
      {!c.wapas && b && (
        <div
          style={{
            marginBottom: 10,
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
            background: "#f8fafc",
            border: `0.5px solid ${COLORS.border}`,
            borderRadius: 10,
            padding: "8px 10px",
          }}
        >
          <div style={{ fontSize: 12, color: COLORS.muted }}>Due Amount</div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 900,
              color: dueAmount || _dueAmount ? "#92400e" : "#166534",
            }}
          >
            {rupees(dueAmount || _dueAmount)}
          </div>
        </div>
      )}

      {/* ── Status tags ── */}
      <div
        style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}
      >
        {c.wapas ? (
          <Tag label={CARD_PROPS.tags.wapasLabel} type="green" />
        ) : (
          <Tag label={CARD_PROPS.tags.activeLabel} type="amber" />
        )}
        {dayTag()}
      </div>

      <hr
        style={{
          border: "none",
          borderTop: `0.5px solid ${COLORS.border}`,
          marginBottom: 10,
        }}
      />

      {/* ── Action buttons ── */}
      {confirmDel ? (
        <div
          style={{
            background: "#fff5f5",
            borderRadius: 8,
            padding: "10px 12px",
            border: `0.5px solid #fca5a5`,
          }}
        >
          <div style={{ fontSize: 13, color: COLORS.danger, marginBottom: 8 }}>
            <strong>{c.naam}</strong>{" "}
            {CARD_PROPS.actions
              .confirmDeleteText(c.naam)
              .replace(`${c.naam} `, "")}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => {
                setConfirmDel(false);
                onDelete(c.id);
              }}
              style={{
                fontSize: 12,
                padding: "0 12px",
                height: 30,
                color: COLORS.danger,
                borderColor: "#fca5a5",
                background: "transparent",
                borderRadius: 8,
                border: `0.5px solid #fca5a5`,
                cursor: "pointer",
              }}
            >
              {CARD_PROPS.actions.confirmDeleteBtn}
            </button>
            <button
              onClick={() => setConfirmDel(false)}
              style={{
                fontSize: 12,
                padding: "0 12px",
                height: 30,
                background: "transparent",
                border: `0.5px solid ${COLORS.border}`,
                borderRadius: 8,
                cursor: "pointer",
                color: "#111",
              }}
            >
              {CARD_PROPS.actions.cancelDeleteBtn}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {!c.wapas && (
            <>
              <Btn onClick={() => onEdit?.(c.id)} icon="✏️" label="Edit" />

              <Btn
                onClick={() => {
                  const amountStr = prompt("Payment amount (₹)") || "";
                  const amt =
                    Math.round((parseFloat(amountStr) || 0) * 100) / 100;
                  if (!amt) return;

                  const dateInput = prompt("Payment date (YYYY-MM-DD)") || "";
                  const dateObj = dateInput ? new Date(dateInput) : new Date();
                  const date = Number.isNaN(dateObj.getTime())
                    ? new Date().toISOString()
                    : dateObj.toISOString();

                  const note = prompt("Note (optional)") || "";
                  onReceivePayment(c.id, { amount: amt, date, note });
                }}
                icon="₹"
                label="Receive Payment"
              />

              <Btn
                onClick={() => setShowWapasInfo((v) => !v)}
                icon="🤾"
                label="Payment History"
              />

              <Btn
                onClick={() => onWhatsApp(c.id, dueAmount || _dueAmount)}
                icon="💬"
                label="WhatsApp"
              />
            </>
          )}

          <Btn
            onClick={() => onToggleWapas(c.id)}
            icon={CARD_PROPS.actions.wapasIcon(!!c.wapas)}
            label={CARD_PROPS.actions.wapasLabel(!!c.wapas)}
          />

          <Btn onClick={() => setConfirmDel(true)} icon="🗑️" label="" danger />
        </div>
      )}

      {/* ── Payment history panel ── */}
      {showWapasInfo && !c.wapas && (
        <div
          style={{
            marginTop: 10,
            background: "#eff6ff",
            border: "0.5px solid rgba(59, 130, 246, 0.3)",
            borderRadius: 10,
            padding: "10px 12px",
            fontSize: 13,
            color: "#1d4ed8",
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: 6 }}>
            🤾 Payment History
          </div>

          {!c.paymentHistory || c.paymentHistory.length === 0 ? (
            <div style={{ color: COLORS.muted }}>
              Abhi koi payment nahi hua.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 6 }}>
              {(c.paymentHistory || []).slice(0, 10).map((h, idx) => {
                const d = h.date ? new Date(h.date) : null;
                const dateStr =
                  d && !Number.isNaN(d.getTime())
                    ? d.toLocaleDateString("hi-IN")
                    : "—";
                const noteStr = h.note ? ` • ${h.note}` : "";

                return (
                  <div
                    key={`${c.id}-pay-${idx}`}
                    style={{
                      background: "rgba(255,255,255,0.6)",
                      border: `0.5px solid ${COLORS.border}`,
                      borderRadius: 8,
                      padding: "8px 10px",
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <div style={{ color: COLORS.primary, fontWeight: 800 }}>
                      {dateStr}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 900 }}>
                        {rupees(
                          Math.round(parseFloat(h.amount) * 100) / 100 || 0,
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: COLORS.muted }}>
                        {noteStr || "—"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginTop: 8, color: COLORS.muted, fontSize: 12 }}>
            Total received: {rupees(totalReceived)}
          </div>
        </div>
      )}

      {showWapasInfo && c.wapas && (
        <div
          style={{
            marginTop: 10,
            background: "#ecfdf5",
            border: `0.5px solid rgba(16, 185, 129, 0.4)`,
            borderRadius: 10,
            padding: "10px 12px",
            fontSize: 13,
            color: "#065f46",
          }}
        >
          {wapasInfo}
        </div>
      )}
    </div>
  );
}
