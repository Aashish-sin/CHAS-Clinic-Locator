import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ClinicDetails from "./pages/ClinicDetails";
import Favourites from "./pages/Favourites";
import Map from "./pages/Map";
import DataProvider from "./context/DataContext";
import "./App.css";
import "./index.css";

export default function App() {
  return (
    <DataProvider>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clinic/:id" element={<ClinicDetails />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </Router>
    </DataProvider>
  );
}
