import "./frontPage.css";

export default function FrontShim({
  pageTitle,
  active,
  onNavHome,
  onNavGirvi,
  onNavBills,
  onNavReports,
  onNavProfile,
  children,
}) {
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
        </div>

        <div className="fp-hero">
          <div className="fp-hero-title" style={{ fontSize: 34 }}>
            {pageTitle}
          </div>
          <div className="fp-hero-sub" />
        </div>

        {children}
      </div>

      <div className="fp-bottom-nav" aria-hidden="true">
        <button
          type="button"
          className={
            active === "home"
              ? "fp-nav-item fp-nav-item--active"
              : "fp-nav-item"
          }
          onClick={onNavHome}
        >
          Home
        </button>

        <button
          type="button"
          className={
            active === "ledger"
              ? "fp-nav-item fp-nav-item--active"
              : "fp-nav-item"
          }
          onClick={onNavGirvi}
        >
          Girvi
        </button>

        <button
          type="button"
          className={
            active === "bills"
              ? "fp-nav-item fp-nav-item--active"
              : "fp-nav-item"
          }
          onClick={onNavBills}
        >
          Bills
        </button>

        <button
          type="button"
          className={
            active === "reports"
              ? "fp-nav-item fp-nav-item--active"
              : "fp-nav-item"
          }
          onClick={onNavReports}
        >
          Reports
        </button>

        <button
          type="button"
          className={
            active === "profile"
              ? "fp-nav-item fp-nav-item--active"
              : "fp-nav-item"
          }
          onClick={onNavProfile}
        >
          Profile
        </button>
      </div>
    </div>
  );
}
