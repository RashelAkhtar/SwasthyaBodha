import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="home-layout">
      <div className="hero-card">
        <p className="eyebrow">Radiology Workflow Assistant</p>
        <h1>Clean, structured chest X-ray risk analysis in seconds</h1>
        <p className="hero-copy">
          Upload an X-ray image, report text, or both. MedAI extracts key
          findings, highlights critical alerts, and generates a patient-friendly
          summary for faster clinical review.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/analyze">
            Start Analysis
          </Link>
        </div>
      </div>

      <div className="info-grid">
        <article className="info-card">
          <h3>Structured Findings</h3>
          <p>
            Primary findings, ambiguity flags, and risk level are grouped for
            quick triage.
          </p>
        </article>
        <article className="info-card">
          <h3>Clinical Prioritization</h3>
          <p>
            Critical findings are surfaced first so urgent cases can be
            escalated rapidly.
          </p>
        </article>
        <article className="info-card">
          <h3>Patient-Friendly Summary</h3>
          <p>
            Complex radiology language is translated into short, understandable
            text.
          </p>
        </article>
      </div>
    </section>
  );
}

export default Home;
