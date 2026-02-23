import { useState, useEffect } from "react";
import * as api from "../../api/mockApi";

export default function Dashboard({ onNavigate }) {
  const [stats, setStats]             = useState(null);
  const [recentBookings, setBookings] = useState([]);

  useEffect(() => {
    api.getStats().then(setStats);
    api.getBookings(null, "admin").then((b) => setBookings(b.slice(0, 5)));
  }, []);

  if (!stats) {
    return <div className="loading"><div className="spinner" /></div>;
  }

  const statItems = [
    { label: "Total Cars",     value: stats.totalCars,     icon: "🚗", color: "var(--accent)" },
    { label: "Available",      value: stats.available,     icon: "✅", color: "var(--accent)" },
    { label: "Rented Out",     value: stats.rented,        icon: "🔑", color: "var(--warn)"   },
    { label: "Total Bookings", value: stats.totalBookings, icon: "📋", color: "var(--blue)"   },
  ];

  return (
    <div className="page-body">
      {/* Header */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Dashboard</h2>
          <p className="text-muted">Welcome back — overview of your fleet</p>
        </div>
        <button className="btn btn-primary" onClick={() => onNavigate("cars")}>
          + Add Car
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {statItems.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-icon">{s.icon}</div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Bookings</span>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate("bookings")}>
            View All →
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Car ID</th>
                <th>Period</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b._id}>
                  <td className="td-bold text-accent">#{b._id}</td>
                  <td>{b.customerName}</td>
                  <td>{b.carId}</td>
                  <td className="text-muted">{b.startDate} → {b.endDate}</td>
                  <td className="td-bold">${b.totalPrice}</td>
                  <td>
                    <span className={`badge ${b.status === "active" ? "badge-green" : "badge-blue"}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
