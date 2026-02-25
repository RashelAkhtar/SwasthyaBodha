import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import styles from './Hero.module.css';

export default function Hero() {
    const { t } = useLanguage();
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        { id: 1, src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800&h=600", alt: "Medical professional looking at digital tablet" },
        { id: 2, src: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800&h=600", alt: "Laboratory technician examining sample" },
        { id: 3, src: "https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?auto=format&fit=crop&q=80&w=800&h=600", alt: "Patient and doctor discussion" }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000); // Slide changes every 4 seconds

        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <section className={styles.heroSection}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <span className={styles.tagline}>{t("hero_tagline")}</span>
                    <h1 className={styles.title}>
                        {t("hero_title_start")} <span className="text-gradient">{t("hero_title_accent")}</span> {t("hero_title_end")}
                    </h1>
                    <p className={styles.description}>
                        {t("hero_description")}
                    </p>
                    <div className={styles.actions}>
                        <Link to="/xray" className="btn btn-primary">
                            {t("hero_btn_xray")}
                        </Link>
                        <Link to="/reports" className="btn btn-secondary">
                            {t("hero_btn_report")}
                        </Link>
                    </div>

                    <div className={styles.disclaimerBox}>
                        <p className={styles.disclaimer}>
                            <strong>{t("hero_disclaimer_notice")}</strong> {t("hero_disclaimer_text")}
                        </p>
                    </div>
                </div>

                <div className={styles.visualSupport}>
                    <div className={styles.sliderContainer}>
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`${styles.slide} ${index === currentSlide ? styles.activeSlide : ''}`}
                                style={{ transform: `translateX(${(index - currentSlide) * 100}%)` }}
                            >
                                <img
                                    src={slide.src}
                                    alt={slide.alt}
                                    className={styles.slideImage}
                                />
                            </div>
                        ))}

                        <div className={styles.sliderNavigation}>
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    className={`${styles.sliderDot} ${index === currentSlide ? styles.activeDot : ''}`}
                                    onClick={() => setCurrentSlide(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
