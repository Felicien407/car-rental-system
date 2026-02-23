import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../api/mockApi";
import Modal from "../../components/ui/Modal";
import Stars from "../../components/ui/Stars";
import StatusBadge from "../../components/ui/StatusBadge";

// ── Booking Modal ──────────────────────────────────────────────────────────────
function BookingModal({ car, onBook, onClose }) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm]       = useState({ startDate: today, endDate: "" });
  const [loading, setLoading] = useState(false);

  const days =
    form.startDate && form.endDate
      ? Math.max(0, Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / 86400000))
      : 0;

  const submit = async () => {
    if (!form.endDate || days <= 0) return alert("Please select valid dates");
    setLoading(true);
    await onBook({ carId: car._id, startDate: form.startDate, endDate: form.endDate });
    setLoading(false);
  };

  return (
    <Modal
      title="Book This Car"
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={submit}
            disabled={loading || days <= 0}
          >
            {loading ? "Booking…" : `Confirm — $${days * car.pricePerDay}`}
          </button>
        </>
      }
    >
      {/* Car summary */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "center" }}>
        <img
          src={car.image} alt=""
          style={{ width: 100, height: 70, borderRadius: 10, objectFit: "cover" }}
        />
        <div>
          <div className="car-make">{car.make}</div>
          <div className="car-model">{car.model}</div>
          <div className="car-price">
            ${car.pricePerDay}
            <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 400 }}>/day</span>
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* Date pickers */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Pick-Up Date</label>
          <input
            className="form-input" type="date" min={today}
            value={form.startDate}
            onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Return Date</label>
          <input
            className="form-input" type="date" min={form.startDate || today}
            value={form.endDate}
            onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
          />
        </div>
      </div>

      {/* Price summary */}
      {days > 0 && (
        <div style={{ background: "var(--surface2)", borderRadius: 10, padding: 16, marginTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span className="text-muted">{days} day{days > 1 ? "s" : ""} × ${car.pricePerDay}</span>
            <span className="td-bold">${days * car.pricePerDay}</span>
          </div>
          <div className="divider" style={{ margin: "8px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700 }}>Total</span>
            <span className="text-accent" style={{ fontSize: 18, fontWeight: 800 }}>
              ${days * car.pricePerDay}
            </span>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ── Browse Cars Page ───────────────────────────────────────────────────────────
export default function BrowseCars({ toast }) {
  const { user } = useAuth();
  const [cars, setCars]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [bookingCar, setBooking] = useState(null);
  const [filters, setFilters]   = useState({ search: "", category: "All", status: "available" });

  const load = () => {
    setLoading(true);
    api.getCars(filters).then((c) => { setCars(c); setLoading(false); });
  };
  useEffect(() => { load(); }, [filters]);

  const handleBook = async (data) => {
    try {
      await api.createBooking({ ...data, customerId: user._id, customerName: user.name });
      toast.show("Booking confirmed! 🎉");
      setBooking(null);
      load();
    } catch (e) {
      toast.show(e.message, "error");
    }
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Browse Cars</h2>
          <p className="text-muted">Find your perfect ride</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            className="form-input"
            placeholder="Search cars…"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          />
        </div>
        <select
          className="form-input form-select"
          style={{ width: 160 }}
          value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
        >
          {["All", "Electric", "Sports", "SUV", "Sedan"].map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          className="form-input form-select"
          style={{ width: 160 }}
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
        >
          <option value="available">Available Only</option>
          <option value="All">Show All</option>
        </select>
      </div>

      {/* Car Grid */}
      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : (
        <div className="cars-grid">
          {cars.map((car) => (
            <div
              className="car-card"
              key={car._id}
              onClick={() => car.status === "available" && setBooking(car)}
            >
              <div className="car-image">
                <img src={car.image} alt={`${car.make} ${car.model}`} loading="lazy" />
                <StatusBadge status={car.status} />
              </div>
              <div className="car-info">
                <div className="car-make">{car.make} · {car.category}</div>
                <div className="car-model">
                  {car.model}
                  <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 400 }}> {car.year}</span>
                </div>
                <div className="car-meta">
                  <span>💺 {car.seats}</span>
                  <span>⚙ {car.transmission}</span>
                  <span>📍 {car.mileage.toLocaleString()} km</span>
                </div>
                <div className="car-footer">
                  <div>
                    <div className="car-price">${car.pricePerDay}<span>/day</span></div>
                    <Stars rating={car.rating} />
                  </div>
                  {car.status === "available" ? (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={(e) => { e.stopPropagation(); setBooking(car); }}
                    >
                      Book Now
                    </button>
                  ) : (
                    <span className={`badge ${car.status === "rented" ? "badge-yellow" : "badge-red"}`}>
                      {car.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {cars.length === 0 && (
            <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
              <div className="empty-icon">🔍</div>
              <h3>No cars found</h3>
              <p>Try different filters</p>
            </div>
          )}
        </div>
      )}

      {bookingCar && (
        <BookingModal
          car={bookingCar}
          onBook={handleBook}
          onClose={() => setBooking(null)}
        />
      )}
    </div>
  );
}
