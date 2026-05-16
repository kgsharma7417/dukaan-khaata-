import { useState } from "react";
import "./frontPage.css";

const PROFILE_STORAGE_KEY = "dukkan_khaata_profile_v1";

function safeParseJson(raw) {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export default function FrontPage({
  onGenerateBill,
  onCreateAccount,
  onNavHome,
  onNavGirvi,
  onNavBills,
  onNavReports,
  onNavProfile,
  onLogout,
  onNavBillsPage,
  activeGirviCount = 0,
  totalOutstanding = 0,
}) {
  const [profileName] = useState(() => {
    const raw = window.localStorage?.getItem(PROFILE_STORAGE_KEY);
    const parsed = raw ? safeParseJson(raw) : null;
    return (parsed?.shopkeeperName || parsed?.name || "").trim();
  });

  return (
    <div className="fp-root">
      <div className="container fp-wrap">
        <div className="fp-dashboard-header">
          <div className="fp-dashboard-topbar">
            <div className="fp-pill fp-pill--header">
              <span className="fp-pill-icon" aria-hidden="true">
                द
              </span>
              <span className="fp-pill-text">Dukaan Khaata</span>
            </div>

            <button
              type="button"
              className="fp-logout-btn fp-logout-btn--header"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>

          <div className="fp-action-tabs">
            <button
              type="button"
              className="fp-action-tab"
              onClick={onNavGirvi}
            >
              Girvi
            </button>
            <button
              type="button"
              className="fp-action-tab fp-action-tab--active"
              onClick={onGenerateBill}
            >
              Bill
            </button>
            <button
              type="button"
              className="fp-action-tab"
              onClick={onNavReports}
            >
              Hisaab
            </button>
          </div>

          <div className="fp-dashboard-greeting">
            <div className="fp-dashboard-greeting-text">
              Namaste, {profileName || "Shopkeeper"}!
            </div>
            <div className="fp-dashboard-title">Dukaan Khaata</div>
            <div className="fp-dashboard-subtitle">
              Aapka Girvi · Bill · Hisab — ek jagah
            </div>
          </div>

          <div className="fp-stats">
            <div className="fp-stat">
              <div className="fp-stat-icon" aria-hidden="true">
                📄
              </div>
              <div className="fp-stat-value">{activeGirviCount}</div>
              <div className="fp-stat-label">Active Girvi</div>
            </div>

            <div className="fp-stat fp-stat--accent">
              <div className="fp-stat-icon" aria-hidden="true">
                💎
              </div>
              <div className="fp-stat-value">₹{totalOutstanding}</div>
              <div className="fp-stat-label">Total Invested Amount</div>
            </div>
          </div>
        </div>

        <div className="fp-section-head">
          <div className="fp-section-title">Quick Actions</div>
          <div className="fp-section-link">Sab dekhno →</div>
        </div>

        <div className="fp-quick">
          <button
            type="button"
            className="fp-quick-btn fp-quick-btn--green"
            onClick={onGenerateBill}
          >
            <div className="fp-quick-icon" aria-hidden="true">
              🧠
            </div>
            <div className="fp-quick-body">
              <div className="fp-quick-title">Create Bill</div>
              <div className="fp-quick-sub">Print PDF — instant</div>
            </div>
          </button>

          <button
            type="button"
            className="fp-quick-btn fp-quick-btn--amber"
            onClick={onCreateAccount}
          >
            <div className="fp-quick-icon" aria-hidden="true">
              🙌
            </div>
            <div className="fp-quick-body">
              <div className="fp-quick-title">Girvi Khata</div>
              <div className="fp-quick-sub">New Customer → new entry</div>
            </div>
          </button>

          <button
            type="button"
            className="fp-quick-btn fp-quick-btn--blue"
            onClick={onNavBillsPage}
            title="Open saved bills"
          >
            <div className="fp-quick-icon" aria-hidden="true">
              📊
            </div>
            <div className="fp-quick-body">
              <div className="fp-quick-title">Reports Dekho</div>
              <div className="fp-quick-sub">Aaj ka hisaab, weekly summary</div>
            </div>
          </button>
        </div>

        <div className="fp-tip">
          <span className="fp-tip-bulb" aria-hidden="true">
            💡
          </span>
          Tip: “Digital Bill Banáo” se turant PDF ya print milta hai — customer
          ko WhatsApp pe bhejo!
        </div>

        <div className="fp-bottom-nav" aria-hidden="true">
          <button
            type="button"
            className="fp-nav-item fp-nav-item--active"
            onClick={onNavHome}
          >
            Home
          </button>

          <button type="button" className="fp-nav-item" onClick={onNavGirvi}>
            Girvi
          </button>

          <button type="button" className="fp-nav-item" onClick={onNavBills}>
            Bills
          </button>

          <button type="button" className="fp-nav-item" onClick={onNavReports}>
            Bhaav patr
          </button>

          <button type="button" className="fp-nav-item" onClick={onNavProfile}>
            Profile
          </button>
        </div>
      </div>

      {/* floating action (purely visual for now) */}
      <div className="fp-fab" aria-hidden="true" />
    </div>
  );
}
