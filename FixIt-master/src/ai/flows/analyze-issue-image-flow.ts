// This module is intended to run on the server only.
// Do NOT import its exported functions in client components as values.
/**
 * @fileOverview AI flow for analyzing civic issue images and suggesting details.
 *
 * - analyzeIssueImage - A function that analyzes an image and description of a potential civic issue.
 * - AnalyzeIssueImageInput - The input type for the analyzeIssueImage function.
 * - AnalyzeIssueImageOutput - The return type for the analyzeIssueImage function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
// No direct dependency on app Issue types in this file; we normalize below.

// Use literal tuples compatible with Zod enum and still align with IssueType/IssuePriority domain
const ISSUE_TYPES = ["Road", "Garbage", "Streetlight", "Park", "Other"] as const;
const ISSUE_PRIORITIES = ["Low", "Medium", "High"] as const;

const AnalyzeIssueImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a potential civic issue, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
   description: z.string().optional().describe("Optional user-provided description of the issue to provide context for priority assessment."),
});
export type AnalyzeIssueImageInput = z.infer<typeof AnalyzeIssueImageInputSchema>;

const AnalyzeIssueImageOutputSchema = z.object({
  detectedType: z.enum(ISSUE_TYPES).describe('The most likely type of civic issue detected in the image (Road, Garbage, Streetlight, Park, Other).'),
  suggestedTitle: z.string().describe('A concise, suggested title for the issue report based on the image and description (max 50 characters).'),
  suggestedDescription: z.string().describe('A detailed suggested description (target 200–400 characters) based only on visible cues and optional user context; keep objective and actionable within the form\'s 500-character limit.'),
  suggestedPriority: z.enum(ISSUE_PRIORITIES).describe('The suggested priority level (Low, Medium, High) based on the visual severity and description context.'),
});
export type AnalyzeIssueImageOutput = z.infer<typeof AnalyzeIssueImageOutputSchema>;

export async function analyzeIssueImage(input: AnalyzeIssueImageInput): Promise<AnalyzeIssueImageOutput> {
  return analyzeIssueImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeIssueImagePrompt',
  input: {
    schema: AnalyzeIssueImageInputSchema,
  },
  output: {
    schema: AnalyzeIssueImageOutputSchema,
  },
  prompt: `Analyze the provided image and optional description of a potential civic issue.

Follow these rules strictly — use only what\'s visible in the image and the optional text; do not invent details:
1. Category: choose one of ${ISSUE_TYPES.join(', ')}.
2. Title: concise (max 50 characters).
3. Description: provide a detailed summary (target 200–400 characters, max 500) that clearly states:
   - What the issue appears to be (objective observation),
   - Apparent severity/risks (e.g., safety hazard, obstruction, sanitation),
   - Likely impact on citizens (traffic flow, hygiene, access, visibility),
   - A short, actionable recommendation (e.g., barricade area, schedule repair, increase collection).
   Keep language factual and avoid speculation beyond the image.
4. Priority: one of ${ISSUE_PRIORITIES.join(', ')} based on visible severity.

Image: {{media url=imageDataUri}}
{{#if description}}Description Context: {{{description}}}{{/if}}`,
});

const analyzeIssueImageFlow = ai.defineFlow<
  typeof AnalyzeIssueImageInputSchema,
  typeof AnalyzeIssueImageOutputSchema
>(
  {
    name: 'analyzeIssueImageFlow',
    inputSchema: AnalyzeIssueImageInputSchema,
    outputSchema: AnalyzeIssueImageOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output) throw new Error('AI analysis failed to produce an output.');
      return output;
    } catch (err: any) {
      const msg = String(err?.message || err);

      // Handle quota/rate limit errors with a short retry, then fallback.
      const isQuota =
        msg.includes('Too Many Requests') ||
        msg.includes('Quota exceeded') ||
        msg.includes('429');
      if (isQuota) {
        // Parse suggested retry delay if present, cap to 2s for dev.
        const m = msg.match(/retry in ([0-9.]+)s/i);
        const retryMs = Math.min(2000, m ? Math.round(parseFloat(m[1]) * 1000) : 1000);
        console.warn(`Rate limited by Gemini API. Retrying once after ${retryMs}ms...`);
        await new Promise(res => setTimeout(res, retryMs));
        try {
          const {output} = await prompt(input);
          if (!output) throw new Error('AI analysis failed to produce an output after retry.');
          return output;
        } catch (retryErr) {
          console.warn('Retry failed; returning safe fallback analysis.');
          return {
            detectedType: 'Other',
            suggestedTitle: 'Issue Report',
            suggestedDescription:
              'Preliminary report created. Add details and photos to improve analysis.',
            suggestedPriority: 'Medium',
          };
        }
      }

      // Graceful fallback when API key is missing or service is unavailable.
      if (
        msg.includes('FAILED_PRECONDITION') ||
        msg.includes('API key') ||
        msg.includes('Please pass in the API key')
      ) {
        console.warn('GenAI key missing or unavailable. Returning safe fallback analysis.');
        return {
          detectedType: 'Other',
          suggestedTitle: 'Issue Report',
          suggestedDescription:
            'Preliminary report created automatically. The photo appears to show a civic maintenance issue requiring inspection. Please add specifics such as exact location, size/severity, any safety risks (e.g., sharp edges, trip or vehicle hazard), and how it affects traffic, hygiene, or visibility so authorities can prioritize an appropriate response.',
          suggestedPriority: 'Medium',
        };
      }

      // Re-throw unexpected errors for visibility.
      throw err;
    }
  }
);

// Strict JSON output required by the form auto-fill system
const STRICT_ISSUE_TYPES = [
  "Road Damage",
  "Garbage",
  "Water Logging",
  "Street Light Issue",
  "Drainage Problem",
  "Traffic Signal Issue",
  "Public Property Damage",
  "Other",
] as const;
type StrictIssueType = typeof STRICT_ISSUE_TYPES[number];
type StrictPriority = typeof ISSUE_PRIORITIES[number];

export type AnalyzeIssueImageStrictOutput = {
  issueType: StrictIssueType;
  priority: StrictPriority;
  title: string;
  description: string;
};

function mapDetectedTypeToStrict(type: AnalyzeIssueImageOutput["detectedType"]): StrictIssueType {
  switch (type) {
    case "Road":
      return "Road Damage";
    case "Garbage":
      return "Garbage";
    case "Streetlight":
      return "Street Light Issue";
    case "Park":
      // Treat park-related structural issues as public property domain
      return "Public Property Damage";
    default:
      return "Other";
  }
}

function clampTitleWords(title: string, maxWords = 10): string {
  const words = title.trim().split(/\s+/);
  if (words.length <= maxWords) return title.trim();
  return words.slice(0, maxWords).join(' ');
}

/**
 * Wrapper that returns strict JSON fields for the report form without breaking existing consumers.
 */
export async function analyzeIssueImageStrict(input: AnalyzeIssueImageInput): Promise<AnalyzeIssueImageStrictOutput> {
  try {
    const result = await analyzeIssueImageFlow(input);
    return {
      issueType: mapDetectedTypeToStrict(result.detectedType),
      priority: result.suggestedPriority,
      title: clampTitleWords(result.suggestedTitle || 'Issue Report'),
      description: (result.suggestedDescription || 'Preliminary report created. Add details and photos to improve analysis.').trim(),
    };
  } catch {
    return {
      issueType: 'Other',
      priority: 'Low',
      title: 'Incorrect submission; resubmission requested',
      description:
        'The submission does not clearly depict a civic infrastructure issue. No safety risk or obstruction is evident. Please resubmit with a clear photograph of the specific problem and location context so inspection and corrective action can proceed.',
    };
  }
}

// -----------------------------
// Form Auto-Fill Flow (Dedicated)
// -----------------------------

// Domain expected by the UI for auto-fill
const FORM_ISSUE_TYPES = [
  "pothole",
  "garbage",
  "streetlight",
  "water leakage",
  "road damage",
  "other",
] as const;
type FormIssueType = typeof FORM_ISSUE_TYPES[number];

const AnalyzeIssueImageFormFieldsOutputSchema = z.object({
  issueType: z.enum(FORM_ISSUE_TYPES),
  priority: z.enum(ISSUE_PRIORITIES),
  title: z.string().min(6).max(50), // enforce non-empty/min length
  description: z.string().min(20).max(500), // enforce non-empty/min length
});
export type AnalyzeIssueImageFormFieldsOutput = z.infer<
  typeof AnalyzeIssueImageFormFieldsOutputSchema
>;

const autofillPrompt = ai.definePrompt({
  name: 'autofillIssueFormPrompt',
  input: { schema: AnalyzeIssueImageInputSchema },
  output: { schema: AnalyzeIssueImageFormFieldsOutputSchema },
  prompt: `You are an AI assistant for FixIt, a civic issue reporting app.
Your job is to analyze an uploaded image of a civic issue and automatically fill issue reporting form fields.

IMPORTANT RULES:
- Never return empty strings.
- Never omit any field.
- If unsure, choose a reasonable default.
- Do NOT use placeholders like "", "unknown", or null.

Be concise, practical, and realistic. If something cannot be confidently determined, choose a safe default.

Analyze the uploaded image of a civic issue.
Based ONLY on what is clearly visible in the image:
1. Identify the issue type.
2. Decide priority (Low, Medium, High).
3. Generate a short, clear title.
4. Write a brief description suitable for government authorities.

Priority rules:
- High → dangerous or urgent (accidents, open manholes, fallen poles)
- Medium → inconvenience but not dangerous (garbage, potholes, broken lights)
- Low → minor or cosmetic issues

Respond ONLY in valid JSON using this format:
{
  "issueType": "pothole | garbage | streetlight | water leakage | road damage | other",
  "priority": "Low | Medium | High",
  "title": "short clear title (minimum 3 words)",
  "description": "2–3 sentences describing what is visible in the image"
}

Image: {{media url=imageDataUri}}
{{#if description}}User notes: {{{description}}}{{/if}}`,
});

const analyzeIssueImageFormFieldsFlow = ai.defineFlow<
  typeof AnalyzeIssueImageInputSchema,
  typeof AnalyzeIssueImageFormFieldsOutputSchema
>({
  name: 'analyzeIssueImageFormFieldsFlow',
  inputSchema: AnalyzeIssueImageInputSchema,
  outputSchema: AnalyzeIssueImageFormFieldsOutputSchema,
}, async input => {
  try {
    const { output } = await autofillPrompt(input);
    if (!output) throw new Error('AI analysis failed to produce form fields.');
    return output;
  } catch (err: any) {
    const msg = String(err?.message || err);
    // Graceful fallback ONLY on hard failures
    if (
      msg.includes('FAILED_PRECONDITION') ||
      msg.includes('API key') ||
      msg.includes('Please pass in the API key') ||
      msg.includes('Too Many Requests') ||
      msg.includes('Quota exceeded') ||
      msg.includes('429')
    ) {
      return {
        issueType: 'other',
        priority: 'Medium',
        title: 'Issue report',
        description:
          'A civic issue is reported with limited detail. Please review the image and add specifics such as exact location and severity to prioritize action.',
      };
    }
    throw err;
  }
});

export async function analyzeIssueImageFormFields(
  input: AnalyzeIssueImageInput,
): Promise<AnalyzeIssueImageFormFieldsOutput> {
  return analyzeIssueImageFormFieldsFlow(input);
}

