import { useMemo } from "react";
import { calcByaaj, rupees } from "../../lib/girviUtils.js";
const COLORS = {
  bg: "#FDFAF5",
  card: "#FFFFFF",
  primary: "#1a472a",
  accent: "#c8a84b",
  danger: "#b91c1c",
  muted: "#6b7280",
  border: "#e5e0d5",
};

function formatDate(d) {
  if (!d) return "—";
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? "—" : dt.toLocaleString("hi-IN");
}

export default function WapasPage({
  customers = [],
  onBack,
  onGoFront,

  onNavHome,
  onNavGirvi,
  onNavBills,
  onNavReports,
  onNavProfile,
}) {
  const wapasCustomers = useMemo(
    () => customers.filter((c) => !!c.wapas),
    [customers],
  );

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh" }}>
      <div
        style={{
          background: COLORS.primary,
          padding: "14px 16px",
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 12,
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={onBack}
            style={{
              fontSize: 13,
              padding: "0 14px",
              height: 34,
              background: "rgba(255,255,255,0.12)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            ⟵ Back
          </button>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>
              ✓ Wapas Records
            </div>
            <div style={{ fontSize: 12, color: "#a7c4a0", marginTop: 2 }}>
              {wapasCustomers.length} records
            </div>
          </div>
        </div>

        <button
          onClick={onGoFront}
          style={{
            fontSize: 13,
            padding: "0 14px",
            height: 34,
            background: "rgba(255,255,255,0.12)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.22)",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
          title="Go to Front Page"
        >
          🏠 Front Page
        </button>
      </div>

      <div className="gl-page" style={{ padding: 16, marginLeft: 276 }}>
        {wapasCustomers.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 16px",
              color: COLORS.muted,
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 8 }}>✓</div>
            <div style={{ fontSize: 15 }}>Abhi koi wapas record nahi hai</div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            {wapasCustomers.map((c) => {
              const b = calcByaaj(c.raqam, c.byaajDar, c.tarikh);
              return (
                <div
                  key={c.id}
                  style={{
                    background: "rgba(255,255,255,0.7)",
                    border: `0.5px solid ${COLORS.border}`,
                    borderRadius: 14,
                    padding: 14,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                      marginBottom: 10,
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: COLORS.primary,
                          fontWeight: 900,
                          fontSize: 16,
                        }}
                      >
                        {c.naam}
                      </div>
                      <div style={{ fontSize: 12, color: COLORS.muted }}>
                        📍 {c.village || "—"}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.muted }}>
                      Updated: {formatDate(c.updatedAt)}
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
                      <div style={{ fontSize: 10, color: COLORS.muted }}>
                        Raqam
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 800 }}>
                        {rupees(parseFloat(c.raqam) || 0)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: COLORS.muted }}>
                        Byaaj dar
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 800 }}>
                        {c.byaajDar ? `${c.byaajDar}% / maah` : "—"}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: COLORS.muted }}>
                        Tarikh
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 800 }}>
                        {c.tarikh
                          ? new Date(c.tarikh).toLocaleDateString("hi-IN")
                          : "—"}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: COLORS.muted }}>
                        Mobile
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 800 }}>
                        {c.mobile || "—"}
                      </div>
                    </div>
                  </div>

                  {c.saamaan && (
                    <div
                      style={{
                        background: "#f7fee7",
                        border: "0.5px solid rgba(234, 179, 8, 0.25)",
                        borderRadius: 10,
                        padding: "8px 10px",
                        marginBottom: c.notes ? 8 : 0,
                        color: "#92400e",
                        fontSize: 13,
                      }}
                    >
                      📦 <strong>Saamaan:</strong> {c.saamaan}
                    </div>
                  )}

                  {c.notes && (
                    <div
                      style={{
                        color: COLORS.muted,
                        fontStyle: "italic",
                        fontSize: 12,
                      }}
                    >
                      📝 {c.notes}
                    </div>
                  )}

                  {b && (
                    <div
                      style={{
                        marginTop: 10,
                        fontSize: 12,
                        color: COLORS.muted,
                      }}
                    >
                      🕐 {b.days} din se girvi rakha tha
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Shared sticky bottom nav */}
      <div className="fp-bottom-nav" aria-hidden="true">
        <button type="button" className="fp-nav-item" onClick={onNavHome}>
          Home
        </button>

        <button
          type="button"
          className="fp-nav-item fp-nav-item--active"
          onClick={onNavGirvi}
        >
          Girvi
        </button>

        <button type="button" className="fp-nav-item" onClick={onNavBills}>
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
