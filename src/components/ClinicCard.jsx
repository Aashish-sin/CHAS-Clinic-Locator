import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ClinicCard({ clinic, onSave, isFavourited }) {
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    setSaving(true);
    try {
      const record = await onSave({
        clinicId: clinic.properties.id,
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

  return (
    <div className="clinic-card">
      <div className="card-content">
        <h3>{clinic.properties?.name || "N/A"}</h3>
        <p>{clinic.properties?.address || "N/A"}</p>
        <p>Tier: {clinic.properties?.tier || "N/A"}</p>
        {clinic.distance && (
          <p>
            <strong>Distance:</strong> {clinic.distance.toFixed(2)} km
          </p>
        )}
      </div>

      <Link to={`/clinic/${clinic.properties?.id || ""}`}>
        <button disabled={!clinic.properties?.id}>View Details</button>
      </Link>

      {onSave && clinic.properties?.id && (
        <button
          onClick={handleButtonClick}
          disabled={saving && !isFavourited}
        >
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
