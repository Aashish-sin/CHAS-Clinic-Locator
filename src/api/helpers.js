const parseDescription = (description) => {
  if (!description || typeof description !== "string") return {};

  const properties = {};

  const regex = /<th[^>]*>([^<]+)<\/th>\s*<td[^>]*>([^<]*)<\/td>/g;
  const matches = [...description.matchAll(regex)];

  for (const match of matches) {
    const key = match[1]?.trim();
    const value = match[2]?.trim();
    if (key && !key.includes("Attributes")) {
      properties[key] = value;
    }
  }

  return properties;
};

export const formatClinicData = (features) => {
  return features
    .map((feature, idx) => {
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

export const searchByAddress = (features, searchTerm) => {
  if (!searchTerm || typeof searchTerm !== "string") {
    return [];
  }

  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  return features.filter((feature) => {
    const address = feature?.properties?.address || "";
    return address.toLowerCase().includes(lowerCaseSearchTerm);
  });
};
