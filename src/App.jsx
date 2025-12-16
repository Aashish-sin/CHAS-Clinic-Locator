import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ClinicDetails from "./pages/ClinicDetails";
import Favourites from "./pages/Favourites";
import './App.css';

export default function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clinic/:id" element={<ClinicDetails />} />
        <Route path="/favourites" element={<Favourites />} />
      </Routes>
    </Router>
  );
}


/*
import { useEffect, useState } from "react";

function App() {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    fetch("./CHASclinics.geojson") 
      .then((res) => res.json())
      .then(setGeoData)
      .catch(console.error);
  }, []);

  return <pre>{geoData && JSON.stringify(geoData, null, 2)}</pre>;
}

export default App;
*/
