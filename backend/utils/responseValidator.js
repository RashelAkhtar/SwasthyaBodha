import { z } from "zod";

const ReportSchema = z.object({
  primary_findings: z.array(z.string()).default([]),
  critical_findings: z.array(z.string()).default([]),
  ambiguity_flags: z.array(z.string()).default([]),
  simplified_summary: z.string().default("No summary available."),
  plain_language_summary: z
    .object({
      short_summary: z.string().default("No short summary available."),
      detailed_explanation: z
        .string()
        .default("No detailed explanation available."),
      body_part_or_system: z.string().default("Not specified."),
      overall_tone: z.string().default("neutral"),
    })
    .default({}),
  key_findings_explained: z
    .array(
      z.object({
        original_term: z.string().default(""),
        what_it_means: z.string().default(""),
        why_it_matters: z.string().default(""),
        common_causes_general: z.string().default(""),
        is_it_usually_urgent: z.string().default("depends_on_context"),
      }),
    )
    .default([]),
  what_this_means_for_you: z
    .object({
      possible_symptoms_related: z.array(z.string()).default([]),
      what_patients_often_do_next: z
        .string()
        .default("Discuss this report with your doctor."),
      monitoring_general_advice: z
        .string()
        .default("Follow your clinician's advice for monitoring."),
      when_to_seek_urgent_care_general: z
        .string()
        .default("Seek urgent care if severe or worsening symptoms occur."),
    })
    .default({}),
  questions_to_ask_your_doctor: z.array(z.string()).default([]),
  lifestyle_and_followup_context: z
    .object({
      general_lifestyle_considerations: z
        .string()
        .default("Follow healthy routines advised by your clinician."),
      importance_of_followup: z
        .string()
        .default("Follow-up helps confirm findings and next steps."),
    })
    .default({}),
  uncertainty_and_limits: z
    .object({
      data_limitations: z
        .string()
        .default("This analysis is limited by available image/text quality."),
      requires_clinical_context: z.boolean().default(true),
    })
    .default({}),
  medical_disclaimer: z
    .string()
    .default(
      "This is educational information and not a medical diagnosis. Please consult a licensed healthcare professional.",
    ),
  language_metadata: z
    .object({
      original_language: z.string().default("unknown"),
      output_language: z.string().default("English"),
      reading_level_estimate: z.string().default("grade_6"),
    })
    .default({}),
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
        output_language: "English",
        reading_level_estimate: "grade_6",
      },
    };
  }
};
