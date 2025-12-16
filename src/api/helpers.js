const parseDescription = (description) => {
  if (!description || typeof description !== "string") return {};
  console.log("Raw Description:", description); // Debug log for raw Description

  const properties = {};

  // Refined regex to exclude unwanted content and ensure valid key-value pairs
  const regex = /<th[^>]*>([^<]+)<\/th>\s*<td[^>]*>([^<]*)<\/td>/g;
  const matches = [...description.matchAll(regex)];
  console.log("Regex matches:", matches); // Debug log for regex matches

  for (const match of matches) {
    const key = match[1]?.trim();
    const value = match[2]?.trim();
    if (key && !key.includes("Attributes")) { // Exclude unwanted keys like "Attributes"
      properties[key] = value;
    }
  }

  console.log("Parsed properties:", properties); // Debug log for parsed properties
  return properties;
};

export const formatClinicData = (features) => {
  console.log("Input features:", features); // Debug log for input features

  return features
    .map((feature, idx) => {
      if (!feature.properties || !feature.properties.Description) {
        console.log(`Feature at index ${idx} is missing properties or Description`, feature); // Debug log for missing properties
        return null;
      }
      const properties = parseDescription(feature.properties.Description);
      console.log(`Parsed properties for feature at index ${idx}:`, properties); // Debug log for parsed properties

      const id = properties.HCI_CODE;
      const name = properties.HCI_NAME;
      if (!id || !name) {
        console.log('Filtered out: Missing id or name.', {
          idx,
          id,
          name,
          Desc: feature.properties.Description
        });
        return null;
      }
      const address = `${properties.BLK_HSE_NO || ""} ${properties.STREET_NAME || ""} ${properties.BUILDING_NAME || ""}`.trim();
      const programs =
        properties.CLINIC_PROGRAMME_CODE && properties.CLINIC_PROGRAMME_CODE !== ""
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
      console.log(`Formatted feature at index ${idx}:`, formattedFeature); // Debug log for formatted feature
      return formattedFeature;
    })
    .filter(Boolean);
};

export const searchByAddress = (features, searchTerm) => {
  if (!searchTerm || typeof searchTerm !== "string") {
    console.warn("Invalid search term provided.");
    return [];
  }

  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  return features.filter((feature) => {
    const address = feature?.properties?.address || "";
    return address.toLowerCase().includes(lowerCaseSearchTerm);
  });
};