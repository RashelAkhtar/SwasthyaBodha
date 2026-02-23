import { useState } from "react";
import axios from "axios";
import RiskBadge from "../components/RiskBadge";

function Analyze() {
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

      const res = await axios.post(
        "http://localhost:3000/analyze",
        formData,
      );

      setResult(res.data);
    } catch (err) {
      console.error("Error:", err);
      setError("Could not analyze input. Please try again.");
    }

    setLoading(false);
  };

  const confidencePercent = result ? Math.round((result.confidence || 0) * 100) : 0;

  return (
    <section className="analyze-layout">
      <section className="panel">
        <header className="panel-header">
          <h1>Radiology Analysis</h1>
          <p>Submit report text and/or X-ray image for AI risk assessment.</p>
        </header>

        <label className="field-label" htmlFor="report-text">
          Radiology Report
        </label>
        <textarea
          id="report-text"
          className="text-input"
          rows="8"
          placeholder="Paste report text (optional)"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <label className="field-label" htmlFor="image-input">
          X-ray Image
        </label>
        <input
          id="image-input"
          className="file-input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {preview ? (
          <div className="preview-frame">
            <img src={preview} alt="X-ray preview" />
          </div>
        ) : (
          <div className="placeholder-frame">No image uploaded</div>
        )}

        {error && <p className="error-text">{error}</p>}

        <button className="btn btn-primary" onClick={analyzeReport} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </section>

      <section className="panel">
        <header className="panel-header">
          <h2>Analysis Output</h2>
          <p>Review AI findings and identify urgent conditions.</p>
        </header>

        {!result && !loading && (
          <div className="empty-state">
            Results will appear here after you run an analysis.
          </div>
        )}

        {loading && <div className="empty-state">Running analysis...</div>}

        {result && (
          <div className="results-grid">
            <article className="metric-card">
              <p className="metric-label">Risk Level</p>
              <RiskBadge level={result.risk_level} />
            </article>

            <article className="metric-card">
              <p className="metric-label">Confidence</p>
              <div className="confidence-bar">
                <div
                  className="confidence-fill"
                  style={{ width: `${confidencePercent}%` }}
                ></div>
              </div>
              <p className="metric-value">{confidencePercent}%</p>
            </article>

            <article className="result-card full-width">
              <h3>Patient Summary</h3>
              <p>{result.simplified_summary}</p>
            </article>

            <article className="result-card">
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

            <article className="result-card critical">
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

            <article className="result-card full-width">
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
          </div>
        )}
      </section>
    </section>
  );
}

export default Analyze;
