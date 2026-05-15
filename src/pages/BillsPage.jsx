import { useMemo, useState } from "react";
import FrontShim from "../features/frontPage/FrontShim.jsx";
import { rupees } from "../lib/girviUtils";

const BILL_STORAGE_KEY = "dukkan_khaata_saved_bills_v1";

function loadBills() {
  try {
    const raw = window.localStorage?.getItem(BILL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveBills(next) {
  try {
    window.localStorage?.setItem(BILL_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export default function BillsPage({
  onNavHome,
  onNavGirvi,
  onNavBills,
  onNavReports,
  onNavProfile,
}) {
  const [bills, setBills] = useState(() => loadBills());

  const sorted = useMemo(() => {
    return [...bills].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }, [bills]);

  const onDelete = (billId) => {
    const next = bills.filter((b) => b.id !== billId);
    setBills(next);
    saveBills(next);
  };

  const onOpen = (billDoc) => {
    // BillDoc me previewHtml saved hota hai, so CreateBillPage ki tarah print/open possible nahi
    // — is liye simplest: delete/ view preview ke liye same html ko new window me open kar denge.
    try {
      const html = billDoc?.previewHtml;
      if (!html) {
        alert("Is bill ka preview HTML missing hai.");
        return;
      }
      const w = window.open("", "_blank", "noopener,noreferrer");
      if (!w) return;
      w.document.open();
      w.document.write(html);
      w.document.close();
    } catch {
      alert("Bill open failed.");
    }
  };

  return (
    <FrontShim
      pageTitle="Bills"
      active="bills"
      onNavHome={onNavHome}
      onNavGirvi={onNavGirvi}
      onNavBills={onNavBills}
      onNavReports={onNavReports}
      onNavProfile={onNavProfile}
    >
      <div style={{ marginTop: 14 }}>
        <div style={{ fontWeight: 1000, color: "#111", fontSize: 18 }}>
          Saved Bills
        </div>

        <div style={{ marginTop: 10, display: "grid", gap: 12 }}>
          {sorted.length === 0 ? (
            <div style={{ color: "#111", fontWeight: 900, opacity: 0.6 }}>
              Abhi koi saved bill nahi hai. Bill banao page se generate karke
              save karo.
            </div>
          ) : (
            sorted.map((b) => (
              <div
                key={b.id}
                style={{
                  borderRadius: 18,
                  border: "2px solid rgba(17,24,39,0.10)",
                  background: "rgba(255,255,255,0.65)",
                  padding: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 1000, color: "#111" }}>
                      {b.customer?.name || "Customer"}
                    </div>
                    <div
                      style={{
                        fontWeight: 900,
                        color: "#6b7280",
                        fontSize: 12,
                      }}
                    >
                      {b.createdAt
                        ? new Date(b.createdAt).toLocaleString()
                        : "—"}
                    </div>
                    <div
                      style={{
                        marginTop: 6,
                        fontWeight: 1000,
                        color: "#0f172a",
                      }}
                    >
                      {rupees(Number(b.totals?.grandTotal || 0))}
                    </div>
                  </div>

                  <div
                    style={{ display: "flex", gap: 10, alignItems: "center" }}
                  >
                    <button
                      type="button"
                      className="gl-btn gl-btn--ghost"
                      style={{ height: 36, borderStyle: "dashed" }}
                      onClick={() => onOpen(b)}
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
                      }}
                      onClick={() => onDelete(b.id)}
                      title="Delete bill"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </FrontShim>
  );
}
