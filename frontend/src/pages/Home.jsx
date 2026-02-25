import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <section className="home-page">
      <div className="home-hero">
        <p className="home-kicker">Radiology Workflow Assistant</p>
        <h1>Fast, structured radiology review with patient-ready output</h1>
        <p>
          Upload X-ray data and report text for risk-focused analysis, then
          generate plain-language interpretation for patient communication.
        </p>

        <div className="home-actions">
          <Link className="home-btn home-btn-primary" to="/xray">
            X-Ray Summary
          </Link>
          <Link className="home-btn home-btn-ghost" to="/reports">
            Report Summary
          </Link>
        </div>
      </div>

      <div className="home-grid">
        <article className="home-card">
          <h3>Structured Findings</h3>
          <p>Risk level, confidence, and findings are grouped for quick triage.</p>
        </article>

        <article className="home-card">
          <h3>Critical Alerting</h3>
          <p>Urgent observations are surfaced first to support rapid escalation.</p>
        </article>

        <article className="home-card">
          <h3>Patient Clarity</h3>
          <p>Medical language is translated into easy-to-understand explanations.</p>
        </article>
      </div>
    </section>
  );
}

export default Home;
