import { useState } from "react";
import axios from "axios";
import "../styles/AnalyzeReport.css";

function AnalyzeReport() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("English");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);

  const interpretReport = async () => {
    if (!text.trim() && !file) {
      setError("Please paste text or upload a report.");
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
      setError("Could not interpret report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="interpret-page">
      <section className="interpret-pane interpret-pane-input">
        <header className="interpret-header">
          <h1>Patient Report Interpreter</h1>
          <p>
            Convert medical document wording into simple, patient-safe
            explanation.
          </p>
        </header>

        <label className="interpret-label" htmlFor="patient-language">
          Output Language
        </label>
        <select
          id="patient-language"
          className="interpret-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="English">English</option>
          <option value="Assamese">Assamese</option>
          <option value="Hindi">Hindi</option>
        </select>

        <label className="interpret-label" htmlFor="medical-report-text">
          Medical Document
        </label>


        <textarea
          id="medical-report-text"
          className="interpret-field"
          rows="12"
          placeholder="Paste radiology report, lab report, discharge note, or prescription text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <label className="field-label">Upload PDF or Image</label>
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
          {loading ? "Interpreting..." : "Interpret Report"}
        </button>
      </section>

      <section className="interpret-pane interpret-pane-output">
        <header className="interpret-header">
          <h2>Interpretation Output</h2>
          <p>Generated from `/interpret` in clear non-technical language.</p>
        </header>

        {!result && !loading && (
          <div className="interpret-empty">
            The patient interpretation result will appear here.
          </div>
        )}

        {loading && (
          <div className="interpret-empty">Generating interpretation...</div>
        )}

        {result && (
          <div className="interpret-results">
            <article className="interpret-card interpret-card-wide">
              <h3>Short Summary</h3>
              <p>{result.plain_language_summary?.short_summary}</p>
            </article>

            <article className="interpret-card interpret-card-wide">
              <h3>Detailed Explanation</h3>
              <p>{result.plain_language_summary?.detailed_explanation}</p>
            </article>

            <article className="interpret-card">
              <h3>Document Type</h3>
              <p>{result.document_type || "unknown"}</p>
            </article>

            <article className="interpret-card">
              <h3>Overall Tone</h3>
              <p>{result.plain_language_summary?.overall_tone || "neutral"}</p>
            </article>

            <article className="interpret-card interpret-card-wide">
              <h3>Key Findings Explained</h3>
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
                <p>No key findings were returned.</p>
              )}
            </article>

            <article className="interpret-card interpret-card-wide">
              <h3>Questions To Ask Your Doctor</h3>
              {result.questions_to_ask_your_doctor?.length ? (
                <ul>
                  {result.questions_to_ask_your_doctor.map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ul>
              ) : (
                <p>No suggested questions were returned.</p>
              )}
            </article>

            <article className="interpret-card interpret-card-wide">
              <h3>Disclaimer</h3>
              <p>{result.medical_disclaimer}</p>
            </article>
          </div>
        )}
      </section>
    </section>
  );
}

export default AnalyzeReport;
