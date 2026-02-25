import { useState } from "react";
import axios from "axios";
import "../styles/XRay.css";
import { formatReportText } from "../utils/textFormatting";
import { useLanguage } from "../context/LanguageContext";
import VoiceOutputToggle from "../components/VoiceOutputToggle";

function XRay() {
  const { language, t } = useLanguage();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAudioReady, setIsAudioReady] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const analyzeReport = async () => {
    if (!text && !image) {
      setError(t("xray_input_error"));
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setIsAudioReady(false);
    setCurrentSlide(0);

    try {
      const formData = new FormData();

      if (text) formData.append("text", text);
      if (image) formData.append("image", image);
      formData.append("language", language);

      const res = await axios.post("http://localhost:3000/analyze", formData);
      setResult(res.data);
      setCurrentSlide(0);
    } catch (err) {
      console.error("Error:", err);
      setError(t("xray_request_error"));
    }

    setLoading(false);
  };

  const slideNarrations = result ? [
    `${t("xray_emergency_title")}. ${result.critical_findings?.length ? result.critical_findings.join(". ") : t("xray_no_critical")}. ${t("xray_urgent_care")} ${formatReportText(result.what_this_means_for_you?.when_to_seek_urgent_care_general)}`,
    `${t("xray_report_explanation")}. ${formatReportText(result.plain_language_summary?.detailed_explanation)}`,
    `${t("xray_what_this_means")}. ${formatReportText(result.what_this_means_for_you?.what_patients_often_do_next)} ${formatReportText(result.what_this_means_for_you?.monitoring_general_advice)}`,
    `${t("xray_follow_up")}. ${formatReportText(result.lifestyle_and_followup_context?.general_lifestyle_considerations)} ${formatReportText(result.lifestyle_and_followup_context?.importance_of_followup)}`,
    `${t("xray_questions")}. ${result.questions_to_ask_your_doctor?.length ? result.questions_to_ask_your_doctor.join(". ") : t("xray_no_questions")}`
  ] : [];

  return (
    <div className={`pageWrapper ${result ? 'hasResult' : ''}`}>
      <div className={`header ${result ? 'hide' : ''}`}>
        <h1 className="title">{t("xray_title_start")} <span className="text-gradient">{t("xray_title_accent")}</span> {t("xray_title_end")}</h1>
        <p className="subtitle">
          {t("xray_subtitle")}
        </p>
      </div>

      <div className={`splitContainer ${result ? 'hasResult' : ''}`}>
        <div className="uploadCard">
          <label className="dropZone">
            <div className="iconContainer">
              <svg className="uploadIcon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="dropText">
              {t("xray_drop_text")} <span className="browseText">{t("common_browse")}</span>
            </p>
            <p className="formatText">{t("xray_format_text")}</p>
            <input
              type="file"
              className="fileInput"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>

          {preview && (
            <div className="previewContainer">
              <img src={preview} alt="XRay Preview" className="previewImage" />
            </div>
          )}

          <div className="securityNote">
            <svg className="lockIcon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>{t("common_security_note")}</span>
          </div>

          {error && <p className="analyzeError">{error}</p>}

          <button
            className="btn btn-primary submitBtn"
            onClick={analyzeReport}
            disabled={loading || !image}
          >
            {loading ? t("xray_analyzing") : t("xray_analyze")}
          </button>
        </div>

        {result && (() => {
          const slides = [
            (
              <article key="slide-0" className="analyze-card analyze-card-emergency slide-in-active">
                <h3>{t("xray_emergency_title")}</h3>
                {result.critical_findings?.length ? (
                  <ul>
                    {result.critical_findings.map((finding) => (
                      <li key={finding}>{finding}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{t("xray_no_critical")}</p>
                )}
                <p className="report-text">
                  <strong>{t("xray_urgent_care")}</strong>{" "}
                  {formatReportText(
                    result.what_this_means_for_you?.when_to_seek_urgent_care_general,
                  )}
                </p>
              </article>
            ),
            (
              <article key="slide-1" className="analyze-card analyze-card-important slide-in-active">
                <h3>{t("xray_report_explanation")}</h3>
                <p className="report-text">
                  {formatReportText(result.plain_language_summary?.detailed_explanation)}
                </p>
              </article>
            ),
            (
              <article key="slide-2" className="analyze-card analyze-card-important slide-in-active">
                <h3>{t("xray_what_this_means")}</h3>
                <p className="report-text">
                  {formatReportText(result.what_this_means_for_you?.what_patients_often_do_next)}
                </p>
                <p className="report-text">
                  {formatReportText(result.what_this_means_for_you?.monitoring_general_advice)}
                </p>
              </article>
            ),
            (
              <article key="slide-3" className="analyze-card analyze-card-info slide-in-active">
                <h3>{t("xray_follow_up")}</h3>
                <p className="report-text">
                  {formatReportText(
                    result.lifestyle_and_followup_context?.general_lifestyle_considerations,
                  )}
                </p>
                <p className="report-text">
                  {formatReportText(
                    result.lifestyle_and_followup_context?.importance_of_followup,
                  )}
                </p>
              </article>
            ),
            (
              <article key="slide-4" className="analyze-card analyze-card-standard slide-in-active">
                <h3>{t("xray_questions")}</h3>
                {result.questions_to_ask_your_doctor?.length ? (
                  <ul>
                    {result.questions_to_ask_your_doctor.map((question) => (
                      <li key={question}>{question}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{t("xray_no_questions")}</p>
                )}
              </article>
            )
          ];

          return (
            <section className="analyze-pane-output">
              {!isAudioReady && (
                <div className="audio-loading">
                  <div className="spinner"></div>
                  <p>{t("audio_preparing")}</p>
                </div>
              )}

              <div style={{ visibility: isAudioReady ? 'visible' : 'hidden', height: isAudioReady ? 'auto' : '0', overflow: 'hidden' }}>
                <header className="analyze-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2>{t("xray_output_title")}</h2>
                  <VoiceOutputToggle
                    text={slideNarrations[currentSlide]}
                    language={language}
                    t={t}
                    autoPlay={true}
                    onReady={() => setIsAudioReady(true)}
                    onEnded={() => {
                      if (currentSlide < slides.length - 1) {
                        setCurrentSlide(s => s + 1);
                      }
                    }}
                  />
                </header>

                <div className="slider-viewport" key={currentSlide}>
                  {slides[currentSlide]}
                </div>

                <div className="slider-controls">
                  <button
                    className="btn btn-secondary slider-btn"
                    disabled={currentSlide === 0}
                    onClick={() => setCurrentSlide(s => s - 1)}
                  >
                    {t("common_back")}
                  </button>
                  <div className="slide-indicators">
                    {slides.map((_, i) => (
                      <span key={i} className={`dot ${i === currentSlide ? 'active' : ''}`} />
                    ))}
                  </div>
                  <button
                    className="btn btn-primary slider-btn"
                    disabled={currentSlide === slides.length - 1}
                    onClick={() => setCurrentSlide(s => s + 1)}
                  >
                    {t("common_next")}
                  </button>
                </div>
              </div>
            </section>
          );
        })()}
      </div>
    </div>
  );
}

export default XRay;
