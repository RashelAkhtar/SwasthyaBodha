function RiskBadge({ level }) {
  const safeLevel = (level || "low").toLowerCase();
  return <span className={`risk-badge ${safeLevel}`}>{safeLevel.toUpperCase()}</span>;
}

export default RiskBadge;
