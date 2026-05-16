import SavedBillsPage from "./SavedBillsPage.jsx";

export default function BillsPage({
  onNavHome,
  onNavGirvi,
  onNavBills,
  onNavReports,
  onNavProfile,
}) {
  return (
    <SavedBillsPage
      onBack={onNavHome}
      onNavHome={onNavHome}
      onNavGirvi={onNavGirvi}
      onNavBills={onNavBills}
      onNavReports={onNavReports}
      onNavProfile={onNavProfile}
    />
  );
}
