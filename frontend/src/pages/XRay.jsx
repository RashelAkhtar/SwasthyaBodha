import { useState } from "react";
import axios from "axios";
import "../styles/XRay.css";

function XRay() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("English");
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
      setError("Please provide report text or upload an X-ray image.");
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
      setError("Could not analyze input. Please try again.");
    }

    setLoading(false);
  };

  // const confidencePercent = result
  //   ? Math.round((result.confidence || 0) * 100)
  //   : 0;

  return (
    <section className="analyze-page">
      <section className="analyze-pane analyze-pane-input">
        <header className="analyze-header">
          <h1>Radiology Analysis</h1>
          <p>Submit report text and/or X-ray image for AI risk assessment.</p>
        </header>

        <label className="analyze-label" htmlFor="xray-language">
          Output Language
        </label>
        <select
          id="xray-language"
          className="analyze-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="English">English</option>
          <option value="Assamese">Assamese</option>
          <option value="Hindi">Hindi</option>
        </select>

        <label className="analyze-label" htmlFor="report-text">
          Radiology Report
        </label>
        <textarea
          id="report-text"
          className="analyze-field"
          rows="8"
          placeholder="Paste report text (optional)"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <label className="analyze-label" htmlFor="image-input">
          X-ray Image
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
            <img src={preview} alt="X-ray preview" />
          </div>
        ) : (
          <div className="analyze-placeholder">No image uploaded</div>
        )}

        {error && <p className="analyze-error">{error}</p>}

        <button
          className="analyze-btn"
          onClick={analyzeReport}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </section>

      <section className="analyze-pane analyze-pane-output">
        <header className="analyze-header">
          <h2>Analysis Output</h2>
          <p>Review AI findings and identify urgent conditions.</p>
        </header>

        {!result && !loading && (
          <div className="analyze-empty">
            Results will appear here after you run an analysis.
          </div>
        )}

        {loading && <div className="analyze-empty">Running analysis...</div>}

        {result && (
          <div className="analyze-results">
            <article className="analyze-card analyze-card-wide">
              <h3>Patient Summary</h3>
              <p>{result.simplified_summary}</p>
            </article>

            <article className="analyze-card analyze-card-wide">
              <h3>Detailed Explanation</h3>
              <p>{result.plain_language_summary?.detailed_explanation}</p>
            </article>

            <article className="analyze-card">
              <h3>Primary Findings</h3>
              {result.primary_findings?.length ? (
                <ul>
                  {result.primary_findings.map((finding) => (
                    <li key={finding}>{finding}</li>
                  ))}
                </ul>
              ) : (
                <p>No primary findings reported.</p>
              )}
            </article>

            <article className="analyze-card analyze-card-critical">
              <h3>Critical Alerts</h3>
              {result.critical_findings?.length ? (
                <ul>
                  {result.critical_findings.map((finding) => (
                    <li key={finding}>{finding}</li>
                  ))}
                </ul>
              ) : (
                <p>No critical alerts reported.</p>
              )}
            </article>

            <article className="analyze-card analyze-card-wide">
              <h3>Ambiguity Flags</h3>
              {result.ambiguity_flags?.length ? (
                <ul>
                  {result.ambiguity_flags.map((flag) => (
                    <li key={flag}>{flag}</li>
                  ))}
                </ul>
              ) : (
                <p>No ambiguity flags.</p>
              )}
            </article>

            <article className="analyze-card analyze-card-wide">
              <h3>What This Means For You</h3>
              <p>{result.what_this_means_for_you?.what_patients_often_do_next}</p>
              <p>{result.what_this_means_for_you?.monitoring_general_advice}</p>
              <p>
                <strong>Urgent Care Guidance:</strong>{" "}
                {result.what_this_means_for_you?.when_to_seek_urgent_care_general}
              </p>
            </article>

            <article className="analyze-card">
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

            <article className="analyze-card">
              <h3>Follow-up Context</h3>
              <p>
                {result.lifestyle_and_followup_context
                  ?.general_lifestyle_considerations}
              </p>
              <p>{result.lifestyle_and_followup_context?.importance_of_followup}</p>
            </article>

          </div>
        )}
      </section>
    </section>
  );
}

export default XRay;
