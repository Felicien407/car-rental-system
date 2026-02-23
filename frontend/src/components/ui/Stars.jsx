export default function Stars({ rating }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i}>{i <= Math.round(rating) ? "★" : "☆"}</span>
      ))}
      <span style={{ color: "var(--muted)", marginLeft: 4 }}>{rating}</span>
    </div>
  );
}
