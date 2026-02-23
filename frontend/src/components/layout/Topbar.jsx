import { useAuth } from "../../context/AuthContext";

const PAGE_TITLES = {
  dashboard:    "Dashboard",
  cars:         "Fleet Management",
  bookings:     "Bookings",
  browse:       "Browse Cars",
  "my-bookings":"My Bookings",
};

export default function Topbar({ page }) {
  const { user } = useAuth();

  return (
    <div className="topbar">
      <span className="page-title">{PAGE_TITLES[page] ?? ""}</span>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span className="text-muted" style={{ fontSize: 13 }}>
          Hello, {user.name.split(" ")[0]} 👋
        </span>
        <div className="user-avatar" style={{ width: 34, height: 34 }}>
          {user.name[0]}
        </div>
      </div>
    </div>
  );
}
