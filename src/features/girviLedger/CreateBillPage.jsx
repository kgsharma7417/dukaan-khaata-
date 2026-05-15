import { useMemo, useRef, useState } from "react";
import { rupees } from "../../lib/girviUtils";
import { COLORS } from "./constants/colors.js";

function toNumberOrZero(v) {
  const n = parseFloat(String(v ?? "").trim());
  return Number.isFinite(n) ? n : 0;
}

function buildBillHtml({ customer, bill }) {
  const safeName = customer?.name || "—";
  const safeVillage = customer?.village || "—";
  const safeMobile = customer?.mobile || "—";
  const safeDateStr = customer?.dateStr || "—";

  const rows = (bill?.items || [])
    .filter((p) => String(p.itemDescription || "").trim().length > 0)
    .map((p, idx) => {
      const desc = String(p.itemDescription || "").trim() || "Item";
      const weight = toNumberOrZero(p.weight);
      const ratePerG = toNumberOrZero(p.ratePerG);

      // Purity ko hata diya: always treat as 100%
      const purity = 100;
      const netRate = ratePerG * (purity / 100);
      const amount = weight * netRate + toNumberOrZero(p.makingChargeTotal);

      return `
        <tr>
          <td>${idx + 1}</td>
          <td>${desc}</td>
          <td class="right">${weight}</td>
          <td class="right">₹ ${ratePerG.toFixed(2)}</td>
          <td class="right">₹ ${amount.toFixed(2)}</td>
        </tr>
      `;
    })
    .join("");

  const subtotal = toNumberOrZero(bill?.subtotal);
  const totalMaking = toNumberOrZero(bill?.totalMaking);
  const grandTotal = toNumberOrZero(bill?.grandTotal);

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>Bill - ${safeName}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 18px; color: #111; }
      .wrap { max-width: 900px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; }
      .top { padding: 14px 18px; border-bottom: 1px solid #e5e7eb; text-align: center; }
      .brand { font-size: 20px; font-weight: 1000; letter-spacing: 0.2px; }
      .sub { margin-top: 4px; font-size: 12px; color: #6b7280; font-weight: 700; }
      .title { margin-top: 8px; font-weight: 900; font-size: 16px; }
      .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; }
      .box { border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; text-align:left; }
      .k { font-size: 11px; color: #6b7280; font-weight: 800; margin-bottom: 4px; text-transform: uppercase; }
      .v { font-size: 13px; font-weight: 900; }
      table { width: 100%; border-collapse: collapse; margin-top: 12px; }
      th, td { border: 1px solid #e5e7eb; padding: 10px 8px; font-size: 12px; text-align: left; }
      th { background: #f9fafb; font-weight: 900; }
      .right { text-align: right; }
      .totals { padding: 14px 18px 18px 18px; border-top: 1px solid #e5e7eb; }
      .row { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-top: 8px; }
      .grand { margin-top: 12px; padding-top: 10px; border-top: 2px dashed #e5e7eb; display: flex; justify-content: space-between; align-items: baseline; }
      .grand .label { font-weight: 900; }
      .grand .amount { font-weight: 950; font-size: 16px; }
      .foot { padding: 0 18px 18px 18px; display: grid; grid-template-columns: 1fr 1fr; gap: 18px; align-items: end; }
      .sign { border-top: 1px solid #d1d5db; padding-top: 10px; font-size: 12px; color: #6b7280; font-weight: 800; text-align: center; }
      @media print { body { padding: 0; } .wrap { border: none; border-radius: 0; } }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="top">
        <div class="brand">Krishna Gopal Jewellers</div>
        <div class="sub">Jewellery / Bill (Generated)</div>
        <div class="title">TAX INVOICE / CASH BILL</div>

        <div class="grid2">
          <div class="box"><div class="k">Customer</div><div class="v">${safeName}</div></div>
          <div class="box"><div class="k">Date</div><div class="v">${safeDateStr}</div></div>
          <div class="box"><div class="k">Address (Village)</div><div class="v">${safeVillage}</div></div>
          <div class="box"><div class="k">Mobile</div><div class="v">${safeMobile}</div></div>
        </div>
      </div>

      <div style="padding: 0 18px;">
        <table>
          <thead>
            <tr>
              <th style="width: 60px;">S.No.</th>
              <th>Product</th>
              <th class="right" style="width: 120px;">Weight</th>
              <th class="right" style="width: 140px;">Rate (₹/g)</th>
              <th class="right" style="width: 180px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>

      <div class="totals">
        <div class="row"><span style="font-weight:900;">Sub Total</span><span style="font-weight:900;">₹ ${subtotal.toFixed(2)}</span></div>
        <div class="row"><span style="font-weight:900;">Making / Banani</span><span style="font-weight:900;">₹ ${totalMaking.toFixed(2)}</span></div>
        <div class="grand">
          <div class="label">Grand Total</div>
          <div class="amount">₹ ${grandTotal.toFixed(2)}</div>
        </div>
      </div>

      <div class="foot">
        <div class="sign">Customer Signature</div>
        <div class="sign">Authorized Signatory</div>
      </div>
    </div>
  </body>
</html>`;
}

function FieldCard({ label, children }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.72)",
        border: `1px solid rgba(17,24,39,0.08)`,
        borderRadius: 18,
        padding: 12,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: COLORS.muted,
          fontWeight: 950,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

export default function CreateBillPage({
  onBack,
  onGoFront,

  onNavHome,
  onNavGirvi,
  onNavBills,
  onNavReports,
  onNavProfile,
}) {
  const [customer, setCustomer] = useState({
    name: "",
    mobile: "",
    village: "",
    dateStr: "",
  });

  const [items, setItems] = useState([
    {
      itemDescription: "",
      productType: "Gold",
      weight: "",
      ratePerG: "",
      purityMode: "carat", // carat | custom
      caratK: 24,
      purityPercent: 99.9,
      purityLabel: "99.9% (24K)",
      customPurity: "",
      makingMode: "rate", // rate | fixed
      bananiRate: "150", // ₹/g
      fixedMaking: "0",
      makingChargeTotal: 0,
    },
  ]);

  const computed = useMemo(() => {
    const normalized = (items || []).map((it) => {
      const weight = toNumberOrZero(it.weight);
      const ratePerG = toNumberOrZero(it.ratePerG);
      // Purity ko hata diya: always 100%
      const purityPercent = 100;
      const purityLabel = "100%";
      const netRate = ratePerG * (purityPercent / 100);
      const itemBase = weight * netRate;

      const makingChargeTotal =
        it.makingMode === "fixed"
          ? toNumberOrZero(it.fixedMaking)
          : weight * toNumberOrZero(it.bananiRate);

      const amount = itemBase + makingChargeTotal;

      return {
        ...it,
        weight,
        ratePerG,
        purityPercent,
        purityLabel,
        makingChargeTotal,
        itemBase,
        amount,
      };
    });

    const subtotal = normalized.reduce((s, x) => s + (x.itemBase || 0), 0);
    const totalMaking = normalized.reduce(
      (s, x) => s + (x.makingChargeTotal || 0),
      0,
    );
    const grandTotal = subtotal + totalMaking;

    const validItems = normalized.filter(
      (p) =>
        String(p.itemDescription || "").trim().length > 0 &&
        p.weight > 0 &&
        p.ratePerG > 0 &&
        p.purityPercent > 0,
    ).length;

    return {
      normalized,
      subtotal,
      totalMaking,
      grandTotal,
      validItems,
    };
  }, [items]);

  const canGenerate =
    String(customer.name || "").trim().length > 0 &&
    String(customer.mobile || "").trim().length > 0 &&
    String(customer.village || "").trim().length > 0 &&
    String(customer.dateStr || "").trim().length > 0 &&
    computed.validItems > 0;

  const [previewHtml, setPreviewHtml] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const iframeRef = useRef(null);

  // ===== Saved Bills (per device) =====
  const BILL_STORAGE_KEY = "dukkan_khaata_saved_bills_v1";

  const loadSavedBills = () => {
    try {
      const raw = window.localStorage?.getItem(BILL_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch {
      return [];
    }
  };

  const saveSavedBills = (next) => {
    try {
      window.localStorage?.setItem(BILL_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const [savedBills, setSavedBills] = useState(() => loadSavedBills());

  const [billsTabOpen, setBillsTabOpen] = useState(false);
  const billsPanelRef = useRef(null);

  const handleSaveCurrentBill = () => {
    if (!previewHtml) return;

    const billDoc = {
      id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      createdAt: Date.now(),
      customer: { ...customer },
      // store data needed to regenerate preview
      itemsSnapshot: computed.normalized.map((x) => ({
        itemDescription: x.itemDescription,
        productType: x.productType,
        weight: x.weight,
        ratePerG: x.ratePerG,
        purityPercent: x.purityPercent,
        purityLabel: x.purityLabel,
        makingChargeTotal: x.makingChargeTotal,
      })),
      totals: {
        subtotal: computed.subtotal,
        totalMaking: computed.totalMaking,
        grandTotal: computed.grandTotal,
      },
      previewHtml,
    };

    const next = [billDoc, ...savedBills];
    setSavedBills(next);
    saveSavedBills(next);
  };

  const handleDeleteSavedBill = (billId) => {
    const next = savedBills.filter((b) => b.id !== billId);
    setSavedBills(next);
    saveSavedBills(next);
  };

  const handleViewSavedBill = (billDoc) => {
    setCustomer({ ...(billDoc.customer || {}) });
    // restore UI items snapshot
    setItems((prev) => {
      const restoredItems = (billDoc.itemsSnapshot || []).map((x) => ({
        itemDescription: x.itemDescription,
        productType: x.productType,
        weight: x.weight,
        ratePerG: x.ratePerG,
        purityMode: "carat",
        caratK: 24,
        purityPercent: x.purityPercent ?? 100,
        purityLabel: x.purityLabel ?? "100%",
        customPurity: "",
        makingMode: "rate",
        bananiRate: 0,
        fixedMaking: 0,
        makingChargeTotal: x.makingChargeTotal ?? 0,
      }));
      return restoredItems.length ? restoredItems : prev;
    });

    setPreviewHtml(billDoc.previewHtml || "");
    setShowPreview(true);
    setBillsTabOpen(false);
  };

  const handleAddProduct = () => {
    setItems((prev) => [
      ...prev,
      {
        itemDescription: "",
        productType: "Gold",
        weight: "",
        ratePerG: "",
        purityMode: "carat",
        caratK: 24,
        purityPercent: 99.9,
        purityLabel: "99.9% (24K)",
        customPurity: "",
        makingMode: "rate",
        bananiRate: "150",
        fixedMaking: "0",
        makingChargeTotal: 0,
      },
    ]);
  };

  const handleRemoveProduct = (idx) => {
    setItems((prev) => {
      if (prev.length <= 1) return prev;
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy;
    });
  };

  const handleItemPatch = (idx, patch) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...patch };
      return copy;
    });
  };

  const handleGenerate = () => {
    if (!canGenerate) return;

    const bill = {
      items: computed.normalized.map((x) => ({
        itemDescription: x.itemDescription,
        productType: x.productType,
        weight: x.weight,
        ratePerG: x.ratePerG,
        purityPercent: x.purityPercent,
        purityLabel: x.purityLabel,
        makingChargeTotal: x.makingChargeTotal,
      })),
      subtotal: computed.subtotal,
      totalMaking: computed.totalMaking,
      grandTotal: computed.grandTotal,
    };

    const html = buildBillHtml({
      customer: { ...customer },
      bill,
    });

    setPreviewHtml(html);
    setShowPreview(true);
  };

  const handlePrint = () => {
    const iframe = iframeRef.current;
    const win = iframe?.contentWindow;
    if (!win) return;
    win.focus();
    win.print();
  };

  const inputStyle = {
    width: "100%",
    height: 44,
    borderRadius: 14,
    border: "1px solid rgba(17,24,39,0.10)",
    background: "rgba(255,255,255,0.95)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
    padding: "0 14px",
    outline: "none",
    fontWeight: 900,
    color: "#111",
  };

  const selectStyle = {
    ...inputStyle,
    height: 44,
  };

  const textStyle = {
    width: "100%",
    minHeight: 44,
    borderRadius: 14,
    border: "1px solid rgba(17,24,39,0.10)",
    background: "rgba(255,255,255,0.95)",
    padding: "10px 14px",
    outline: "none",
    fontWeight: 900,
    color: "#111",
  };

  return (
    <div
      style={{
        background: COLORS.bg,
        minHeight: "100vh",
        padding: 16,
        paddingBottom: 120,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={onBack}
          className="gl-btn gl-btn--ghost"
          style={{ height: 34 }}
        >
          ← Back
        </button>

        <div style={{ color: COLORS.primary, fontWeight: 1000, fontSize: 18 }}>
          + Bill Banáo
        </div>

        <button
          onClick={() => onGoFront?.()}
          className="gl-btn gl-btn--ghost"
          style={{ height: 34, borderStyle: "dashed" }}
          title="Go to Front Page"
        >
          🏠 Front Page
        </button>

        <div style={{ color: COLORS.muted, fontSize: 12 }}>
          Customer + Products + Banani + Summary
        </div>

        <button
          type="button"
          className="gl-btn gl-btn--ghost"
          style={{ height: 34, borderStyle: "dashed" }}
          onClick={() => {
            setBillsTabOpen((v) => {
              const next = !v;
              if (next) {
                setTimeout(() => {
                  billsPanelRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }, 0);
              }
              return next;
            });
          }}
          title="Saved bills"
        >
          🧾 Bills
        </button>
      </div>

      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        {/* Customer section */}
        <div style={{ marginBottom: 14 }}>
          <div
            style={{ fontWeight: 1000, color: COLORS.primary, marginBottom: 8 }}
          >
            🧾 Customer ki Jankari
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 12,
              }}
            >
              <FieldCard label="Naam">
                <input
                  style={inputStyle}
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer((c) => ({ ...c, name: e.target.value }))
                  }
                  placeholder="Customer naam..."
                />
              </FieldCard>

              <FieldCard label="Mobile">
                <input
                  style={inputStyle}
                  value={customer.mobile}
                  onChange={(e) =>
                    setCustomer((c) => ({ ...c, mobile: e.target.value }))
                  }
                  placeholder="98765 43210"
                  inputMode="tel"
                />
              </FieldCard>

              <FieldCard label="Village">
                <input
                  style={inputStyle}
                  value={customer.village}
                  onChange={(e) =>
                    setCustomer((c) => ({ ...c, village: e.target.value }))
                  }
                  placeholder="Gaon ka naam..."
                />
              </FieldCard>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <FieldCard label="Tarikh">
                <input
                  style={inputStyle}
                  value={customer.dateStr}
                  onChange={(e) =>
                    setCustomer((c) => ({ ...c, dateStr: e.target.value }))
                  }
                  placeholder="15/05/2026"
                />
              </FieldCard>

              <FieldCard label="Fast total">
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 950,
                      fontSize: 13,
                      color: COLORS.muted,
                    }}
                  >
                    Kul Raqam
                  </div>
                  <div style={{ fontWeight: 1000, fontSize: 18 }}>
                    {rupees(computed.grandTotal)}
                  </div>
                </div>
              </FieldCard>
            </div>
          </div>
        </div>

        {/* Products section */}
        <div style={{ marginBottom: 14 }}>
          <div
            style={{ fontWeight: 1000, color: COLORS.primary, marginBottom: 8 }}
          >
            🧰 Products
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {items.map((p, idx) => {
              const weight = toNumberOrZero(p.weight);
              const ratePerG = toNumberOrZero(p.ratePerG);
              const purityPercent =
                p.purityMode === "custom"
                  ? toNumberOrZero(p.customPurity)
                  : toNumberOrZero(p.purityPercent);
              const makingTotal =
                p.makingMode === "fixed"
                  ? toNumberOrZero(p.fixedMaking)
                  : weight * toNumberOrZero(p.bananiRate);

              return (
                <div
                  key={idx}
                  style={{
                    borderRadius: 22,
                    border: "2px solid rgba(217,119,6,0.35)",
                    background: "rgba(255,255,255,0.72)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
                    padding: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <div style={{ fontWeight: 1000, color: COLORS.primary }}>
                      📦 Product {idx + 1}
                    </div>
                    <button
                      onClick={() => handleRemoveProduct(idx)}
                      className="gl-btn gl-btn--ghost"
                      style={{ height: 36, borderStyle: "dashed" }}
                      disabled={items.length <= 1}
                      title="Remove product"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Product name + type */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                      marginTop: 10,
                    }}
                  >
                    <FieldCard label="Product Name">
                      <input
                        style={textStyle}
                        value={p.itemDescription}
                        onChange={(e) =>
                          handleItemPatch(idx, {
                            itemDescription: e.target.value,
                          })
                        }
                        placeholder="e.g. gold ring, necklace..."
                      />
                    </FieldCard>

                    <FieldCard label="Type">
                      <select
                        style={selectStyle}
                        value={p.productType || "Gold"}
                        onChange={(e) =>
                          handleItemPatch(idx, { productType: e.target.value })
                        }
                      >
                        <option value="Gold">Gold</option>
                        <option value="Silver">Silver</option>
                        <option value="Other">Other</option>
                      </select>
                    </FieldCard>
                  </div>

                  {/* Purity UI removed */}

                  {/* Weight + rate */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                      marginTop: 12,
                    }}
                  >
                    <FieldCard label="Wajan (gram)">
                      <input
                        style={inputStyle}
                        value={p.weight}
                        onChange={(e) =>
                          handleItemPatch(idx, { weight: e.target.value })
                        }
                        placeholder="e.g. 4.5"
                        inputMode="decimal"
                      />
                    </FieldCard>

                    <FieldCard label="Rate (₹/g)">
                      <input
                        style={inputStyle}
                        value={p.ratePerG}
                        onChange={(e) =>
                          handleItemPatch(idx, { ratePerG: e.target.value })
                        }
                        placeholder="e.g. 5800"
                        inputMode="decimal"
                      />
                    </FieldCard>
                  </div>

                  {/* Making charge */}
                  <div style={{ marginTop: 14 }}>
                    <div
                      style={{
                        fontWeight: 1000,
                        color: COLORS.muted,
                        fontSize: 12,
                        marginBottom: 8,
                      }}
                    >
                      Banani / Making Charge
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button
                        type="button"
                        className="gl-btn gl-btn--ghost"
                        style={{
                          height: 36,
                          borderStyle: "dashed",
                          borderColor:
                            p.makingMode === "rate"
                              ? "rgba(16,185,129,0.65)"
                              : "rgba(17,24,39,0.18)",
                          background:
                            p.makingMode === "rate"
                              ? "rgba(16,185,129,0.12)"
                              : "rgba(255,255,255,0.04)",
                        }}
                        onClick={() =>
                          handleItemPatch(idx, { makingMode: "rate" })
                        }
                      >
                        ₹/g
                      </button>

                      <button
                        type="button"
                        className="gl-btn gl-btn--ghost"
                        style={{
                          height: 36,
                          borderStyle: "dashed",
                          borderColor:
                            p.makingMode === "fixed"
                              ? "rgba(16,185,129,0.65)"
                              : "rgba(17,24,39,0.18)",
                          background:
                            p.makingMode === "fixed"
                              ? "rgba(16,185,129,0.12)"
                              : "rgba(255,255,255,0.04)",
                        }}
                        onClick={() =>
                          handleItemPatch(idx, { makingMode: "fixed" })
                        }
                      >
                        Fixed ₹
                      </button>
                    </div>

                    {p.makingMode === "rate" ? (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 12,
                          marginTop: 10,
                        }}
                      >
                        <FieldCard label="Banani Rate (₹/g)">
                          <input
                            style={inputStyle}
                            value={p.bananiRate}
                            onChange={(e) =>
                              handleItemPatch(idx, {
                                bananiRate: e.target.value,
                              })
                            }
                            placeholder="e.g. 150"
                            inputMode="decimal"
                          />
                        </FieldCard>

                        <FieldCard label="Total Banani">
                          <div style={{ fontSize: 20, fontWeight: 1000 }}>
                            {rupees(makingTotal)}
                          </div>
                        </FieldCard>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr",
                          gap: 12,
                          marginTop: 10,
                        }}
                      >
                        <FieldCard label="Fixed Making ₹">
                          <input
                            style={inputStyle}
                            value={p.fixedMaking}
                            onChange={(e) =>
                              handleItemPatch(idx, {
                                fixedMaking: e.target.value,
                              })
                            }
                            placeholder="e.g. 50"
                            inputMode="decimal"
                          />
                        </FieldCard>
                      </div>
                    )}
                  </div>

                  {/* Product total */}
                  <div style={{ marginTop: 14 }}>
                    <div
                      style={{
                        borderRadius: 18,
                        border: "2px solid rgba(17,24,39,0.12)",
                        padding: 12,
                        background: "rgba(255,255,255,0.55)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          alignItems: "baseline",
                        }}
                      >
                        <div style={{ fontWeight: 1000, color: COLORS.muted }}>
                          Bill Summary
                        </div>
                        <div style={{ fontWeight: 1000, fontSize: 16 }}>
                          {rupees(
                            weight * (ratePerG * (purityPercent / 100)) +
                              makingTotal,
                          )}
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: 8,
                          display: "grid",
                          gap: 6,
                          fontSize: 13,
                          color: COLORS.muted,
                          fontWeight: 850,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>
                            Sonia ({weight}g × ₹{ratePerG.toFixed(0) || "0"})
                          </span>
                          <span style={{ color: COLORS.primary }}>
                            ₹{" "}
                            {(
                              weight *
                              ratePerG *
                              (purityPercent / 100)
                            ).toFixed(0)}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>Banani</span>
                          <span style={{ color: COLORS.primary }}>
                            ₹ {makingTotal.toFixed(0)}
                          </span>
                        </div>
                        <div
                          style={{
                            borderTop: "1px dashed rgba(17,24,39,0.15)",
                            marginTop: 6,
                            paddingTop: 8,
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span
                            style={{ color: COLORS.primary, fontWeight: 1000 }}
                          >
                            Kul Raqam
                          </span>
                          <span
                            style={{ color: COLORS.primary, fontWeight: 1000 }}
                          >
                            ₹{" "}
                            {(
                              weight * ratePerG * (purityPercent / 100) +
                              makingTotal
                            ).toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 12,
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: COLORS.muted,
                        fontWeight: 850,
                      }}
                    >
                      {p.makingMode === "fixed" ? "Fixed banani" : "Banani ₹/g"}
                    </div>
                  </div>
                </div>
              );
            })}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 4,
              }}
            >
              <button
                onClick={handleAddProduct}
                className="gl-btn gl-btn--accent"
                style={{ height: 42 }}
              >
                + Product Jodo
              </button>
            </div>
          </div>
        </div>

        {/* Bill total + actions */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
            <FieldCard label="Kul Raqam (Sub Total + Banani)">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    fontWeight: 1000,
                    color: COLORS.muted,
                    fontSize: 13,
                  }}
                >
                  Grand Total
                </div>
                <div
                  style={{
                    fontWeight: 1000,
                    fontSize: 22,
                    color: COLORS.primary,
                  }}
                >
                  {rupees(computed.grandTotal)}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  marginTop: 10,
                  fontWeight: 900,
                  color: COLORS.muted,
                  fontSize: 12,
                }}
              >
                <div>Sub Total</div>
                <div>₹ {computed.subtotal.toFixed(2)}</div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  fontWeight: 900,
                  color: COLORS.muted,
                  fontSize: 12,
                }}
              >
                <div>Banani</div>
                <div>₹ {computed.totalMaking.toFixed(2)}</div>
              </div>
            </FieldCard>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => {
                  setCustomer({
                    name: "",
                    mobile: "",
                    village: "",
                    dateStr: "",
                  });
                  setItems([
                    {
                      itemDescription: "",
                      productType: "Gold",
                      weight: "",
                      ratePerG: "",
                      purityMode: "carat",
                      caratK: 24,
                      purityPercent: 99.9,
                      purityLabel: "99.9% (24K)",
                      customPurity: "",
                      makingMode: "rate",
                      bananiRate: "150",
                      fixedMaking: "0",
                      makingChargeTotal: 0,
                    },
                  ]);
                  setPreviewHtml("");
                  setShowPreview(false);
                }}
                className="gl-btn gl-btn--ghost"
                style={{ height: 42, borderStyle: "dashed" }}
              >
                Clear
              </button>

              <button
                onClick={handleGenerate}
                className="gl-btn gl-btn--accent"
                style={{
                  height: 42,
                  opacity: canGenerate ? 1 : 0.65,
                  cursor: canGenerate ? "pointer" : "not-allowed",
                }}
                disabled={!canGenerate}
              >
                Bill Generate
              </button>
            </div>
          </div>
        </div>

        {/* Saved bills list */}
        {billsTabOpen && (
          <div
            ref={billsPanelRef}
            style={{
              marginTop: 14,
              marginBottom: 14,
              padding: 12,
              background: "#ffffff",
              border: "2px solid rgba(17,24,39,0.20)",
              borderRadius: 16,
              color: "#111",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div style={{ fontWeight: 1000, color: "#111" }}>Saved Bills</div>

              <button
                type="button"
                className="gl-btn gl-btn--ghost"
                style={{
                  height: 36,
                  borderStyle: "dashed",
                  borderColor: "rgba(17,24,39,0.45)",
                  color: "#111",
                  background: "rgba(255,255,255,0.95)",
                }}
                onClick={() => {
                  if (!previewHtml) {
                    alert("Pehle Bill Generate/Preview karo.");
                    return;
                  }
                  handleSaveCurrentBill();
                  setBillsTabOpen(true);
                }}
                title="Save current preview"
              >
                + Save current
              </button>
            </div>

            {savedBills.length === 0 ? (
              <div style={{ color: "#111", fontWeight: 900, fontSize: 13 }}>
                Abhi koi saved bill nahi hai.
              </div>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {savedBills.map((b) => (
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
                    <div style={{ minWidth: 220 }}>
                      <div style={{ fontWeight: 1000, color: COLORS.primary }}>
                        {b.customer?.name || "Customer"}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: COLORS.muted,
                          fontWeight: 850,
                        }}
                      >
                        ₹ {Number(b.totals?.grandTotal || 0).toFixed(2)}
                      </div>
                    </div>

                    <div
                      style={{ display: "flex", gap: 10, alignItems: "center" }}
                    >
                      <button
                        type="button"
                        className="gl-btn gl-btn--ghost"
                        style={{ height: 36, borderStyle: "dashed" }}
                        onClick={() => handleViewSavedBill(b)}
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
                        onClick={() => handleDeleteSavedBill(b.id)}
                        title="Delete bill"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Preview */}
        {showPreview && (
          <div
            style={{
              marginTop: 18,
              padding: 12,
              background: "rgba(255,255,255,0.04)",
              border: `1px solid rgba(255,255,255,0.18)`,
              borderRadius: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <div style={{ fontWeight: 950, color: COLORS.primary }}>
                🧾 Bill Preview
              </div>
              <button
                onClick={handlePrint}
                className="gl-btn gl-btn--accent"
                style={{ height: 36 }}
              >
                Print
              </button>
            </div>

            <iframe
              ref={iframeRef}
              title="Bill Preview"
              style={{
                width: "100%",
                height: 520,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                background: "white",
              }}
              srcDoc={previewHtml}
            />
          </div>
        )}
      </div>

      {/* Shared sticky bottom nav */}
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
