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

      {favourites.length === 0 && <p>No favourites yet.</p>}
      <div className="clinic-list">
        {favourites.map((fav) => (
          <div key={fav.id} className="clinic-card">
            <div className="card-content">
              <h3>{fav.fields.name}</h3>
              <p>{fav.fields.address}</p>
              <p>Tier: {fav.fields.tier}</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <Link to={`/clinic/${fav.fields.clinicId}`} style={{ width: "100%" }}>
                <button>View Details</button>
              </Link>
              <button onClick={() => handleDelete(fav.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
