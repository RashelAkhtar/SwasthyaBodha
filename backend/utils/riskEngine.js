// weighted base risk
const severityDictionary = {
  normal: 0.05,
  infection: 0.4,
  pneumonia: 0.5,
  consolidation: 0.5,
  effusion: 0.6,
  embolism: 0.9,
  pneumothorax: 1.0,
  hemorrhage: 1.0,
};

const extractSeverities = (findings) => {
  const scores = [];

  findings.forEach((finding) => {
    const lower = finding.toLowerCase();

    Object.keys(severityDictionary).forEach((key) => {
      if (lower.includes(key)) scores.push(severityDictionary[key]);
    });
  });

  return scores;
};

// Exponential risk saturation function
// Risk = 1 - e^(-k * totalSeverity)
export const computeRisk = (
  primaryFindings,
  criticalFindings,
  ambiguityFlags = [],
) => {
  const allFindings = [...primaryFindings, ...criticalFindings];
  const severities = extractSeverities(allFindings);

  if (severities.length === 0) return 0.1;

  const totalSeverity = severities.reduce((a, b) => a + b, 0);

  const k = 0.8; // growth coefficient
  let risk = 1 - Math.exp(-k * totalSeverity);

  if (criticalFindings.length > 0) return (risk *= 1.15);
  if (severities.length >= 3) risk *= 1.1;
  if (ambiguityFlags.length > 0) risk *= 0.9;

  risk = Math.max(0, Math.min(1, risk));

  return Math.round(risk * 100) / 100;
};

export const mapRiskLevel = (score) => {
  if (score < 0.25) return "low";
  if (score < 0.5) return "moderate";
  if (score < 0.8) return "high";
  return "critical";
};

export const computeConfidence = ({
  ambiguityFlags = [],
  validate = true,
  primaryFindings = [],
  criticalFindings = [],
  riskScore = 0,
}) => {
  let confidence = 0.75; // baseline

  const totalFindings = primaryFindings.length + criticalFindings.length;

  // Ambiguity penalty
  confidence -= 0.08 * ambiguityFlags.length;
  if (ambiguityFlags.includes("image-text mismatch")) confidence -= 0.1;

  if (validate) confidence += 0.05;
  else confidence -= 0.15;

  // High-risk uncertanity penalty
  if (riskScore > 0.75 && ambiguityFlags.length > 0) confidence -= 0.1;
  if (totalFindings === 0) confidence -= 0.1;

  confidence = Math.max(0, Math.min(1, confidence));

  return Math.round(confidence * 100) / 100;
};
