import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFavourites, deleteFavourite } from "../api/airtable";

export default function Favourites() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavourites = async () => {
      const data = await getFavourites();
      setFavourites(data);
      setLoading(false);
    };

    loadFavourites();
  }, []);

  const handleDelete = async (recordId) => {
    await deleteFavourite(recordId);
    setFavourites((prev) => prev.filter((fav) => fav.id !== recordId));
  };

  if (loading) {
    return (
      <div className="page">
        <h1>Your Favourites</h1>
        <p>Loading favourites...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Your Favourites</h1>

      <div className="clinic-list">
        {favourites.length > 0 ? (
          favourites.map((fav) => {
            const tierColorMap = {
              Green: "green",
              Orange: "orange",
              Blue: "blue",
            };
            const borderColor = tierColorMap[fav.fields.tier] || "#e0e0e0";

            return (
              <div
                key={fav.id}
                className="clinic-card"
                style={{ border: `2px solid ${borderColor}` }}
              >
                <div className="card-content">
                  <h3>{fav.fields.name}</h3>
                  <p>{fav.fields.address}</p>
                  <p>Tier: {fav.fields.tier}</p>
                </div>
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "auto" }}
                >
                  <Link
                    to={`/clinic/${fav.fields.clinicId}`}
                    style={{ flex: 1 }}
                  >
                    <button style={{ width: "100%" }}>View Details</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(fav.id)}
                    style={{ flex: 1 }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p>You have no saved favourites.</p>
        )}
      </div>
    </div>
  );
}
