import { useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { DataContext } from "../context/DataContext";

export default function Map() {
  const { clinics, loading, error } = useContext(DataContext);
  const [searchParams] = useSearchParams();

  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  const initialZoom = lat && lon ? 15 : 12;
  const initialCenter =
    lat && lon ? [lat, lon] : [1.3521, 103.8198]; 

  if (loading) return <p>Loading map...</p>;

  return (
    <div className="page">
      <h1>Clinics Map</h1>
      {error && <p style={{ color: "#c00", fontWeight: "bold" }}>Error: {error}</p>}
      <div className="map-container">
        <MapContainer
          center={initialCenter}
          zoom={initialZoom}
          style={{ height: "70vh", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {clinics.map((clinic) => {
            const [lon, lat] = clinic.geometry.coordinates;
            const position = [lat, lon];

            return (
              <Marker key={clinic.properties.id} position={position}>
                <Popup>
                  <strong>{clinic.properties.name}</strong>
                  <br />
                  {clinic.properties.address}
                  <br />
                  <Link to={`/clinic/${clinic.properties.id}`}>View Details</Link>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
