// src/api/airtable.js
const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME;

const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${API_KEY}`,
};

export async function getFavourites() {
  try {
    const res = await fetch(API_URL, { headers });
    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    return data.records || [];
  } catch (error) {
    return [];
  }
}

export async function addFavourite(favouriteFields) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ fields: favouriteFields }),
    });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data;
  } catch (error) {
    return null;
  }
}

export async function deleteFavourite(recordId) {
  try {
    const res = await fetch(`${API_URL}/${recordId}`, {
      method: "DELETE",
      headers: headers,
    });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data;
  } catch (error) {
    return null;
  }
}