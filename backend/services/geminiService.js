import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

import { buildMultimodalPrompt } from "../prompts/multimodalPrompt.js";
import { safeJsonParse } from "../utils/jsonParser.js";
import { validateAndSanitize } from "../utils/responseValidator.js";
import {
  computeConfidence,
  mapRiskLevel,
  computeRisk,
} from "../utils/riskEngine.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeReport = async ({ text, image, language = "English" }) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
  });

  const prompt = buildMultimodalPrompt(text, language);

  const inputParts = [{ text: prompt}];

  if (text) inputParts.push({ text });
  if (image) {
    const base64Image = image.buffer.toString("base64");
    inputParts.push({
      inlineData: {
        data: base64Image,
        mimeType: image.mimetype,
      },
    });
  }

  try {
    const result = await model.generateContent(inputParts);
    const rawText = result.response.text();
    let parsed = null;
    let jsonValid = false;

    try {
      parsed = safeJsonParse(rawText);
      jsonValid = !!parsed;
    } catch (parseErr) {
      console.error("Gemini JSON parse fallback:", parseErr.message);
    }

    const validated = jsonValid
      ? validateAndSanitize(parsed)
      : validateAndSanitize({});

    const risk_score = computeRisk(
      validated.primary_findings,
      validated.critical_findings,
      validated.ambiguity_flags
    );

    const risk_level = mapRiskLevel(risk_score);

    const confidence = computeConfidence({
      ambiguityFlags: validated.ambiguity_flags,
      validated: jsonValid,
      primaryFindings: validated.primary_findings,
      criticalFindings: validated.critical_findings,
      riskScore: risk_score,
    });

    return {
      primary_findings: validated.primary_findings,
      critical_findings: validated.critical_findings,
      simplified_summary: validated.simplified_summary,
      ambiguity_flags: validated.ambiguity_flags,
      plain_language_summary: validated.plain_language_summary,
      key_findings_explained: validated.key_findings_explained,
      what_this_means_for_you: validated.what_this_means_for_you,
      questions_to_ask_your_doctor: validated.questions_to_ask_your_doctor,
      lifestyle_and_followup_context: validated.lifestyle_and_followup_context,
      uncertainty_and_limits: validated.uncertainty_and_limits,
      medical_disclaimer: validated.medical_disclaimer,
      language_metadata: validated.language_metadata,
      risk_score,
      risk_level,
      confidence,
    };
  } catch (err) {
    console.error("Gemini Failure:", err.message);

    return {
      primary_findings: [],
      critical_findings: [],
      ambiguity_flags: ["model invocation failure"],
      simplified_summary: "AI analysis failed.",
      plain_language_summary: {
        short_summary: "No short summary available.",
        detailed_explanation: "No detailed explanation available.",
        body_part_or_system: "Not specified.",
        overall_tone: "neutral",
      },
      key_findings_explained: [],
      what_this_means_for_you: {
        possible_symptoms_related: [],
        what_patients_often_do_next: "Discuss this report with your doctor.",
        monitoring_general_advice:
          "Follow your clinician's advice for monitoring.",
        when_to_seek_urgent_care_general:
          "Seek urgent care if severe or worsening symptoms occur.",
      },
      questions_to_ask_your_doctor: [],
      lifestyle_and_followup_context: {
        general_lifestyle_considerations:
          "Follow healthy routines advised by your clinician.",
        importance_of_followup:
          "Follow-up helps confirm findings and next steps.",
      },
      uncertainty_and_limits: {
        data_limitations:
          "This analysis is limited by available image/text quality.",
        requires_clinical_context: true,
      },
      medical_disclaimer:
        "This is educational information and not a medical diagnosis. Please consult a licensed healthcare professional.",
      language_metadata: {
        original_language: "unknown",
        output_language: language,
        reading_level_estimate: "grade_6",
      },
      risk_score: 0,
      risk_level: "low",
      confidence: 0,
    };
  }
};
