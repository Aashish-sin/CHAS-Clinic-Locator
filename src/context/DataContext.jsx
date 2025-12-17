import { createContext, useState, useEffect } from "react";
import { formatClinicData } from "../api/helpers";

export const DataContext = createContext(null);

export default function DataProvider({ children }) {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/CHASClinics.geojson");
        if (!res.ok) {
          throw new Error(`Failed to fetch clinics: ${res.status}`);
        }
        const data = await res.json();
        if (!data.features || !Array.isArray(data.features)) {
          throw new Error("Malformed data: features array is missing.");
        }
        const formattedClinics = formatClinicData(data.features);
        setClinics(formattedClinics);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <DataContext.Provider value={{ clinics, loading, error }}>
      {children}
    </DataContext.Provider>
  );
}
