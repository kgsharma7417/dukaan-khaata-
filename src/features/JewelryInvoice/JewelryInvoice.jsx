import { useMemo, useRef, useState } from "react";
import { computeInvoiceTotals } from "./InvoiceLogic";
import "./InvoiceStyles.css";

function rupees(n) {
  return "₹" + Math.round(n || 0).toLocaleString("en-IN");
}

export default function JewelryInvoice() {
  const receiptRef = useRef(null);

  const [customerName, setCustomerName] = useState("");
  const [locationText, setLocationText] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().slice(0, 10),
  );

  const [weightInGrams, setWeightInGrams] = useState(0);
  const [todayGoldRate, setTodayGoldRate] = useState(0);

  const [makingChargesFlat, setMakingChargesFlat] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);

  const totals = useMemo(() => {
    return computeInvoiceTotals({
      weightInGrams,
      todayGoldRate,
      makingChargesFlat,
      discountAmount,
      paidAmount,
    });
  }, [
    weightInGrams,
    todayGoldRate,
    makingChargesFlat,
    discountAmount,
    paidAmount,
  ]);

  const statusText = totals.isFullyPaid
    ? "Fully Paid"
    : `Remaining: ${rupees(totals.balanceAmount)}`;

  const handlePrint = () => {
    // For browser print: we rely on @media print + "hide everything else" via CSS
    window.print();
  };

  return (
    <div className="ji-root">
      <div className="ji-shell">
        <div className="ji-header">
          <div>
            <div className="ji-subtitle">
              Customer Billing & Payment Tracker
            </div>
          </div>

          <div className="ji-no-print ji-actions">
            <button
              className="ji-btn ji-btn--primary"
              type="button"
              onClick={handlePrint}
            >
              Print Receipt
            </button>
          </div>
        </div>

        <div className="ji-grid">
          <div className="ji-card">
            <div className="ji-card-title">✍️ Inputs</div>

            <div className="ji-form">
              <div className="ji-field">
                <div className="ji-label">Customer Name</div>
                <input
                  className="ji-input"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rahul"
                />
              </div>

              <div className="ji-field">
                <div className="ji-label">Location / Address</div>
                <input
                  className="ji-input"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  placeholder="City / Address"
                />
              </div>

              <div className="ji-field ji-row">
                <div className="ji-label">Date</div>
                <input
                  className="ji-input"
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              </div>

              <div className="ji-field">
                <div className="ji-label">Weight (grams)</div>
                <input
                  className="ji-input"
                  type="number"
                  value={weightInGrams}
                  onChange={(e) =>
                    setWeightInGrams(parseFloat(e.target.value) || 0)
                  }
                  min={0}
                />
              </div>

              <div className="ji-field">
                <div className="ji-label">Today's Gold Rate</div>
                <input
                  className="ji-input"
                  type="number"
                  value={todayGoldRate}
                  onChange={(e) =>
                    setTodayGoldRate(parseFloat(e.target.value) || 0)
                  }
                  min={0}
                />
              </div>

              <div className="ji-field">
                <div className="ji-label">Making Charges (flat)</div>
                <input
                  className="ji-input"
                  type="number"
                  value={makingChargesFlat}
                  onChange={(e) =>
                    setMakingChargesFlat(parseFloat(e.target.value) || 0)
                  }
                  min={0}
                />
              </div>

              <div className="ji-field">
                <div className="ji-label">Discount</div>
                <input
                  className="ji-input"
                  type="number"
                  value={discountAmount}
                  onChange={(e) =>
                    setDiscountAmount(parseFloat(e.target.value) || 0)
                  }
                  min={0}
                />
              </div>

              <div className="ji-field">
                <div className="ji-label">Amount Paid Now</div>
                <input
                  className="ji-input"
                  type="number"
                  value={paidAmount}
                  onChange={(e) =>
                    setPaidAmount(parseFloat(e.target.value) || 0)
                  }
                  min={0}
                />
              </div>

              <div className="ji-field">
                <div className="ji-label">Quick Preview</div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 900,
                    opacity: 0.75,
                    marginTop: 6,
                  }}
                >
                  Final Total: {rupees(totals.finalTotal)}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 900,
                    opacity: 0.75,
                    marginTop: 4,
                  }}
                >
                  Dues: {rupees(totals.balanceAmount)}
                </div>
              </div>
            </div>
          </div>

          <div className="ji-preview ji-receipt-wrap">
            <div ref={receiptRef} className="ji-receipt">
              <h2>Live Receipt Preview</h2>
              <div className="ji-meta">
                {customerName ? customerName : "Customer"} ·{" "}
                {locationText ? locationText : "—"} · {invoiceDate}
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Particular</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Net Gold Value</td>
                    <td>{rupees(totals.netGoldValue)}</td>
                  </tr>
                  <tr>
                    <td>Making Charges</td>
                    <td>{rupees(totals.makingCharges)}</td>
                  </tr>
                  <tr>
                    <td>Discount</td>
                    <td>- {rupees(totals.discount)}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 950 }}>Final Total</td>
                    <td style={{ fontWeight: 950 }}>
                      {rupees(totals.finalTotal)}
                    </td>
                  </tr>
                  <tr>
                    <td>Amount Paid</td>
                    <td>{rupees(totals.paymentPaid)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="ji-highlight">
                <div className="ji-box">
                  <div className="ji-box-title">Final Total</div>
                  <div className="ji-box-value">
                    {rupees(totals.finalTotal)}
                  </div>
                </div>

                <div className="ji-box">
                  <div className="ji-box-title">Balance (Dues)</div>
                  <div className="ji-box-value">
                    {rupees(totals.balanceAmount)}
                  </div>
                </div>
              </div>

              <div
                className={
                  "ji-status " +
                  (totals.isFullyPaid ? "ji-status--ok" : "ji-status--warn")
                }
              >
                {statusText}
              </div>

              <div
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  fontWeight: 900,
                  opacity: 0.7,
                }}
              >
                Print this preview to save as PDF from your browser dialog.
              </div>
            </div>

            <div className="ji-no-print" style={{ marginTop: 12 }}>
              <button
                className="ji-btn ji-btn--primary"
                type="button"
                onClick={handlePrint}
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
