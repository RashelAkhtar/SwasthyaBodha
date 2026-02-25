import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { buildPatientInterpretationPrompt } from "../prompts/patientInterpretationPrompt.js";
import { safeJsonParse } from "../utils/jsonParser.js";
import { validatePatientOutput } from "../utils/patientValidator.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const interpretForPatient = async ({ text, language }) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
  });

  const prompt = buildPatientInterpretationPrompt(text, language);

  try {
    const result = await model.generateContent([{ text: prompt }]);
    const rawText = result.response.text();
    const parsed = safeJsonParse(rawText);

    const validated = validatePatientOutput(parsed);

    return validated;

  } catch (err) {
    console.error("Patient Interpretation Error:", err.message);

    return {
      error: "Failed to generate patient explanation."
    };
  }
};