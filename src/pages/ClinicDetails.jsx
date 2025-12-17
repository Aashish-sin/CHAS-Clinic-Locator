import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { DataContext } from "../context/DataContext";

export default function ClinicDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clinics, loading, error } = useContext(DataContext);

  if (loading) return <p>Loading clinic details...</p>;
  if (error) return <p style={{ color: "#c00" }}>Error: {error}</p>;

  const clinic = clinics.find((c) => c.properties.HCI_CODE?.toString() === id);

  if (!clinic) return <p>Clinic not found.</p>;

  const handleViewOnMap = () => {
    const [lon, lat] = clinic.geometry.coordinates;
    navigate(`/map?lat=${lat}&lon=${lon}`);
  };

  return (
    <div className="page">
      <h1>{clinic.properties.name}</h1>
      <p><strong>Address:</strong> {clinic.properties.address}</p>
      <p><strong>Tier:</strong> {clinic.properties.tier}</p>
      <p><strong>Postal Code:</strong> {clinic.properties.postalcode}</p>
      <p><strong>Telephone:</strong> {clinic.properties.telephone}</p>
      <button onClick={handleViewOnMap} style={{ marginTop: "20px", width: "fit-content" }}>
        View on Map
      </button>
    </div>
  );
}