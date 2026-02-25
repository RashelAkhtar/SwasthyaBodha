// Gemini may return JSON wrapped in markdown and occasionally inject stray tokens.

const stripMarkdownFences = (raw) =>
  raw.replace(/```json/gi, "").replace(/```/g, "").trim();

const extractJsonObject = (raw) => {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return raw;
  return raw.slice(start, end + 1);
};

const removeTrailingCommas = (raw) => raw.replace(/,\s*([}\]])/g, "$1");

const removeGarbageLines = (raw) => {
  return raw
    .split(/\r?\n/)
    .filter((line) => {
      const trimmed = line.trim();
      if (!trimmed) return true;
      if (/^[\[\]{}]/.test(trimmed)) return true;
      if (/^,/.test(trimmed)) return true;
      if (/^"/.test(trimmed)) return true;
      return false;
    })
    .join("\n");
};

const tryParse = (candidate) => {
  try {
    return JSON.parse(candidate);
  } catch {
    return null;
  }
};

export const safeJsonParse = (text) => {
  const fenced = stripMarkdownFences(text);
  const extracted = extractJsonObject(fenced);

  const candidates = [
    fenced,
    extracted,
    removeTrailingCommas(extracted),
    removeGarbageLines(extracted),
    removeTrailingCommas(removeGarbageLines(extracted)),
  ];

  for (const candidate of candidates) {
    const parsed = tryParse(candidate);
    if (parsed) return parsed;
  }

  console.error("JSON Parse Error (first 800 chars):", text.slice(0, 800));
  throw new Error("Invalid JSON returned from model");
};
