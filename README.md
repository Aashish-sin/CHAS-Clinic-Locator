# CHAS Clinic Finder

A simple and fast web application to find Community Health Assist Scheme (CHAS) clinics in Singapore. Users can search for clinics by address, filter them by their CHAS tier (Blue, Orange, or Green), and save their favourite clinics for easy access. There is also a map feature that will show the locations of the clinics based on the co-ordinates found in the API.

## Introduction

This project was built to provide a clean and modern interface for an essential public dataset, making it easier for users to find the healthcare they need.

## Getting Started

A publicly deployed version of the app is not yet available. To run the project locally:

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`

## Technologies Used

*   **JavaScript**
*   **React**
*   **React Router**
*   **Vite**

## component tree

public
|CHASClinics.geojson
src
|api
 |airtable.js
 |helpers.js
|components
 |ClinicCard.jsx
 |Navbar.jsx
 |TierFilter.jsx
|context
 |DataContext.jsx
|pages
 |ClinicDetails.jsx
 |Favourites.jsx
 |Home.jsx
 |Map.jsx
|App.jsx
|App.css
|index.css
|main.jsx
.env
.gitattributes
.gitignore
eslint.config.js
index.html
package-lock.json
package.json
README.md
vite.config.js

## all environment variables



## airtable columns

clinicId
name
address
tier

## Citation

*   Ministry of Health. (2023). *CHAS Clinics (2024)* [Dataset]. data.gov.sg. Retrieved December 11, 2025 from https://data.gov.sg/datasets/d_548c33ea2d99e29ec63a7cc9edcccedc/view

## Next Steps

*   **User Accounts:** Implement user authentication to allow users to sync their favourites across devices.
*   **Advanced Filtering:** Add more filtering options, such as by specific services offered.
*   **Clinic Details Enhancement:** Add more details to the clinic details page, such as opening hours.