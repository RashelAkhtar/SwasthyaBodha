import "../styles/About.css";
import { useLanguage } from "../context/LanguageContext";
import HowItWorks from "../components/HowItWorks";

function About() {
    const { t } = useLanguage();
    return (
        <div className="aboutContainer">
            <header className="aboutHeader">
                <h1 className="aboutTitle">{t("about_title")}</h1>
                <p className="aboutSubtitle">{t("about_subtitle")}</p>
            </header>

            <section className="aboutSection">
                <h2>{t("about_mission_title")}</h2>
                <p>
                    {t("about_mission_p1")}
                </p>
                <p>
                    {t("about_mission_p2")}
                </p>

                <div className="visionGrid">
                    <div className="visionCard">
                        <h3>{t("about_vision_1_title")}</h3>
                        <p>{t("about_vision_1_desc")}</p>
                    </div>
                    <div className="visionCard">
                        <h3>{t("about_vision_2_title")}</h3>
                        <p>{t("about_vision_2_desc")}</p>
                    </div>
                </div>
            </section>

            <HowItWorks />

            <section className="aboutSection" style={{ textAlign: 'center', marginTop: '4rem' }}>
                <h2>{t("about_journey_title")}</h2>
                <p>
                    {t("about_journey_desc")}
                </p>
            </section>
        </div>
    );
}

export default About;
