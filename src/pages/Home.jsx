import { useEffect, useState } from "react";
import ClinicCard from "../components/ClinicCard";
import TierFilter from "../components/TierFilter";
import { addFavourite, getFavourites } from "../api/airtable";
import { formatClinicData } from "../api/helpers";

export default function Home() {
  const [clinics, setClinics] = useState([]);
  const [tier, setTier] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [favouriteClinicIds, setFavouriteClinicIds] = useState([]);

  useEffect(() => {
    setError("");
    const loadData = async () => {
      try {
        const res = await fetch("/CHASClinics.geojson");
        if (!res.ok) {
          setError(`Failed to fetch clinics: ${res.status} ${res.statusText}`);
          setClinics([]);
          return;
        }
        const data = await res.json();
        if (!data.features || !Array.isArray(data.features)) {
          setError("Malformed data: features array is missing.");
          setClinics([]);
          return;
        }
        const formattedClinics = formatClinicData(data.features);
        setClinics(formattedClinics);

        const favs = await getFavourites();
        const favIds = favs.map((fav) => fav.fields.clinicId);
        setFavouriteClinicIds(favIds);
      } catch (err) {
        setError("Loading clinics failed: " + err.message);
      }
    };

    loadData();
  }, []);

  const handleSaveFavourite = async (clinicData) => {
    const record = await addFavourite(clinicData);
    if (record) {
      setFavouriteClinicIds((prevIds) => [...prevIds, clinicData.clinicId]);
      return record;
    }
    return null;
  };

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

      <div className="clinic-list grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
        {filtered.length === 0 ? (
          <p>No clinics found.</p>
        ) : (
          filtered.map((clinic) => (
            <ClinicCard
              key={clinic.properties.id}
              clinic={clinic}
              onSave={handleSaveFavourite}
              isFavourited={favouriteClinicIds.includes(clinic.properties.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
