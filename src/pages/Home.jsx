import { useEffect, useState, useContext } from "react";
import ClinicCard from "../components/ClinicCard";
import TierFilter from "../components/TierFilter";
import { addFavourite, getFavourites } from "../api/airtable";
import { getDistance } from "../api/helpers";
import { DataContext } from "../context/DataContext";

export default function Home() {
  const { clinics, loading, error: contextError } = useContext(DataContext);

  const [displayedClinics, setDisplayedClinics] = useState([]);
  const [tier, setTier] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [locationError, setLocationError] = useState("");
  const [favouriteClinicIds, setFavouriteClinicIds] = useState([]);

  useEffect(() => {
    setDisplayedClinics(clinics);
  }, [clinics]);

  useEffect(() => {
    const loadFavourites = async () => {
      const favs = await getFavourites();
      const favIds = favs.map((fav) => fav.fields.clinicId);
      setFavouriteClinicIds(favIds);
    };
    loadFavourites();
  }, []);

  const handleSaveFavourite = async (clinicData) => {
    const record = await addFavourite(clinicData);
    if (record) {
      setFavouriteClinicIds((prevIds) => [...prevIds, clinicData.clinicId]);
      return record;
    }
    return null;
  };

  const sortByLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const sorted = [...displayedClinics]
          .map((clinic) => {
            const [clinicLon, clinicLat] = clinic.geometry.coordinates;
            const distance = getDistance(
              latitude,
              longitude,
              clinicLat,
              clinicLon
            );
            return { ...clinic, distance };
          })
          .sort((a, b) => a.distance - b.distance);
        setDisplayedClinics(sorted);
      },
      () => {
        setLocationError(
          "Could not get your location. Please enable location services."
        );
      }
    );
  };

  const filtered = displayedClinics.filter(
    (clinic) =>
      (tier === "all" ? true : clinic.properties.tier === tier) &&
      clinic.properties.address
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading clinics...</p>;

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
        <button onClick={sortByLocation}>Find Near Me</button>
      </div>

      {contextError && (
        <p style={{ color: "#c00", fontWeight: "bold" }}>
          Error: {contextError}
        </p>
      )}
      {locationError && (
        <p style={{ color: "#c00", fontWeight: "bold" }}>{locationError}</p>
      )}

      <div className="clinic-list grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
        {filtered.length === 0 && !loading ? (
          <p>No clinics found.</p>
        ) : (
          filtered.map((clinic) => (
            <ClinicCard
              key={clinic.properties.HCI_CODE}
              clinic={clinic}
              onSave={handleSaveFavourite}
              isFavourited={favouriteClinicIds.includes(
                clinic.properties.HCI_CODE
              )}
            />
          ))
        )}
      </div>
    </div>
  );
}
