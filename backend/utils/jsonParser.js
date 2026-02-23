// Gemini sometimes wraps JSON in markdown. This handles that.

export const safeJsonParse = (text) => {
  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("JSON Parse Error:", text);
    throw new Error("Invalid JSON returned from model");
  }
};
