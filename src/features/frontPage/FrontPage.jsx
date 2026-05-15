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
        <div className="fp-topbar">
          <div className="fp-pill">
            <span className="fp-pill-icon" aria-hidden="true">
              🏦
            </span>
            <span className="fp-pill-text">Dukaan Khaata</span>
          </div>

          <div className="fp-topbar-right" aria-hidden="true">
            <div className="fp-dot" />
            <div className="fp-dot fp-dot--solid" />
          </div>

          <button
            type="button"
            className="fp-logout-btn"
            onClick={onLogout}
            title="Logout"
          >
            Logout
          </button>
        </div>

        <div className="fp-greeting">
          <div className="fp-greet-emoji" aria-hidden="true">
            🙏
          </div>
          <div className="fp-greet-text">
            Namaste, {profileName || "Shopkeeper"}!
          </div>
        </div>

        <div className="fp-hero">
          <div className="fp-hero-title">Dukaan Khaata</div>
          <div className="fp-hero-sub">
            Aapka Girvi · Bill · Hisab — ek jagah
          </div>
        </div>

        <div className="fp-tags" aria-hidden="true">
          <div className="fp-tag">
            <span>📘</span> Girvi
          </div>
          <div className="fp-tag">
            <span>🧾</span> Bill
          </div>
          <div className="fp-tag">
            <span>🗂️</span> Hisaab
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
            Reports
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
