import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { runOnce } from "../api/guard";
import { formatClinicData } from "../api/helpers";

export default function ClinicDetails() {
  const { id } = useParams();
  const [clinic, setClinic] = useState(null);

  useEffect(() => {
    if (!runOnce(`clinic-${id}`)) return;

    fetch("/CHASClinics.geojson")
      .then((res) => res.json())
      .then((data) => {
        const formattedClinics = formatClinicData(data.features);
        const foundClinic = formattedClinics.find(
          (c) => c.properties.HCI_CODE?.toString() === id
        );
        setClinic(foundClinic || null);
      });
  }, [id]);

  if (!clinic) return <p>Loading...</p>;

  return (
    <div className="page">
      <h1>{clinic.properties.name}</h1>
      <p><strong>Address:</strong> {clinic.properties.address}</p>
      <p><strong>Tier:</strong> {clinic.properties.tier}</p>
      <p><strong>Postal Code:</strong> {clinic.properties.postalcode}</p>
      <p><strong>Telephone:</strong> {clinic.properties.telephone}</p>
    </div>
  );
}