export const formatReportText = (value) => {
  if (!value) return "";

  return value
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\r\n/g, "\n")
    .trim();
};
