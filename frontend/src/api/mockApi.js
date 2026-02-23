// ─── Real API client — calls the Node.js + Express + MongoDB backend ──────────
// Base URL is read from the Vite env variable; falls back to localhost:5000.
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

// ── Helpers ───────────────────────────────────────────────────────────────────

const getToken = () => localStorage.getItem("rac_token");

const buildHeaders = (extra = {}) => {
  const h = { "Content-Type": "application/json", ...extra };
  const token = getToken();
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
};

const request = async (path, options = {}) => {
  const res  = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(options.headers),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Request failed");
  return json;
};

// ── Auth ───────────────────────────────────────────────────────────────────────
export const login = async (email, password) => {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("rac_token", data.token);
  return data;
};

export const register = async (name, email, password) => {
  const data = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  localStorage.setItem("rac_token", data.token);
  return data;
};

export const logout = () => localStorage.removeItem("rac_token");

export const getMe = () => request("/auth/me");

// ── Cars ───────────────────────────────────────────────────────────────────────
export const getCars = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== "All") params.set("category", filters.category);
  if (filters.status   && filters.status   !== "All") params.set("status",   filters.status);
  if (filters.search)                                  params.set("search",   filters.search);
  const qs   = params.toString();
  const data = await request(`/cars${qs ? `?${qs}` : ""}`);
  return data.data;
};

export const addCar = async (car) => {
  const data = await request("/cars", { method: "POST", body: JSON.stringify(car) });
  return data.data;
};

export const updateCar = async (id, updates) => {
  const data = await request(`/cars/${id}`, { method: "PUT", body: JSON.stringify(updates) });
  return data.data;
};

export const deleteCar = async (id) => {
  await request(`/cars/${id}`, { method: "DELETE" });
  return { success: true };
};

// ── Bookings ───────────────────────────────────────────────────────────────────
export const getBookings = async (_userId, _role) => {
  const data = await request("/bookings");
  return data.data;
};

export const createBooking = async (booking) => {
  const data = await request("/bookings", {
    method: "POST",
    body: JSON.stringify({ carId: booking.carId, startDate: booking.startDate, endDate: booking.endDate }),
  });
  return data.data;
};

// ── Stats (admin only) ─────────────────────────────────────────────────────────
export const getStats = async () => {
  const data = await request("/cars/stats");
  return data.data;
};
