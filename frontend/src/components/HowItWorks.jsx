import { useLanguage } from '../context/LanguageContext';
import styles from './HowItWorks.module.css';

export default function HowItWorks() {
    const { t } = useLanguage();
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{t("hiw_title")}</h2>
                    <p className={styles.subtitle}>
                        {t("hiw_subtitle")}
                    </p>
                </div>

                <div className={styles.grid}>
                    {/* Step 1 */}
                    <div className={styles.featureCard}>
                        <div className={styles.iconContainer}>
                            <span className={styles.stepNumber}>1</span>
                        </div>
                        <h3>{t("hiw_step_1_title")}</h3>
                        <p>
                            {t("hiw_step_1_desc")}
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className={styles.featureCard}>
                        <div className={styles.iconContainer}>
                            <span className={styles.stepNumber}>2</span>
                        </div>
                        <h3>{t("hiw_step_2_title")}</h3>
                        <p>
                            {t("hiw_step_2_desc")}
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className={styles.featureCard}>
                        <div className={styles.iconContainer}>
                            <span className={styles.stepNumber}>3</span>
                        </div>
                        <h3>{t("hiw_step_3_title")}</h3>
                        <p>
                            {t("hiw_step_3_desc")}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
