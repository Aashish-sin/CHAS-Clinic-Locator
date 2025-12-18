import { useState, useEffect, useContext } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useMapEvents } from "react-leaflet";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { DataContext } from "../context/DataContext";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

const DEFAULT_MAP_CENTER = [1.3521, 103.8198];
const DEFAULT_MAP_ZOOM = 12;
const NEARBY_RADIUS_KM = 5;

const redIcon = new L.DivIcon({
  html: `<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="32"
    height="32"
    fill="#FF0000"
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const haversineDistance = (coords1, coords2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(coords2[1] - coords1[1]);
  const dLon = toRad(coords2[0] - coords1[0]);
  const lat1 = toRad(coords1[1]);
  const lat2 = toRad(coords2[1]);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const parseDescription = (description) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(description, "text/html");
  const rows = doc.querySelectorAll("tr");
  const properties = {};
  rows.forEach((row) => {
    const th = row.querySelector("th");
    const td = row.querySelector("td");
    if (th && td) {
      properties[th.textContent.trim()] = td.textContent.trim();
    }
  });
  return properties;
};

export default function Map() {
  const { clinics, loading, error } = useContext(DataContext);
  const [searchParams] = useSearchParams();
  const [mapCenter, setMapCenter] = useState(DEFAULT_MAP_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_MAP_ZOOM);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyClinics, setNearbyClinics] = useState([]);
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState("");

  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const zoomParam = searchParams.get("zoom");
    if (lat && lng) {
      setMapCenter([parseFloat(lat), parseFloat(lng)]);
      setZoom(zoomParam ? parseInt(zoomParam, 10) : 15);
    } else {
      setMapCenter(DEFAULT_MAP_CENTER);
      setZoom(DEFAULT_MAP_ZOOM);
    }
    setNearbyClinics([]);
    setUserLocation(null);
    setGeoError("");
  }, [searchParams]);

  useEffect(() => {
    if (!clinics || clinics.length === 0) return;

    const centerCoords = [mapCenter[1], mapCenter[0]];
    const nearby = clinics.filter(
      (clinic) =>
        haversineDistance(centerCoords, clinic.geometry.coordinates) <=
        NEARBY_RADIUS_KM
    );
    setNearbyClinics(nearby);
  }, [mapCenter, clinics, userLocation]);

  const handleFindNearMe = async () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setMapCenter([latitude, longitude]);
        setZoom(17);
        setGeoError("");
      } catch (err) {
        setGeoError("Unable to retrieve your location.");
      } finally {
        setIsLocating(false);
      }
    } else {
      setGeoError("Geolocation is not supported by this browser.");
    }
  };

  if (loading) return <p>Loading map...</p>;
  const clinicsToDisplay = userLocation ? nearbyClinics : clinics || [];

  return (
    <div className="page">
      <button
        onClick={handleFindNearMe}
        style={{ margin: "10px", padding: "5px 10px" }}
        disabled={isLocating}
      >
        {isLocating ? "Finding..." : "Find near me"}
      </button>
      {error && (
        <p style={{ color: "#c00", fontWeight: "bold" }}>Error: {error}</p>
      )}
      {geoError && <p style={{ color: "#c00" }}>{geoError}</p>}
      <MapContainer
        key={`${mapCenter[0]}-${mapCenter[1]}-${zoom}`}
        center={mapCenter}
        zoom={zoom}
        style={{ height: "calc(100vh - 120px)", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {clinicsToDisplay?.map((clinic, index) => {
          if (
            !clinic.geometry ||
            !Array.isArray(clinic.geometry.coordinates) ||
            clinic.geometry.coordinates.length < 2 ||
            typeof clinic.geometry.coordinates[0] !== "number" ||
            typeof clinic.geometry.coordinates[1] !== "number"
          ) {
            return null; 
          }

          const details = parseDescription(clinic.properties.Description);
          const hciCode = details.HCI_CODE || `marker-${index}`;
          const hciName = details.HCI_NAME || "Unknown Clinic";
          const address =
            [details.BLK_HSE_NO, details.STREET_NAME, details.BUILDING_NAME]
              .filter(Boolean)
              .join(", ") || "Address not available";

          return (
            <Marker
              key={hciCode}
              position={[
                clinic.geometry.coordinates[1],
                clinic.geometry.coordinates[0],
              ]}
            >
              <Tooltip>{hciName}</Tooltip>
              <Popup>
                <strong>{hciName}</strong>
                <br />
                {address}
                <br />
                {details.HCI_CODE && (
                  <Link to={`/clinic/${details.HCI_CODE}`}>View Details</Link>
                )}
              </Popup>
            </Marker>
          );
        })}
        {userLocation && (
          <Marker position={userLocation} icon={redIcon}>
            <Popup>Your Location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
