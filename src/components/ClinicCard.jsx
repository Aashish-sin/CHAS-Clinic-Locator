import { Link } from "react-router-dom";
import { useState } from "react";

export default function ClinicCard({ clinic, onSave }) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await onSave(clinic);
      if (!response.ok) {
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

  return (
    <div className="clinic-card">
      <h3>{clinic.properties?.name || "N/A"}</h3>
      <p>{clinic.properties?.address || "N/A"}</p>
      <p>Tier: {clinic.properties?.tier || "N/A"}</p>

      <Link to={`/clinic/${clinic.properties?.id || ""}`}>
        <button disabled={!clinic.properties?.id}>View Details</button>
      </Link>

      {onSave && clinic.properties?.id && (
        <button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save to Favourites"}
        </button>
      )}
    </div>
  );
}