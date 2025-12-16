import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/">Home</Link>
        <Link to="/favourites">Favourites</Link>
      </div>
    </nav>
  );
}
