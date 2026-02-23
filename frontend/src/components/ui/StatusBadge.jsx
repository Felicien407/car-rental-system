const CLASS_MAP = {
  available:   "status-available",
  rented:      "status-rented",
  maintenance: "status-maintenance",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`car-status-badge ${CLASS_MAP[status] ?? ""}`}>
      {status}
    </span>
  );
}
