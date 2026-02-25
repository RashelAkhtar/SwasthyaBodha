import { Link } from "react-router-dom";
import "../styles/Home.css";
import { useLanguage } from "../context/LanguageContext";

function Home() {
  const { t } = useLanguage();

  return (
    <section className="home-page">
      <div className="home-hero">
        <p className="home-kicker">{t("home_kicker")}</p>
        <h1>{t("home_title")}</h1>
        <p>{t("home_description")}</p>

        <div className="home-actions">
          <Link className="home-btn home-btn-primary" to="/xray">
            {t("home_xray_btn")}
          </Link>
          <Link className="home-btn home-btn-ghost" to="/reports">
            {t("home_reports_btn")}
          </Link>
        </div>
      </div>

      <div className="home-grid">
        <article className="home-card">
          <h3>{t("home_card_1_title")}</h3>
          <p>{t("home_card_1_desc")}</p>
        </article>

        <article className="home-card">
          <h3>{t("home_card_2_title")}</h3>
          <p>{t("home_card_2_desc")}</p>
        </article>

        <article className="home-card">
          <h3>{t("home_card_3_title")}</h3>
          <p>{t("home_card_3_desc")}</p>
        </article>
      </div>
    </section>
  );
}

export default Home;
