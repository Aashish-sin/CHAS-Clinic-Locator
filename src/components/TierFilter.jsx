export default function TierFilter({ selectedTier, onChange }) {
  const tierColors = {
    All: "#000",
    Green: "green",
    Orange: "orange",
    Blue: "blue",
  };

  const selectStyle = {
    color: tierColors[selectedTier] || tierColors.All,
  };

  return (
    <div className="tier-filter">
      <label>Filter by Tier:</label>
      <select
        value={selectedTier}
        onChange={(e) => onChange(e.target.value)}
        style={selectStyle}
      >
        <option value="all" style={{ color: tierColors.All }}>
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