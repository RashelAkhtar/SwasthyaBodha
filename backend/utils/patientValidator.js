import { z } from "zod";

const PatientSchema = z.object({
  document_type: z.string(),

  plain_language_summary: z.object({
    short_summary: z.string(),
    detailed_explanation: z.string(),
    body_part_or_system: z.string(),
    overall_tone: z.string(),
  }),

  key_findings_explained: z.array(
    z.object({
      original_term: z.string(),
      what_it_means: z.string(),
      why_it_matters: z.string(),
      common_causes_general: z.string(),
      is_it_usually_urgent: z.string(),
    })
  ),

  what_this_means_for_you: z.object({
    possible_symptoms_related: z.array(z.string()),
    what_patients_often_do_next: z.string(),
    monitoring_general_advice: z.string(),
    when_to_seek_urgent_care_general: z.string(),
  }),

  questions_to_ask_your_doctor: z.array(z.string()),

  lifestyle_and_followup_context: z.object({
    general_lifestyle_considerations: z.string(),
    importance_of_followup: z.string(),
  }),

  uncertainty_and_limits: z.object({
    data_limitations: z.string(),
    requires_clinical_context: z.boolean(),
  }),

  medical_disclaimer: z.string(),

  language_metadata: z.object({
    original_language: z.string(),
    output_language: z.string(),
    reading_level_estimate: z.string(),
  }),
});

export const validatePatientOutput = (data) => {
  try {
    return PatientSchema.parse(data);
  } catch (err) {
    console.error("Patient Output Validation Error:", err);
    throw new Error("Invalid patient interpretation structure.");
  }
};