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
  const [file, setFile] = useState(null);

  const interpretReport = async () => {
    if (!text.trim() && !file) {
      setError(t("reports_input_error"));
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();

      if (file) {
        formData.append("file", file);
      } else {
        formData.append("text", text);
      }

      formData.append("language", language);

      const res = await axios.post(
        "http://localhost:3000/interpret",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      setResult(res.data);
    } catch (err) {
      console.error("Interpretation error:", err);
      setError(t("reports_request_error"));
    } finally {
      setLoading(false);
    }
  };

  const voiceNarration = result
    ? [
        `${t("reports_emergency_title")}. ${t("reports_urgent_care")} ${formatReportText(
          result.what_this_means_for_you?.when_to_seek_urgent_care_general,
        )}`,
        `${t("reports_report_explanation")}. ${formatReportText(
          result.plain_language_summary?.detailed_explanation,
        )}`,
        `${t("reports_key_findings")}. ${
          result.key_findings_explained?.length
            ? result.key_findings_explained
                .map((finding) => `${finding.original_term}: ${finding.what_it_means}`)
                .join(". ")
            : t("reports_no_findings")
        }`,
        `${t("reports_what_this_means")}. ${formatReportText(
          result.what_this_means_for_you?.what_patients_often_do_next,
        )} ${formatReportText(
          result.what_this_means_for_you?.monitoring_general_advice,
        )}`,
        `${t("reports_follow_up")}. ${formatReportText(
          result.lifestyle_and_followup_context?.general_lifestyle_considerations,
        )} ${formatReportText(
          result.lifestyle_and_followup_context?.importance_of_followup,
        )}`,
        `${t("reports_questions")}. ${
          result.questions_to_ask_your_doctor?.length
            ? result.questions_to_ask_your_doctor.join(". ")
            : t("reports_no_questions")
        }`,
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  return (
    <section className="interpret-page">
      <section className="interpret-pane interpret-pane-input">
        <header className="interpret-header">
          <h1>{t("reports_title")}</h1>
          <p>{t("reports_subtitle")}</p>
        </header>

        <label className="interpret-label" htmlFor="medical-report-text">
          {t("reports_document_label")}
        </label>

        <textarea
          id="medical-report-text"
          className="interpret-field"
          rows="12"
          placeholder={t("reports_document_placeholder")}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <label className="field-label">{t("reports_upload_label")}</label>
        <input
          type="file"
          accept=".pdf,image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {error && <p className="interpret-error">{error}</p>}

        <button
          className="interpret-btn"
          onClick={interpretReport}
          disabled={loading}
        >
          {loading ? t("reports_interpreting") : t("reports_interpret")}
        </button>
      </section>

      <section className="interpret-pane interpret-pane-output">
        <header className="interpret-header">
          <h2>{t("reports_output_title")}</h2>
          <VoiceOutputToggle
            className="interpret-voice-btn"
            text={voiceNarration}
            language={language}
            t={t}
          />
        </header>

        {!result && !loading && (
          <div className="interpret-empty">
            {t("reports_output_empty")}
          </div>
        )}

        {loading && (
          <div className="interpret-empty">{t("reports_output_loading")}</div>
        )}

        {result && (
          <div className="interpret-results">
            <article className="interpret-card interpret-card-wide interpret-card-emergency">
              <h3>{t("reports_emergency_title")}</h3>
              <p className="report-text">
                <strong>{t("reports_urgent_care")}</strong>{" "}
                {formatReportText(
                  result.what_this_means_for_you
                    ?.when_to_seek_urgent_care_general,
                )}
              </p>
            </article>

            <article className="interpret-card interpret-card-wide interpret-card-important">
              <h3>{t("reports_report_explanation")}</h3>
              <p className="report-text">
                {formatReportText(
                  result.plain_language_summary?.detailed_explanation,
                )}
              </p>
            </article>

            <article className="interpret-card interpret-card-wide interpret-card-standard">
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

            <article className="interpret-card interpret-card-important">
              <h3>{t("reports_what_this_means")}</h3>
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

            <article className="interpret-card interpret-card-followup">
              <h3>{t("reports_follow_up")}</h3>
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

            <article className="interpret-card interpret-card-wide interpret-card-followup">
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
          </div>
        )}
      </section>
    </section>
  );
}

export default Reports;
