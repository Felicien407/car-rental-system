import { useAuth } from "../../context/AuthContext";

const ADMIN_NAV = [
  { id: "dashboard",  icon: "⊞", label: "Dashboard"    },
  { id: "cars",       icon: "🚗", label: "Manage Cars"  },
  { id: "bookings",   icon: "📋", label: "Bookings"     },
];

const CUSTOMER_NAV = [
  { id: "browse",      icon: "🔍", label: "Browse Cars"  },
  { id: "my-bookings", icon: "📋", label: "My Bookings"  },
];

export default function Sidebar({ page, setPage }) {
  const { user, logout } = useAuth();
  const navItems = user.role === "admin" ? ADMIN_NAV : CUSTOMER_NAV;

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">🚗</div>
          <div>
            <div className="logo-text">RENT-A-CAR</div>
            <div className="logo-sub">Unlock Your Journey</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-section-label">Navigation</div>
        {navItems.map((n) => (
          <div
            key={n.id}
            className={`nav-item ${page === n.id ? "active" : ""}`}
            onClick={() => setPage(n.id)}
          >
            <span className="nav-icon">{n.icon}</span>
            {n.label}
          </div>
        ))}
      </nav>

      {/* User / Logout */}
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">{user.name[0]}</div>
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-role">{user.role}</div>
          </div>
          <button className="logout-btn" title="Logout" onClick={logout}>⏻</button>
        </div>
      </div>
    </aside>
  );
}
