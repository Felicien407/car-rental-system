import { useState, useEffect } from "react";
import * as api from "../../api/mockApi";
import Modal from "../../components/ui/Modal";
import Stars from "../../components/ui/Stars";
import StatusBadge from "../../components/ui/StatusBadge";

// ── Car Form Modal ─────────────────────────────────────────────────────────────
function CarFormModal({ car, onSave, onClose }) {
  const [form, setForm] = useState({
    make:         car?.make         ?? "",
    model:        car?.model        ?? "",
    year:         car?.year         ?? 2023,
    category:     car?.category     ?? "Sedan",
    pricePerDay:  car?.pricePerDay  ?? 100,
    status:       car?.status       ?? "available",
    mileage:      car?.mileage      ?? 0,
    seats:        car?.seats        ?? 5,
    transmission: car?.transmission ?? "Automatic",
    image:        car?.image        ?? "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80",
  });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setLoading(true);
    await onSave({
      ...form,
      year:        +form.year,
      pricePerDay: +form.pricePerDay,
      mileage:     +form.mileage,
      seats:       +form.seats,
    });
    setLoading(false);
  };

  return (
    <Modal
      title={car ? "Edit Car" : "Add New Car"}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={loading}>
            {loading ? "Saving…" : "Save Car"}
          </button>
        </>
      }
    >
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Make</label>
          <input className="form-input" value={form.make} placeholder="Tesla"
            onChange={(e) => set("make", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Model</label>
          <input className="form-input" value={form.model} placeholder="Model S"
            onChange={(e) => set("model", e.target.value)} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Year</label>
          <input className="form-input" type="number" value={form.year}
            onChange={(e) => set("year", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-input form-select" value={form.category}
            onChange={(e) => set("category", e.target.value)}>
            {["Sedan", "SUV", "Sports", "Electric", "Truck", "Van"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Price / Day ($)</label>
          <input className="form-input" type="number" value={form.pricePerDay}
            onChange={(e) => set("pricePerDay", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-input form-select" value={form.status}
            onChange={(e) => set("status", e.target.value)}>
            {["available", "rented", "maintenance"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Mileage (km)</label>
          <input className="form-input" type="number" value={form.mileage}
            onChange={(e) => set("mileage", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Seats</label>
          <input className="form-input" type="number" value={form.seats}
            onChange={(e) => set("seats", e.target.value)} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Transmission</label>
          <select className="form-input form-select" value={form.transmission}
            onChange={(e) => set("transmission", e.target.value)}>
            <option>Automatic</option>
            <option>Manual</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Image URL</label>
        <input className="form-input" value={form.image}
          onChange={(e) => set("image", e.target.value)} />
      </div>
    </Modal>
  );
}

// ── Manage Cars Page ───────────────────────────────────────────────────────────
export default function ManageCars({ toast }) {
  const [cars, setCars]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCar, setEditCar]   = useState(null);
  const [filters, setFilters]   = useState({ search: "", status: "All", category: "All" });

  const load = () => {
    setLoading(true);
    api.getCars(filters).then((c) => { setCars(c); setLoading(false); });
  };

  useEffect(() => { load(); }, [filters]);

  const openAdd  = () => { setEditCar(null); setShowForm(true); };
  const openEdit = (car) => { setEditCar(car); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditCar(null); };

  const handleDelete = async (id) => {
    if (!confirm("Delete this car?")) return;
    await api.deleteCar(id);
    toast.show("Car deleted");
    load();
  };

  const handleSave = async (data) => {
    if (editCar) {
      await api.updateCar(editCar._id, data);
      toast.show("Car updated successfully");
    } else {
      await api.addCar(data);
      toast.show("Car added successfully");
    }
    closeForm();
    load();
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Manage Cars</h2>
          <p className="text-muted">{cars.length} vehicles in fleet</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Car</button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            className="form-input"
            placeholder="Search make or model…"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          />
        </div>
        <select
          className="form-input form-select"
          style={{ width: 150 }}
          value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
        >
          {["All", "Electric", "Sports", "SUV", "Sedan"].map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          className="form-input form-select"
          style={{ width: 150 }}
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
        >
          {["All", "available", "rented", "maintenance"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Car</th>
                  <th>Year</th>
                  <th>Category</th>
                  <th>Price/Day</th>
                  <th>Mileage</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => (
                  <tr key={car._id}>
                    <td className="td-bold">{car.make} {car.model}</td>
                    <td>{car.year}</td>
                    <td>{car.category}</td>
                    <td className="text-accent td-bold">${car.pricePerDay}</td>
                    <td className="text-muted">{car.mileage.toLocaleString()} km</td>
                    <td><Stars rating={car.rating} /></td>
                    <td><StatusBadge status={car.status} /></td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(car)}>✏ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(car._id)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {cars.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🚗</div>
                <h3>No cars found</h3>
                <p>Try different filters or add a new car</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showForm && (
        <CarFormModal car={editCar} onSave={handleSave} onClose={closeForm} />
      )}
    </div>
  );
}
