export const computeRisk = (findings, criticalFindings) => {
  const severityDictionary = {
    normal: 0.1,
    infection: 0.4,
    pneumonia: 0.5,
    consolidation: 0.5,
    effusion: 0.6,
    embolism: 0.9,
    pneumothorax: 1.0,
    hemorrhage: 1.0,
  };

  let maxScore = 0;

  const allFindings = [...findings, ...criticalFindings];

  allFindings.forEach((finding) => {
    const lower = finding.toLowerCase();
    Object.keys(severityDictionary).forEach((key) => {
        if (lower.includes(key)) 
            maxScore = Math.max(maxScore, severityDictionary[key]);
    })
  })

  if (criticalFindings.length > 0)
    maxScore = Math.max(maxScore, 0.9)

  return Math.round((maxScore || 0.1) * 100) / 100;
};


export const mapRiskLevel = (score) => {
    if (score < 0.3) return "low"
    if (score < 0.6) return "moderate"
    if (score < 0.85) return "high"
    return "critical"
}


/*
    confidence = 0.7 − 0.2(ambiguity) + 0.1(structure)

 Where:
    ambiguity = 1 if ambiguity_flags exist else 0
    structure = 1 if JSON validated
*/
export const computeConfidence = (ambiguityFlags, validated = true) => {
    let confidence = 0.7;
    
    if (ambiguityFlags.length > 0) confidence -= 0.2
    if (validated) confidence += 0.1

    const result = Math.max(0, Math.min(1, confidence))

    return Math.round(result * 100) / 100;
}
