export default function TierFilter({ selectedTier, onChange }) {
  const tierColors = {
    all: "black",
    Green: "#006400", 
    Orange: "#C25400", 
    Blue: "#0000FF", 
  };

  const selectStyle = {
    color: tierColors[selectedTier] || tierColors.all,
    backgroundColor: "#fff", 
  };

  return (
    <div className="tier-filter">
      <label>Filter by Tier:</label>
      <select
        value={selectedTier}
        onChange={(e) => onChange(e.target.value)}
        style={selectStyle}
      >
        <option value="all" style={{ color: tierColors.all }}>
          All
        </option>
        <option value="Green" style={{ color: tierColors.Green }}>
          Green
        </option>
        <option value="Orange" style={{ color: tierColors.Orange }}>
          Orange
        </option>
        <option value="Blue" style={{ color: tierColors.Blue }}>
          Blue
        </option>
      </select>
    </div>
  );
}
