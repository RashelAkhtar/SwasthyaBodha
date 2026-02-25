import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const isActive = (path) => {
    return location.pathname === path ? styles.active : '';
  };

  return (
    <nav className={`${styles.navbar} glass`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">
            <span className="text-gradient">SwasthyaBodha</span>
          </Link>
        </div>

        <ul className={styles.navLinks}>
          <li>
            <Link to="/" className={`${styles.link} ${isActive('/')}`}>
              {t("nav_home")}
            </Link>
          </li>
          <li>
            <Link to="/xray" className={`${styles.link} ${isActive('/xray')}`}>
              {t("nav_xray")}
            </Link>
          </li>
          <li>
            <Link to="/reports" className={`${styles.link} ${isActive('/reports')}`}>
              {t("nav_reports")}
            </Link>
          </li>
          <li>
            <Link to="/about" className={`${styles.link} ${isActive('/about')}`}>
              {t("about_nav")}
            </Link>
          </li>
          <li>
            <div className={styles.languageSelector}>
              <span className={styles.globeIcon}>🌐</span>
              <select
                className={styles.select}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="English">English</option>
                <option value="Hindi">हिंदी (Hindi)</option>
                <option value="Assamese">অসমীয়া (Assamese)</option>
              </select>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}
