import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../api/mockApi";

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [cars, setCars]         = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      api.getBookings(user._id, "customer"),
      api.getCars(),
    ]).then(([b, c]) => {
      setBookings(b);
      setCars(c);
      setLoading(false);
    });
  }, []);

  const getCar = (id) => cars.find((c) => c._id === id);

  if (loading) {
    return <div className="loading"><div className="spinner" /></div>;
  }

  return (
    <div className="page-body">
      <div className="section-header">
        <div>
          <h2 className="section-title">My Bookings</h2>
          <p className="text-muted">{bookings.length} booking{bookings.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No bookings yet</h3>
          <p>Browse our cars and book your first ride!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {bookings.map((b) => {
            const car = getCar(b.carId);
            return (
              <div className="card" key={b._id}>
                <div
                  className="card-body"
                  style={{ display: "flex", gap: 20, alignItems: "center" }}
                >
                  {car && (
                    <img
                      src={car.image} alt=""
                      style={{ width: 120, height: 80, borderRadius: 10, objectFit: "cover", flexShrink: 0 }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div className="text-muted" style={{ fontSize: 11, marginBottom: 2 }}>
                          Booking #{b._id}
                        </div>
                        <div className="car-model">
                          {car ? `${car.make} ${car.model}` : b.carId}
                        </div>
                        <div className="car-meta" style={{ marginTop: 6 }}>
                          <span>📅 {b.startDate} → {b.endDate}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className="car-price">${b.totalPrice}</div>
                        <span className={`badge ${b.status === "active" ? "badge-green" : "badge-blue"}`}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
