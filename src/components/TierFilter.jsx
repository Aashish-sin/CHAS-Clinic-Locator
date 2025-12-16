export default function TierFilter({ selectedTier, onChange }) {
  return (
    <div className="tier-filter">
      <label>Filter by Tier:</label>
      <select value={selectedTier} onChange={(e) => onChange(e.target.value)}>
        <option value="all">All</option>
        <option value="Green">Green</option>
        <option value="Orange">Orange</option>
        <option value="Blue">Blue</option>
      </select>
    </div>
  );
}