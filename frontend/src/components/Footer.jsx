import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import styles from './Footer.module.css';

export default function Footer() {
    const { t } = useLanguage();
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.topSection}>
                    <div className={styles.brandInfo}>
                        <Link to="/" className={styles.logo}>
                            SwasthyaBodha
                        </Link>
                        <p className={styles.description}>
                            {t("footer_description")}
                        </p>
                    </div>

                    <div className={styles.linksSection}>
                        <div className={styles.linkGroup}>
                            <h4>{t("footer_platform")}</h4>
                            <ul>
                                <li><Link to="/">{t("nav_home")}</Link></li>
                                <li><Link to="/xray">{t("nav_xray")}</Link></li>
                                <li><Link to="/reports">{t("nav_reports")}</Link></li>
                                <li><Link to="/about">{t("about_nav")}</Link></li>
                            </ul>
                        </div>

                        <div className={styles.linkGroup}>
                            <h4>{t("footer_legal")}</h4>
                            <ul>
                                <li><Link to="/">{t("footer_privacy")}</Link></li>
                                <li><Link to="/">{t("footer_terms")}</Link></li>
                                <li><Link to="/">{t("footer_hipaa")}</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.bottomSection}>
                    <p className={styles.disclaimer}>
                        <strong>{t("footer_disclaimer_label")}</strong> {t("footer_disclaimer_text")}
                    </p>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} SwasthyaBodha. {t("footer_rights")}
                    </p>
                </div>
            </div>
        </footer>
    );
}
