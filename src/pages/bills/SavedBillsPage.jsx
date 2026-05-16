import { useMemo, useRef, useState } from "react";

import { rupees } from "../../lib/girviUtils";
import { COLORS } from "../../features/girviLedger/constants/colors.js";

const BILL_STORAGE_KEY = "dukkan_khaata_saved_bills_v1";

function readLocalJson(key, fallback) {
  try {
    const raw = window.localStorage?.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function normalizeSearch(s) {
  return String(s ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function getBillCustomerName(b) {
  return String(b?.customer?.name ?? "").trim();
}

function getBillCustomerMobile(b) {
  return String(b?.customer?.mobile ?? "").trim();
}

function getBillGrandTotal(b) {
  const n = Number(b?.totals?.grandTotal ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function safeDateStr(b) {
  const d = b?.createdAt ? new Date(b.createdAt) : null;
  if (!d || Number.isNaN(d.getTime())) return "—";
  try {
    return d.toLocaleDateString("hi-IN");
  } catch {
    return "—";
  }
}

export default function SavedBillsPage({
  onBack,
  onNavHome,
  onNavGirvi,
  onNavBills,
  onNavReports,
  onNavProfile,
}) {
  const billsPanelRef = useRef(null);

  const [bills, setBills] = useState(() => readLocalJson(BILL_STORAGE_KEY, []));

  const [qName, setQName] = useState("");
  const [qMobile, setQMobile] = useState("");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewBillId, setPreviewBillId] = useState(null);

  const parsedBills = useMemo(() => {
    if (!Array.isArray(bills)) return [];
    return bills;
  }, [bills]);

  const filtered = useMemo(() => {
    const nameQ = normalizeSearch(qName);
    const mobileQ = normalizeSearch(qMobile);

    if (!nameQ && !mobileQ) return parsedBills;

    return parsedBills.filter((b) => {
      const n = normalizeSearch(getBillCustomerName(b));
      const m = normalizeSearch(getBillCustomerMobile(b));
      const matchName = nameQ ? n.includes(nameQ) : true;
      const matchMobile = mobileQ ? m.includes(mobileQ) : true;
      return matchName && matchMobile;
    });
  }, [parsedBills, qName, qMobile]);

  const saveBills = (next) => {
    setBills(next);
    try {
      window.localStorage?.setItem(BILL_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const handleDelete = (billId) => {
    const next = parsedBills.filter((b) => b?.id !== billId);
    saveBills(next);

    if (previewBillId === billId) {
      setPreviewBillId(null);
      setPreviewOpen(false);
      setPreviewHtml("");
    }
  };

  const handleOpen = (b) => {
    setPreviewBillId(b?.id ?? null);
    setPreviewHtml(b?.previewHtml || "");
    setPreviewOpen(true);

    setTimeout(() => {
      billsPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  return (
    <div
      style={{
        background: COLORS.bg || "#f7f7f7",
        minHeight: "100vh",
        padding: 16,
        paddingBottom: 120,
      }}
    >
      <div
        style={{
          borderRadius: 26,
          background: "#ffffff",
          border: "1px solid rgba(17,24,39,0.08)",
          boxShadow: "0 24px 60px rgba(15,23,42,0.08)",
          padding: 16,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={onBack || onNavHome}
              className="gl-btn gl-btn--ghost"
              style={{ height: 36, minWidth: 88, borderRadius: 18 }}
            >
              190 Back
            </button>

            <div
              style={{
                color: COLORS.primary || "#0f766e",
                fontWeight: 1000,
                fontSize: 18,
              }}
            >
              Saved Bills
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 220 }}>
            <div
              style={{ fontWeight: 1000, fontSize: 12, color: COLORS.muted }}
            >
              Search by name
            </div>
            <input
              value={qName}
              onChange={(e) => setQName(e.target.value)}
              placeholder="e.g. Krish"
              style={{
                width: "100%",
                height: 44,
                borderRadius: 14,
                border: `1px solid rgba(17,24,39,0.10)`,
                background: "rgba(255,255,255,0.95)",
                padding: "0 14px",
                outline: "none",
                fontWeight: 900,
                color: "#111",
                marginTop: 6,
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 220 }}>
            <div
              style={{ fontWeight: 1000, fontSize: 12, color: COLORS.muted }}
            >
              Search by mobile
            </div>
            <input
              value={qMobile}
              onChange={(e) => setQMobile(e.target.value)}
              placeholder="e.g. 98765"
              inputMode="tel"
              style={{
                width: "100%",
                height: 44,
                borderRadius: 14,
                border: `1px solid rgba(17,24,39,0.10)`,
                background: "rgba(255,255,255,0.95)",
                padding: "0 14px",
                outline: "none",
                fontWeight: 900,
                color: "#111",
                marginTop: 6,
              }}
            />
          </div>

          <div style={{ minWidth: 160 }}>
            <div
              style={{ fontWeight: 1000, fontSize: 12, color: COLORS.muted }}
            >
              &nbsp;
            </div>
            <button
              className="gl-btn gl-btn--ghost"
              style={{
                height: 44,
                borderStyle: "dashed",
                borderColor: "rgba(17,24,39,0.45)",
                background: "rgba(255,255,255,0.98)",
                borderRadius: 14,
                width: "100%",
              }}
              onClick={() => {
                setQName("");
                setQMobile("");
              }}
            >
              Clear
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: 10,
            color: COLORS.muted,
            fontWeight: 850,
            fontSize: 12,
          }}
        >
          Showing {filtered.length} bill(s)
        </div>
      </div>

      <div
        ref={billsPanelRef}
        style={{
          maxWidth: 980,
          margin: "0 auto",
          borderRadius: 26,
          background: "rgba(255,255,255,0.98)",
          border: "1px solid rgba(17,24,39,0.08)",
          boxShadow: "0 18px 36px rgba(15,23,42,0.05)",
          padding: 16,
        }}
      >
        {previewOpen ? (
          <div style={{ marginBottom: 14 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  fontWeight: 1000,
                  color: COLORS.primary,
                  fontSize: 16,
                }}
              >
                Preview
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  className="gl-btn gl-btn--ghost"
                  style={{
                    height: 36,
                    borderStyle: "dashed",
                    borderColor: "rgba(239,68,68,0.55)",
                    background: "rgba(255,255,255,0.98)",
                    borderRadius: 14,
                  }}
                  onClick={() => {
                    setPreviewOpen(false);
                    setPreviewHtml("");
                    setPreviewBillId(null);
                  }}
                >
                  Close
                </button>

                <button
                  className="gl-btn gl-btn--accent"
                  style={{ height: 36, borderRadius: 14 }}
                  onClick={() => {
                    const iframe = document.getElementById("savedBillIframe");
                    const win = iframe?.contentWindow;
                    if (!win) return;
                    win.focus();
                    win.print();
                  }}
                >
                  Print
                </button>
              </div>
            </div>

            <iframe
              id="savedBillIframe"
              title="Saved Bill Preview"
              style={{
                width: "100%",
                height: 560,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                background: "white",
              }}
              srcDoc={previewHtml}
            />
          </div>
        ) : null}

        {filtered.length === 0 ? (
          <div
            style={{
              color: COLORS.muted,
              fontWeight: 900,
              fontSize: 13,
              padding: 14,
            }}
          >
            No saved bills found.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {filtered.map((b) => (
              <div
                key={b.id}
                style={{
                  borderRadius: 16,
                  border: "1px solid rgba(17,24,39,0.12)",
                  padding: 12,
                  background: "rgba(255,255,255,0.65)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ minWidth: 240 }}>
                  <div style={{ fontWeight: 1000, color: COLORS.primary }}>
                    {getBillCustomerName(b) || "Customer"}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: COLORS.muted,
                      fontWeight: 850,
                    }}
                  >
                    {safeDateStr(b)}
                    {getBillCustomerMobile(b)
                      ? `  ${getBillCustomerMobile(b)}`
                      : ""}
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 12,
                      color: COLORS.muted,
                      fontWeight: 850,
                    }}
                  >
                    Grand Total:  {rupees(getBillGrandTotal(b))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <button
                    type="button"
                    className="gl-btn gl-btn--ghost"
                    style={{
                      height: 36,
                      borderStyle: "dashed",
                      borderColor: "rgba(17,24,39,0.45)",
                      color: "#111",
                      background: "rgba(255,255,255,0.98)",
                      borderRadius: 14,
                    }}
                    onClick={() => handleOpen(b)}
                  >
                    Open
                  </button>

                  <button
                    type="button"
                    className="gl-btn gl-btn--ghost"
                    style={{
                      height: 36,
                      borderStyle: "dashed",
                      borderColor: "rgba(239,68,68,0.55)",
                      color: "#111",
                      background: "rgba(255,255,255,0.98)",
                      borderRadius: 14,
                    }}
                    onClick={() => {
                      const ok = window.confirm("Delete this bill? ");
                      if (!ok) return;
                      handleDelete(b.id);
                    }}
                    title="Delete bill"
                  >
                     Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fp-bottom-nav" aria-hidden="true">
        <button type="button" className="fp-nav-item" onClick={onNavHome}>
          Home
        </button>
        <button type="button" className="fp-nav-item" onClick={onNavGirvi}>
          Girvi
        </button>
        <button
          type="button"
          className="fp-nav-item fp-nav-item--active"
          onClick={onNavBills}
        >
          Bills
        </button>
        <button type="button" className="fp-nav-item" onClick={onNavReports}>
          Reports
        </button>
        <button type="button" className="fp-nav-item" onClick={onNavProfile}>
          Profile
        </button>
      </div>
    </div>
  );
}
