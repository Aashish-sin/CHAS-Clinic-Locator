import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ClinicCard({ clinic, onSave, isFavourited }) {
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    setSaving(true);
    try {
      const record = await onSave({
        clinicId: clinic.properties.HCI_CODE,
        name: clinic.properties.name,
        address: clinic.properties.address,
        tier: clinic.properties.tier,
      });

      if (!record) {
        alert("Failed to save to favourites. Please try again.");
        return;
      }

      alert("Saved to favourites successfully!");
    } catch (error) {
      alert("Failed to save to favourites. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleButtonClick = () => {
    if (isFavourited) {
      navigate("/favourites");
    } else {
      handleSave();
    }
  };

  const tierColorMap = {
    Green: "green",
    Orange: "orange",
    Blue: "blue",
  };

  const borderColor = tierColorMap[clinic.properties.tier] || "#e0e0e0";

  return (
    <div className="clinic-card" style={{ border: `2px solid ${borderColor}` }}>
      <div
        className="card-content"
        style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
      >
        <div style={{ flexGrow: 1 }}>
          <h3>{clinic.properties.name || "N/A"}</h3>
          <p>{clinic.properties.address || "N/A"}</p>
        </div>
        <div>
          <p>Tier: {clinic.properties.tier || "N/A"}</p>
          {clinic.distance ? (
            <p>
              <strong>Distance:</strong> {clinic.distance.toFixed(2)} km
            </p>
          ) : (
            <p style={{ minHeight: "1.2em" }}>&nbsp;</p>
          )}
        </div>
      </div>

      <Link to={`/clinic/${clinic.properties.HCI_CODE || ""}`}>
        <button disabled={!clinic.properties.HCI_CODE}>View Details</button>
      </Link>

      {onSave && clinic.properties.HCI_CODE && (
        <button onClick={handleButtonClick} disabled={saving}>
          {saving
            ? "Saving..."
            : isFavourited
            ? "View Favourites"
            : "Save to Favourites"}
        </button>
      )}
    </div>
  );
}
