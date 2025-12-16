import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/">Search</Link>
      <Link to="/favourites">Favourites</Link>
    </nav>
  );
}