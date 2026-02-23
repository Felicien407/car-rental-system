import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useToast } from "./hooks/useToast";

import Sidebar        from "./components/layout/Sidebar";
import Topbar         from "./components/layout/Topbar";
import Toast          from "./components/ui/Toast";

import AuthPage       from "./pages/AuthPage";
import Dashboard      from "./pages/admin/Dashboard";
import ManageCars     from "./pages/admin/ManageCars";
import AdminBookings  from "./pages/admin/AdminBookings";
import BrowseCars     from "./pages/customer/BrowseCars";
import MyBookings     from "./pages/customer/MyBookings";

function AppShell() {
  const { user } = useAuth();
  const toast = useToast();

  // Default page per role
  const defaultPage = user.role === "admin" ? "dashboard" : "browse";
  const [page, setPage] = useState(defaultPage);

  const renderPage = () => {
    if (user.role === "admin") {
      if (page === "dashboard") return <Dashboard onNavigate={setPage} />;
      if (page === "cars")      return <ManageCars toast={toast} />;
      if (page === "bookings")  return <AdminBookings />;
    } else {
      if (page === "browse")       return <BrowseCars toast={toast} />;
      if (page === "my-bookings")  return <MyBookings />;
    }
    return null;
  };

  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={setPage} />
      <main className="main-content">
        <Topbar page={page} />
        {renderPage()}
      </main>
      <Toast toast={toast.toast} />
    </div>
  );
}

export default function App() {
  const { user } = useAuth();
  return user ? <AppShell /> : <AuthPage />;
}
