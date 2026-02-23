import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand-block">
          <div className="brand-mark">+</div>
          <div>
            <p className="brand-title">MedAI Radiology</p>
            <p className="brand-subtitle">Clinical Decision Support</p>
          </div>
        </div>

        <nav className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/analyze"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Analyze
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
