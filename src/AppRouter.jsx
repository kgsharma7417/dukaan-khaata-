// Added FrontPage as the post-login landing page.

import { useCallback, useState } from "react";
import GirviLedger from "./features/girviLedger/GirviLedger.jsx";
import WapasPage from "./features/wapas/WapasPage.jsx";
import CreateBillPage from "./features/girviLedger/CreateBillPage.jsx";
import FrontPage from "./features/frontPage/FrontPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import BillsPage from "./pages/BillsPage.jsx";
import { logout } from "./lib/auth";

export default function AppRouter() {
  const [page, setPage] = useState("front"); // front | ledger | wapas | createBill | reports | profile

  const [customers, setCustomers] = useState([]);
  const [openCreateAccount, setOpenCreateAccount] = useState(false);

  const onGoFront = useCallback(() => setPage("front"), []);
  const onGoLedger = useCallback(() => setPage("ledger"), []);
  const onGoBills = useCallback(() => setPage("createBill"), []);
  const onGoBillsList = useCallback(() => setPage("bills"), []);
  const onGoReports = useCallback(() => setPage("reports"), []);
  const onGoProfile = useCallback(() => setPage("profile"), []);
  const onGoWapas = useCallback(() => setPage("wapas"), []);

  const onLogout = useCallback(async () => {
    try {
      await logout();
      // AuthGate realtime listener ke through LoginPage show ho jayega
    } catch (e) {
      console.error("Logout failed:", e);
    }
  }, []);

  const [frontStats, setFrontStats] = useState({
    activeGirviCount: 0,
    totalOutstanding: 0,
  });

  const onCreateAccountOpened = useCallback(
    () => setOpenCreateAccount(false),
    [],
  );

  const onCustomersReady = useCallback((data) => setCustomers(data), []);
  const onWapasCustomersReady = useCallback((data) => setCustomers(data), []);

  const onDashboardStats = useCallback((stats) => {
    setFrontStats({
      activeGirviCount: stats?.activeGirviCount ?? 0,
      totalOutstanding: stats?.totalOutstanding ?? 0,
    });
  }, []);

  if (page === "front") {
    return (
      <FrontPage
        onGenerateBill={onGoBills}
        onNavBillsPage={onGoBillsList}
        onCreateAccount={() => {
          setOpenCreateAccount(true);
          onGoLedger();
        }}
        onNavHome={onGoFront}
        onNavGirvi={onGoLedger}
        onNavBills={onGoBills}
        onNavReports={onGoReports}
        onNavProfile={onGoProfile}
        onLogout={onLogout}
        activeGirviCount={frontStats.activeGirviCount}
        totalOutstanding={frontStats.totalOutstanding}
      />
    );
  }

  if (page === "bills") {
    return (
      <BillsPage
        onNavHome={onGoFront}
        onNavGirvi={onGoLedger}
        onNavBills={onGoBills}
        onNavReports={onGoReports}
        onNavProfile={onGoProfile}
      />
    );
  }

  if (page === "reports") {
    return (
      <ReportsPage
        onNavHome={onGoFront}
        onNavGirvi={onGoLedger}
        onNavBills={onGoBills}
        onNavReports={onGoReports}
        onNavProfile={onGoProfile}
      />
    );
  }

  if (page === "profile") {
    return (
      <ProfilePage
        onNavHome={onGoFront}
        onNavGirvi={onGoLedger}
        onNavBills={onGoBills}
        onNavReports={onGoReports}
        onNavProfile={onGoProfile}
      />
    );
  }

  if (page === "wapas") {
    return (
      <WapasPage
        customers={customers}
        onBack={onGoLedger}
        onGoFront={onGoFront}
        onNavHome={onGoFront}
        onNavGirvi={onGoLedger}
        onNavBills={onGoBills}
        onNavReports={onGoReports}
        onNavProfile={onGoProfile}
      />
    );
  }

  if (page === "createBill") {
    return (
      <CreateBillPage
        customers={customers}
        onBack={onGoLedger}
        onGoFront={onGoFront}
        onNavHome={onGoFront}
        onNavGirvi={onGoLedger}
        onNavBills={onGoBills}
        onNavReports={onGoReports}
        onNavProfile={onGoProfile}
      />
    );
  }

  // ledger (default)
  return (
    <GirviLedger
      openCreateAccount={openCreateAccount}
      onCreateAccountOpened={onCreateAccountOpened}
      onCustomersReady={onCustomersReady}
      onWapasCustomersReady={onWapasCustomersReady}
      onGoWapas={onGoWapas}
      onGoCreateBill={onGoBills}
      onGoFront={onGoFront}
      onDashboardStats={onDashboardStats}
      onNavHome={onGoFront}
      onNavGirvi={onGoLedger}
      onNavBills={onGoBills}
      onNavReports={onGoReports}
      onNavProfile={onGoProfile}
    />
  );
}
