import FrontShim from "../features/frontPage/FrontShim.jsx";

export default function ReportsPage({
  onNavHome,
  onNavGirvi,
  onNavBills,
  onNavReports,
  onNavProfile,
}) {
  return (
    <FrontShim
      pageTitle="Reports"
      active="reports"
      onNavHome={onNavHome}
      onNavGirvi={onNavGirvi}
      onNavBills={onNavBills}
      onNavReports={onNavReports}
      onNavProfile={onNavProfile}
    >
      <div className="fp-reports-placeholder">
        <div className="fp-placeholder-title">Reports Dekho</div>
        <div className="fp-placeholder-sub">
          Yahan aap daily/weekly summary, pending dues, aur customer-wise
          reports dikhayenge.
        </div>
      </div>
    </FrontShim>
  );
}
