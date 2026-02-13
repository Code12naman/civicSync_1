import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Read API key from any supported env variable name to reduce configuration friction.
const GOOGLE_API_KEY_FALLBACK =
  process.env.GOOGLE_GENAI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY;

export const ai = genkit({
  promptDir: './prompts',
  plugins: [
    googleAI({
      // If undefined, the plugin will still try environment defaults; we prefer an explicit fallback.
      apiKey: GOOGLE_API_KEY_FALLBACK,
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});

// Dev-only visibility: warn if API key is missing so users understand fallback behavior.
if (process.env.NODE_ENV !== 'production') {
  // Do not log the key itself; only presence.
  // eslint-disable-next-line no-console
  console.warn(`[GenAI] API key present: ${Boolean(GOOGLE_API_KEY_FALLBACK)}`);
}
