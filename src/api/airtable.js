const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE;
const TABLE = import.meta.env.VITE_AIRTABLE_TABLE;
const TOKEN = `Bearer ${import.meta.env.VITE_AIRTABLE_TOKEN}`;

const AIRTABLE_BASE = `https://api.airtable.com/v0/${BASE_ID}/${TABLE}`;

let submitting = false; // prevents double POST in StrictMode

export async function getFavourites() {
  try {
    const res = await fetch(AIRTABLE_BASE, {
      headers: { Authorization: TOKEN },
    });

    if (!res.ok) {
      console.error(`Failed to fetch favourites: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    return data.records || [];
  } catch (error) {
    console.error("Error fetching favourites:", error);
    return [];
  }
}

export async function addFavourite(clinic) {
  if (submitting) return; // block duplicate POST
  submitting = true;

  const response = await fetch(AIRTABLE_BASE, {
    method: "POST",
    headers: {
      Authorization: TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: {
        clinicId: clinic.properties.id,
        name: clinic.properties.name,
        address: clinic.properties.address,
        tier: clinic.properties.tier,
      },
    }),
  });

  submitting = false;
  return response;
}

export async function deleteFavourite(recordId) {
  return fetch(`${AIRTABLE_BASE}/${recordId}`, {
    method: "DELETE",
    headers: { Authorization: TOKEN }
  });
}