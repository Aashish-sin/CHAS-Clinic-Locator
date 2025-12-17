const parseDescription = (description) => {
  if (!description || typeof description !== "string") return {};

  const properties = {};
  const parser = new DOMParser();
  const doc = parser.parseFromString(description, "text/html");

  const rows = doc.querySelectorAll('tr');

  rows.forEach(row => {
    const key = row.querySelector('th')?.textContent?.trim();
    const value = row.querySelector('td')?.textContent?.trim();

    if (key && value && !key.includes("Attributes")) {
      properties[key] = value;
    }
  });

  return properties;
};

export const formatClinicData = (features) => {
  return features
    .map((feature) => {
      if (!feature.properties || !feature.properties.Description) {
        return null;
      }
      const properties = parseDescription(feature.properties.Description);
      const id = properties.HCI_CODE;
      const name = properties.HCI_NAME;
      if (!id || !name) {
        return null;
      }
      const address = `${properties.BLK_HSE_NO || ""} ${
        properties.STREET_NAME || ""
      } ${properties.BUILDING_NAME || ""}`.trim();
      const programs =
        properties.CLINIC_PROGRAMME_CODE &&
        properties.CLINIC_PROGRAMME_CODE !== ""
          ? properties.CLINIC_PROGRAMME_CODE.split(",").length
          : 0;

      let tier;
      if (programs >= 3) {
        tier = "Blue";
      } else if (programs === 2) {
        tier = "Orange";
      } else {
        tier = "Green";
      }
      const telephone = properties.HCI_TEL;
      const postalcode = properties.POSTAL_CD;
      const formattedFeature = {
        ...feature,
        properties: {
          ...feature.properties,
          id,
          name,
          address,
          tier,
          telephone,
          postalcode,
          ...properties,
        },
      };
      return formattedFeature;
    })
    .filter(Boolean);
};

export const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};
