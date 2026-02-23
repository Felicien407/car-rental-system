import { useState, useEffect } from "react";
import * as api from "../../api/mockApi";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.getBookings(null, "admin").then((b) => {
      setBookings(b);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="loading"><div className="spinner" /></div>;
  }

  return (
    <div className="page-body">
      <div className="section-header">
        <div>
          <h2 className="section-title">All Bookings</h2>
          <p className="text-muted">{bookings.length} total bookings</p>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Car</th>
                <th>Start</th>
                <th>End</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td className="td-bold text-accent">#{b._id}</td>
                  <td>{b.customerName}</td>
                  <td>{b.carId}</td>
                  <td>{b.startDate}</td>
                  <td>{b.endDate}</td>
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

          {bookings.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No bookings yet</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
