import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <header className="nav-shell">
      <div className="nav-inner">
        <div className="nav-brand">
          <span className="nav-brand-mark" aria-hidden="true">
            +
          </span>
          <div>
            <p className="nav-brand-title">MedAI Radiology</p>
            <p className="nav-brand-subtitle">Clinical Decision Support</p>
          </div>
        </div>

        <nav className="nav-menu">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-menu-link ${isActive ? "is-active" : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/analyze"
            className={({ isActive }) =>
              `nav-menu-link ${isActive ? "is-active" : ""}`
            }
          >
            Analyze
          </NavLink>
          <NavLink
            to="/analyze-report"
            className={({ isActive }) =>
              `nav-menu-link ${isActive ? "is-active" : ""}`
            }
          >
            Interpret
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
