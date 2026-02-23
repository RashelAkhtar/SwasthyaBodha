import { z } from "zod";

const ReportSchema = z.object({
  primary_findings: z.array(z.string()).default([]),
  critical_findings: z.array(z.string()).default([]),
  ambiguity_flags: z.array(z.string()).default([]),
  simplified_summary: z.string().default("No summary available."),
});

export const validateAndSanitize = (data) => {
  try {
    return ReportSchema.parse(data);
  } catch (err) {
    console.error("Validation Error:", err.issues ?? err.errors ?? err);

    return {
      primary_findings: [],
      critical_findings: [],
      ambiguity_flags: [],
      simplified_summary: "Model output could not be validated.",
    };
  }
};
