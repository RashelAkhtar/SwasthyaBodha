import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";
import { useLanguage } from "../context/LanguageContext";

function Navbar() {
  const { language, setLanguage, t, supportedLanguages } = useLanguage();

  // const scrollDown = () => {
  //   window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  // };

  return (
    <header className="nav-shell">
      <div className="nav-inner">
        <div className="nav-brand">
          <span className="nav-brand-mark" aria-hidden="true">
            +
          </span>
          <div>
            <p className="nav-brand-title">MedAI Radiology</p>
            <p className="nav-brand-subtitle">{t("nav_brand_subtitle")}</p>
          </div>
        </div>

        <nav className="nav-menu">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-menu-link ${isActive ? "is-active" : ""}`
            }
          >
            {t("nav_home")}
          </NavLink>
          <NavLink
            to="/xray"
            className={({ isActive }) =>
              `nav-menu-link ${isActive ? "is-active" : ""}`
            }
          >
            {t("nav_xray")}
          </NavLink>
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `nav-menu-link ${isActive ? "is-active" : ""}`
            }
          >
            {t("nav_reports")}
          </NavLink>
        </nav>

        <div className="nav-controls">
          <label className="nav-language-label" htmlFor="nav-language">
            {t("nav_language_label")}
          </label>
          <select
            id="nav-language"
            className="nav-language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {supportedLanguages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {/* <button type="button" className="nav-scroll-btn" onClick={scrollDown}>
            {t("nav_scroll_down")}
          </button> */}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
