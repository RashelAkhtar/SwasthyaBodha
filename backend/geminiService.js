import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

import { buildMultimodalPrompt } from "./prompts/multimodalPrompt.js";
import { safeJsonParse } from "./utils/jsonParser.js";
import { validateAndSanitize } from "./utils/responseValidator.js";
import {
  computeConfidence,
  mapRiskLevel,
  computeRisk,
} from "./utils/riskEngine.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeReport = async ({ text, image }) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = buildMultimodalPrompt(text);

  const inputParts = [prompt];

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
    const parsed = safeJsonParse(rawText);
    const validated = validateAndSanitize(parsed);

    const risk_score = computeRisk(
      validated.primary_findings,
      validated.critical_findings,
    );

    const risk_level = mapRiskLevel(risk_score);

    const confidence = computeConfidence({
      ambiguityFlags: validated.ambiguity_flags,
      validated: true,
      primaryFindings: validated.primary_findings,
      criticalFindings: validated.critical_findings,
      riskScore: risk_score,
    });

    return {
      primary_findings: validated.primary_findings,
      critical_findings: validated.critical_findings,
      simplified_summary: validated.simplified_summary,
      ambiguity_flags: validated.ambiguity_flags,
      risk_score,
      risk_level,
      confidence,
    };
  } catch (err) {
    console.error("Gemini Failure:", err.message);

    return {
      primary_findings: [],
      critical_findings: [],
      ambiguity_flags: [],
      simplified_summary: "AI analysis failed.",
      risk_score: 0,
      risk_level: "low",
      confidence: 0,
    };
  }
};
