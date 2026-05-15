import { useCallback, useEffect, useState } from "react";
import "./styles.css";
import "../../responsive.css";
import "../../brand.css";

import { calcByaaj, rupees } from "../../lib/girviUtils";
import { cloudLoad, cloudSave } from "../../lib/girviStorage";

import StatusBar from "./components/StatusBar/StatusBar.jsx";
import CustomerCard from "./components/CustomerCard/CustomerCard.jsx";
import CustomerForm from "./components/CustomerForm/CustomerForm.jsx";

import { COLORS } from "./constants/colors.js";

function safeLower(s) {
  return (s || "").toLowerCase();
}

export default function GirviLedger({
  openCreateAccount,
  onCreateAccountOpened,
  onGoWapas,
  onCustomersReady,
  onWapasCustomersReady,
  onGoCreateBill,
  onGoFront,

  onDashboardStats,

  onNavHome,
  onNavGirvi,
  onNavBills,
  onNavReports,
  onNavProfile,
}) {
  const [customers, setCustomers] = useState([]);
  const [status, setStatus] = useState({
    state: "loading",
    text: "Load ho raha hai…",
  });
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showWapasAll, setShowWapasAll] = useState(false);
  const [toast, setToast] = useState("");

  const [filterMode] = useState("all"); // all | wapas | active | old

  useEffect(() => {
    if (!openCreateAccount) return;

    // Avoid synchronous state updates directly inside the effect.
    queueMicrotask(() => {
      setShowForm(true);
      setEditId(null);
    });

    onCreateAccountOpened?.();
  }, [openCreateAccount, onCreateAccountOpened]);

  useEffect(() => {
    cloudLoad()
      .then((data) => {
        setCustomers(data);
        onCustomersReady?.(data);
        setStatus({
          state: "ok",
          text: `${data.length} customers · Cloud synced`,
        });
      })
      .catch(() => {
        setStatus({ state: "err", text: "Load nahi hua" });
      });
  }, [onCustomersReady]);

  const fireToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const persist = useCallback(async (newList) => {
    setStatus({ state: "loading", text: "Save ho raha hai…" });
    try {
      await cloudSave(newList);
      setStatus({
        state: "ok",
        text: `${newList.length} customers · Cloud synced`,
      });
      fireToast("Saved! ✓");
    } catch {
      setStatus({ state: "err", text: "Save nahi hua" });
      fireToast("Error: save nahi hua");
    }
  }, []);

  const handleSave = async (obj) => {
    const updated = editId
      ? customers.map((c) => (c.id === editId ? obj : c))
      : [obj, ...customers];
    setCustomers(updated);
    setShowForm(false);
    setEditId(null);
    await persist(updated);
  };

  const handleDelete = async (id) => {
    const updated = customers.filter((c) => c.id !== id);
    setCustomers(updated);
    await persist(updated);
  };

  const handleToggleWapas = async (id) => {
    const updated = customers.map((c) =>
      c.id === id
        ? { ...c, wapas: !c.wapas, updatedAt: new Date().toISOString() }
        : c,
    );
    setCustomers(updated);
    await persist(updated);
  };

  const handleReceivePayment = async (id, payload) => {
    const updated = customers.map((x) => {
      if (x.id !== id) return x;
      const paymentHistory = [...(x.paymentHistory || [])];
      paymentHistory.unshift({
        amount: payload.amount,
        date: payload.date,
        note: payload.note || "",
      });
      return { ...x, paymentHistory, updatedAt: new Date().toISOString() };
    });
    setCustomers(updated);
    await persist(updated);
    fireToast("Payment saved ✓");
  };

  const handleWhatsApp = (id, due) => {
    const cust = customers.find((x) => x.id === id);
    const mobile = cust?.mobile;
    if (!mobile) {
      alert("Mobile number nahi hai");
      return;
    }

    const dueAmount = Math.max(0, Number(due) || 0);
    const name = (cust?.naam || "").trim();

    const text =
      `Namaste ${name ? name + " " : ""}ji,\n` +
      `Aapka Hisaab: Due Amount ${rupees(dueAmount)}.\n` +
      `Kripya payment kar dein. Thanks!`;

    const url = `https://wa.me/${mobile.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleBill = (id) => {
    const cust = customers.find((x) => x.id === id);
    if (!cust) return;

    const weightStr = prompt("Bill Weight (kg / unit)") || "";
    const weight = Math.max(0, parseFloat(weightStr) || 0);

    const rateStr = prompt("Market Rate (₹ per unit)") || "";
    const marketRate = Math.max(0, parseFloat(rateStr) || 0);

    if (!weight || !marketRate) {
      alert("Weight aur Market Rate dono valid hone chahiye.");
      return;
    }

    const b = calcByaaj(cust.raqam, cust.byaajDar, cust.tarikh);
    const paymentHistory = cust.paymentHistory || [];
    const totalReceived = paymentHistory.reduce(
      (sum, x) => sum + (parseFloat(x.amount) || 0),
      0,
    );
    const dueAmount = b ? Math.max(0, b.total - totalReceived) : 0;

    const billTotal = weight * marketRate;

    const name = (cust.naam || "").trim();
    const village = cust.village || "—";
    const mobile = cust.mobile || "—";
    const dateStr = new Date().toLocaleString("hi-IN");

    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>Bill - ${name}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 24px; }
      h1 { margin: 0 0 6px; font-size: 22px; }
      .sub { color:#555; font-size: 12px; margin-bottom: 16px; }
      .row { display:flex; justify-content: space-between; gap: 16px; margin: 6px 0; }
      .k { color:#444; font-size: 12px; }
      .v { font-weight: 700; }
      table { width: 100%; border-collapse: collapse; margin-top: 16px; }
      th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 12px; }
      th { background:#f6f6f6; }
      .total { margin-top: 12px; font-size: 14px; font-weight: 800; }
      .foot { margin-top: 28px; font-size: 12px; color:#666; }
    </style>
  </head>
  <body>
    <h1>✓ Bill</h1>
    <div class="sub">Customer: ${name || "—"} · Date: ${dateStr}</div>

    <div class="row"><div class="k">Village</div><div class="v">${village}</div></div>
    <div class="row"><div class="k">Mobile</div><div class="v">${mobile}</div></div>

    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Weight</td><td>${weight}</td></tr>
        <tr><td>Market Rate</td><td>₹ ${marketRate}</td></tr>
        <tr><td>Bill Total</td><td>₹ ${billTotal.toFixed(2)}</td></tr>
        <tr><td>Due Amount (Girvi)</td><td>₹ ${dueAmount.toFixed(0)}</td></tr>
      </tbody>
    </table>

    <div class="total">Net Due: ₹ ${dueAmount.toFixed(0)}</div>
    <div class="foot">आपका बिल/प्रिंट सेव करने के लिए Print dialog से “Save as PDF” चुनें।</div>

    <script>
      window.onload = function() { window.print(); };
    </script>
  </body>
</html>`;

    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) {
      alert("Popup blocked ho raha hai. Please allow popups.");
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  const dashboardTotals = customers.reduce(
    (acc, cust) => {
      const b = calcByaaj(cust.raqam, cust.byaajDar, cust.tarikh);
      if (!b) return acc;

      const totalReceived = (cust.paymentHistory || []).reduce(
        (sum, x) => sum + (parseFloat(x.amount) || 0),
        0,
      );

      const due = Math.max(0, b.total - totalReceived);
      if (cust.wapas) return acc;

      acc.totalOutstanding += due;
      if (b.days >= 90 && due > 0) acc.criticalCount += 1;
      return acc;
    },
    { totalOutstanding: 0, criticalCount: 0 },
  );

  const activeGirviCount = customers.reduce(
    (sum, cust) => sum + (!cust.wapas ? 1 : 0),
    0,
  );

  useEffect(() => {
    onDashboardStats?.({
      activeGirviCount,
      totalOutstanding: dashboardTotals.totalOutstanding,
    });
  }, [activeGirviCount, dashboardTotals.totalOutstanding, onDashboardStats]);

  const filtered = customers.filter((c) => {
    const q = safeLower(search);
    const qDigits = String(search || "").replace(/\D/g, "");

    const naam = safeLower(c.naam);
    const village = safeLower(c.village);

    const mobileRaw = String(c.mobile || "");
    const mobileLower = safeLower(mobileRaw);
    const mobileDigits = mobileRaw.replace(/\D/g, "");

    const matchName = naam.includes(q);
    const matchVillage = village.includes(q);

    const matchMobileDigits =
      qDigits.length > 0 && mobileDigits.includes(qDigits);

    // If user typed digits like 98765 -> match mobile digits
    // If user typed "+91" (no digits after cleaning?) -> digits exist in query and will match above.
    // If user typed something non-digit -> match text
    const matchMobileText = qDigits.length === 0 && mobileLower.includes(q);

    const isSearchEmpty = !q && qDigits.length === 0;
    const matchSearch = isSearchEmpty
      ? true
      : matchName || matchVillage || matchMobileDigits || matchMobileText;

    if (!matchSearch) return false;

    if (filterMode === "all") return true;
    if (filterMode === "wapas") return !!c.wapas;
    if (filterMode === "active") return !c.wapas;

    if (filterMode === "old") {
      if (!c.tarikh) return false;
      const itemTime = new Date(c.tarikh).getTime();
      if (Number.isNaN(itemTime)) return false;
      const now = new Date().getTime();
      const daysOld = (now - itemTime) / 86400000;
      return daysOld > 365;
    }

    return true;
  });

  return (
    <div className="gl-feature-root" style={{ background: COLORS.bg }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}} @keyframes slideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>

      <div className="gl-topbar">
        <div className="gl-title">🎊 Girvi Ledger</div>
        <div className="gl-subtitle">Customer ka pura hisaab</div>

        <div className="gl-topbar-row">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Naam ya village se dhundho…"
            className="gl-search"
          />

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.10)",
                border: `1px solid rgba(255,255,255,0.20)`,
                borderRadius: 12,
                padding: "8px 12px",
                color: "#fff",
                minWidth: 220,
              }}
            >
              <div style={{ fontSize: 11, opacity: 0.85, fontWeight: 800 }}>
                Total Outstanding
              </div>
              <div style={{ fontSize: 16, fontWeight: 950, marginTop: 2 }}>
                {rupees(dashboardTotals.totalOutstanding)}
              </div>
            </div>

            <button
              onClick={() => {
                if (onGoWapas) {
                  onWapasCustomersReady?.(customers.filter((c) => !!c.wapas));
                  onGoWapas();
                } else {
                  setShowWapasAll((v) => !v);
                }
              }}
              className="gl-btn gl-btn--ghost"
            >
              <span>✓</span> Wapas Details
            </button>

            <button
              onClick={() => {
                setShowForm(true);
                setEditId(null);
              }}
              className="gl-btn gl-btn--accent"
            >
              Create New Entry
            </button>

            <button
              onClick={() => onGoCreateBill?.()}
              className="gl-btn gl-btn--ghost"
              style={{ borderStyle: "dashed" }}
            >
              + Create Bill
            </button>

            <button
              onClick={() => onGoFront?.()}
              className="gl-btn gl-btn--ghost"
              style={{ borderStyle: "dashed" }}
              title="Go to Front Page"
            >
              🏠 Front Page
            </button>
          </div>
        </div>
      </div>

      <div className="gl-page" style={{ padding: 16, marginLeft: 276 }}>
        <StatusBar state={status.state} text={status.text} />

        {showWapasAll && (
          <div className="gl-panel gl-panel--green">
            <div className="gl-panel-head">
              <div className="gl-panel-title">
                ✓ Wapas ho chuke saare records
              </div>
              <button
                onClick={() => setShowWapasAll(false)}
                className="gl-btn gl-btn--panel-close"
              >
                Close
              </button>
            </div>

            {customers.filter((c) => !!c.wapas).length === 0 ? (
              <div className="gl-panel-empty">
                Abhi koi wapas record nahi hai.
              </div>
            ) : (
              <div className="gl-wapas-list">
                {customers
                  .filter((c) => !!c.wapas)
                  .map((c) => (
                    <div key={c.id} className="gl-wapas-card">
                      <div className="gl-wapas-card-head">
                        <div>
                          <div className="gl-wapas-name">{c.naam}</div>
                          <div className="gl-wapas-meta">
                            📍 {c.village || "—"}
                          </div>
                        </div>
                        <div className="gl-wapas-updated">
                          Updated:{" "}
                          {c.updatedAt
                            ? new Date(c.updatedAt).toLocaleString("hi-IN")
                            : "—"}
                        </div>
                      </div>

                      <div className="gl-wapas-grid">
                        <div>
                          <div className="gl-wapas-label">Raqam</div>
                          <div className="gl-wapas-value">
                            {rupees(parseFloat(c.raqam) || 0)}
                          </div>
                        </div>
                        <div>
                          <div className="gl-wapas-label">Byaaj dar</div>
                          <div className="gl-wapas-value">
                            {c.byaajDar ? `${c.byaajDar}% / maah` : "—"}
                          </div>
                        </div>
                        <div>
                          <div className="gl-wapas-label">Tarikh</div>
                          <div className="gl-wapas-value">
                            {c.tarikh
                              ? new Date(c.tarikh).toLocaleDateString("hi-IN")
                              : "—"}
                          </div>
                        </div>
                        <div>
                          <div className="gl-wapas-label">Mobile</div>
                          <div className="gl-wapas-value">
                            {c.mobile || "—"}
                          </div>
                        </div>
                      </div>

                      {c.saamaan && (
                        <div className="gl-wapas-saamaan">
                          📦 <strong>Saamaan:</strong> {c.saamaan}
                        </div>
                      )}
                      {c.notes && (
                        <div className="gl-wapas-notes">📝 {c.notes}</div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {showForm && (
          <CustomerForm
            editId={editId}
            customers={customers}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditId(null);
            }}
          />
        )}

        {filtered.length === 0 ? (
          <div className="gl-empty">
            <div className="gl-empty-icon">🕥</div>
            <div>Koi customer nahi mila</div>
            <div style={{ fontSize: 12, marginTop: 6 }}>
              Upar "Create New Entry" button dabao
            </div>
          </div>
        ) : (
          <div className="gl-cards-grid" aria-label="Customers grid">
            {filtered.map((c) => {
              const b = calcByaaj(c.raqam, c.byaajDar, c.tarikh);
              const totalReceived = (c.paymentHistory || []).reduce(
                (sum, x) => sum + (parseFloat(x.amount) || 0),
                0,
              );
              const dueAmount = b ? Math.max(0, b.total - totalReceived) : 0;

              return (
                <CustomerCard
                  key={c.id}
                  c={c}
                  dueAmount={dueAmount}
                  onEdit={(id) => {
                    setEditId(id);
                    setShowForm(true);
                  }}
                  onDelete={handleDelete}
                  onToggleWapas={handleToggleWapas}
                  onReceivePayment={handleReceivePayment}
                  onWhatsApp={handleWhatsApp}
                  onBill={handleBill}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky bottom nav (matches FrontPage) */}
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

      {toast && <div className="gl-toast">{toast}</div>}
    </div>
  );
}
