import { useState } from "react";
import axios from "axios";
import "../styles/Reports.css";
import { formatReportText } from "../utils/textFormatting";
import { useLanguage } from "../context/LanguageContext";
import VoiceOutputToggle from "../components/VoiceOutputToggle";

function Reports() {
  const { language, t } = useLanguage();
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [file, setFile] = useState(null);

  const interpretReport = async () => {
    if (!text.trim() && !file) {
      setError(t("reports_input_error"));
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setIsAudioReady(false);
    setCurrentSlide(0);

    try {
      const formData = new FormData();

      if (file) {
        formData.append("file", file);
      } else {
        formData.append("text", text);
      }

      formData.append("language", language);

      const res = await axios.post("http://localhost:3000/interpret", formData);
      setResult(res.data);
      setCurrentSlide(0);
    } catch (err) {
      console.error("Interpretation error:", err);
      setError(t("reports_request_error"));
    } finally {
      setLoading(false);
    }
  };

  const slideNarrations = result ? [
    `${t("reports_emergency_title")}. ${t("reports_urgent_care")} ${formatReportText(result.what_this_means_for_you?.when_to_seek_urgent_care_general)}`,
    `${t("reports_report_explanation")}. ${formatReportText(result.plain_language_summary?.detailed_explanation)}`,
    `${t("reports_key_findings")}. ${result.key_findings_explained?.length ? result.key_findings_explained.map((finding) => `${finding.original_term}: ${finding.what_it_means}`).join(". ") : t("reports_no_findings")}`,
    `${t("reports_what_this_means")}. ${formatReportText(result.what_this_means_for_you?.what_patients_often_do_next)} ${formatReportText(result.what_this_means_for_you?.monitoring_general_advice)}`,
    `${t("reports_follow_up")}. ${formatReportText(result.lifestyle_and_followup_context?.general_lifestyle_considerations)} ${formatReportText(result.lifestyle_and_followup_context?.importance_of_followup)}`,
    `${t("reports_questions")}. ${result.questions_to_ask_your_doctor?.length ? result.questions_to_ask_your_doctor.join(". ") : t("reports_no_questions")}`
  ] : [];

  return (
    <div className={`pageWrapper ${result ? 'hasResult' : ''}`}>
      <div className={`header ${result ? 'hide' : ''}`}>
        <h1 className="title">{t("reports_title_start")} <span className="text-gradient">{t("reports_title_accent")}</span> {t("reports_title_end")}</h1>
        <p className="subtitle">
          {t("reports_subtitle")}
        </p>
      </div>

      <div className={`splitContainer ${result ? 'hasResult' : ''}`}>
        <div className="uploadCard">
          <div>
            <label className="field-label" htmlFor="medical-report-text">
              {t("reports_document_label")}
            </label>
            <textarea
              id="medical-report-text"
              className="interpret-field"
              rows="5"
              placeholder={t("reports_document_placeholder")}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div style={{ textAlign: "center", fontWeight: 600, color: "var(--color-text-secondary)" }}>{t("common_or")}</div>

          <label className="dropZone">
            <div className="iconContainer">
              <svg className="uploadIcon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <p className="dropText">
              {t("reports_drop_text")} <span className="browseText">{t("common_browse")}</span>
            </p>
            <p className="formatText">{t("reports_format_text")}</p>
            <input
              type="file"
              className="fileInput"
              accept=".pdf,image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>

          {file && (
            <p style={{ textAlign: 'center', color: 'var(--color-medical-blue)', fontWeight: 500 }}>
              {t("common_selected_file")} {file.name}
            </p>
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
            onClick={interpretReport}
            disabled={loading || (!file && !text.trim())}
          >
            {loading ? t("reports_interpreting") : t("reports_interpret")}
          </button>
        </div>

        {result && (() => {
          const slides = [
            (
              <article key="slide-0" className="analyze-card analyze-card-emergency slide-in-active">
                <h3>{t("reports_emergency_title")}</h3>
                <p className="report-text">
                  <strong>{t("reports_urgent_care")}</strong>{" "}
                  {formatReportText(result.what_this_means_for_you?.when_to_seek_urgent_care_general)}
                </p>
              </article>
            ),
            (
              <article key="slide-1" className="analyze-card analyze-card-important slide-in-active">
                <h3>{t("reports_report_explanation")}</h3>
                <p className="report-text">
                  {formatReportText(result.plain_language_summary?.detailed_explanation)}
                </p>
              </article>
            ),
            (
              <article key="slide-2" className="analyze-card analyze-card-standard slide-in-active">
                <h3>{t("reports_key_findings")}</h3>
                {result.key_findings_explained?.length ? (
                  <ul>
                    {result.key_findings_explained.map((finding, idx) => (
                      <li key={`${finding.original_term}-${idx}`}>
                        <strong>{finding.original_term}:</strong>{" "}
                        {finding.what_it_means}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{t("reports_no_findings")}</p>
                )}
              </article>
            ),
            (
              <article key="slide-3" className="analyze-card analyze-card-important slide-in-active">
                <h3>{t("reports_what_this_means")}</h3>
                <p className="report-text">
                  {formatReportText(result.what_this_means_for_you?.what_patients_often_do_next)}
                </p>
                <p className="report-text">
                  {formatReportText(result.what_this_means_for_you?.monitoring_general_advice)}
                </p>
              </article>
            ),
            (
              <article key="slide-4" className="analyze-card analyze-card-info slide-in-active">
                <h3>{t("reports_follow_up")}</h3>
                <p className="report-text">
                  {formatReportText(result.lifestyle_and_followup_context?.general_lifestyle_considerations)}
                </p>
                <p className="report-text">
                  {formatReportText(result.lifestyle_and_followup_context?.importance_of_followup)}
                </p>
              </article>
            ),
            (
              <article key="slide-5" className="analyze-card analyze-card-standard slide-in-active">
                <h3>{t("reports_questions")}</h3>
                {result.questions_to_ask_your_doctor?.length ? (
                  <ul>
                    {result.questions_to_ask_your_doctor.map((question) => (
                      <li key={question}>{question}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{t("reports_no_questions")}</p>
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
                  <h2>{t("reports_output_title")}</h2>
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

export default Reports;
