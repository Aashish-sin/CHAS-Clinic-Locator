import { useEffect, useState } from "react";
import { getFavourites, deleteFavourite } from "../api/airtable";
import { runOnce } from "../api/guard";

export default function Favourites() {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    if (!runOnce("loadFavourites")) return;

    getFavourites().then(setFavourites);
  }, []);

  const handleDelete = async (recordId) => {
    await deleteFavourite(recordId);
    setFavourites(favourites.filter((fav) => fav.id !== recordId));
  };

  return (
    <div className="page">
      <h1>Your Favourites</h1>

      {favourites.length === 0 && <p>No favourites yet.</p>}

      {favourites.map((fav) => (
        <div key={fav.id} className="fav-card">
          <h3>{fav.fields.name}</h3>
          <p>{fav.fields.address}</p>
          <p>Tier: {fav.fields.tier}</p>

          <button onClick={() => handleDelete(fav.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}