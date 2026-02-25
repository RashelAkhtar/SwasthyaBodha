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

    try {
      const formData = new FormData();

      if (text) formData.append("text", text);
      if (image) formData.append("image", image);
      formData.append("language", language);

      const res = await axios.post("http://localhost:3000/analyze", formData);
      setResult(res.data);
    } catch (err) {
      console.error("Error:", err);
      setError(t("xray_request_error"));
    }

    setLoading(false);
  };

  const voiceNarration = result
    ? [
        `${t("xray_emergency_title")}.`,
        result.critical_findings?.length
          ? result.critical_findings.join(". ")
          : t("xray_no_critical"),
        `${t("xray_urgent_care")} ${formatReportText(
          result.what_this_means_for_you?.when_to_seek_urgent_care_general,
        )}`,
        `${t("xray_report_explanation")}. ${formatReportText(
          result.plain_language_summary?.detailed_explanation,
        )}`,
        `${t("xray_what_this_means")}. ${formatReportText(
          result.what_this_means_for_you?.what_patients_often_do_next,
        )} ${formatReportText(
          result.what_this_means_for_you?.monitoring_general_advice,
        )}`,
        `${t("xray_follow_up")}. ${formatReportText(
          result.lifestyle_and_followup_context?.general_lifestyle_considerations,
        )} ${formatReportText(
          result.lifestyle_and_followup_context?.importance_of_followup,
        )}`,
        `${t("xray_questions")}. ${
          result.questions_to_ask_your_doctor?.length
            ? result.questions_to_ask_your_doctor.join(". ")
            : t("xray_no_questions")
        }`,
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  return (
    <section className="analyze-page">
      <section className="analyze-pane analyze-pane-input">
        <header className="analyze-header">
          <h1>{t("xray_title")}</h1>
          <p>{t("xray_subtitle")}</p>
        </header>

        <label className="analyze-label" htmlFor="report-text">
          {t("xray_report_label")}
        </label>
        <textarea
          id="report-text"
          className="analyze-field"
          rows="8"
          placeholder={t("xray_report_placeholder")}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <label className="analyze-label" htmlFor="image-input">
          {t("xray_image_label")}
        </label>
        <input
          id="image-input"
          className="analyze-file"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {preview ? (
          <div className="analyze-preview">
            <img src={preview} alt={t("xray_image_preview_alt")} />
          </div>
        ) : (
          <div className="analyze-placeholder">{t("xray_no_image")}</div>
        )}

        {error && <p className="analyze-error">{error}</p>}

        <button
          className="analyze-btn"
          onClick={analyzeReport}
          disabled={loading}
        >
          {loading ? t("xray_analyzing") : t("xray_analyze")}
        </button>
      </section>

      <section className="analyze-pane analyze-pane-output">
        <header className="analyze-header">
          <h2>{t("xray_output_title")}</h2>
          <p>{t("xray_output_subtitle")}</p>
          <VoiceOutputToggle
            className="analyze-voice-btn"
            text={voiceNarration}
            language={language}
            t={t}
          />
        </header>

        {!result && !loading && (
          <div className="analyze-empty">
            {t("xray_output_empty")}
          </div>
        )}

        {loading && <div className="analyze-empty">{t("xray_output_loading")}</div>}

        {result && (
          <div className="analyze-results">
            <article className="analyze-card analyze-card-wide analyze-card-emergency">
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
                  result.what_this_means_for_you
                    ?.when_to_seek_urgent_care_general,
                )}
              </p>
            </article>

            <article className="analyze-card analyze-card-wide analyze-card-important">
              <h3>{t("xray_report_explanation")}</h3>
              <p className="report-text">
                {formatReportText(
                  result.plain_language_summary?.detailed_explanation,
                )}
              </p>
            </article>

            <article className="analyze-card analyze-card-wide analyze-card-important">
              <h3>{t("xray_what_this_means")}</h3>
              <p className="report-text">
                {formatReportText(
                  result.what_this_means_for_you?.what_patients_often_do_next,
                )}
              </p>
              <p className="report-text">
                {formatReportText(
                  result.what_this_means_for_you?.monitoring_general_advice,
                )}
              </p>
            </article>

            <article className="analyze-card analyze-card-standard">
              <h3>{t("xray_follow_up")}</h3>
              <p className="report-text">
                {formatReportText(
                  result.lifestyle_and_followup_context
                    ?.general_lifestyle_considerations,
                )}
              </p>
              <p className="report-text">
                {formatReportText(
                  result.lifestyle_and_followup_context?.importance_of_followup,
                )}
              </p>
            </article>

            <article className="analyze-card analyze-card-followup">
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

          </div>
        )}
      </section>
    </section>
  );
}

export default XRay;
