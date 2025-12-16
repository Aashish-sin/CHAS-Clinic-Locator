import { useEffect, useState } from "react";
import ClinicCard from "../components/ClinicCard";
import TierFilter from "../components/TierFilter";
import { addFavourite } from "../api/airtable";
import { formatClinicData } from "../api/helpers";

export default function Home() {
  const [clinics, setClinics] = useState([]);
  const [tier, setTier] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    fetch("/CHASClinics.geojson")
      .then((res) => {
        if (!res.ok) {
          setError(`Failed to fetch clinics: ${res.status} ${res.statusText}`);
          return { features: [] };
        }
        return res.json();
      })
      .then((data) => {
        if (!data.features || !Array.isArray(data.features)) {
          setError("Malformed data: features array is missing.");
          setClinics([]);
        } else {
          const formattedClinics = formatClinicData(data.features);
          setClinics(formattedClinics);
        }
      })
      .catch((err) => {
        setError("Loading clinics failed: " + err.message);
      });
  }, []);

  const filtered = clinics.filter(
    (clinic) =>
      clinic &&
      clinic.properties &&
      clinic.properties.id &&
      clinic.properties.name &&
      (tier === "all" ? true : clinic.properties.tier === tier) &&
      clinic.properties.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page">
      <h1>CHAS Clinic Search</h1>

      <TierFilter selectedTier={tier} onChange={setTier} />

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && <p style={{ color: "#c00", fontWeight: "bold" }}>{error}</p>}

      <div className="clinic-list">
        {filtered.length === 0 ? (
          <p>No clinics found.</p>
        ) : (
          filtered.map((clinic) => (
            <ClinicCard
              key={clinic.properties.id}
              clinic={clinic}
              onSave={addFavourite}
            />
          ))
        )}
      </div>
    </div>
  );
}
