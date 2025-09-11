'use server';

/**
 * @fileOverview
 * Analyses a health patch img to get health stsatus from color indicatrs.
 * Exports:
 * - analyzePatch: async fn to analyze patch img colors.
 * - AnalyzePatchInput: input type for fn.
 * - AnalyzePatchOutput: output type.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { HealthStatus } from '@/lib/types';
import { gemini15Pro } from '@genkit-ai/googleai';

// Input schema - expects an image data URI string (base64 + mimetype)
const AnalyzePatchInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe("Base64 img string, incl mime type. Ex: 'data:<mimetype>;base64,<data>'"),
});
export type AnalyzePatchInput = z.infer<typeof AnalyzePatchInputSchema>;

// Output schema - colors detected + status + summary of findins
const AnalyzePatchOutputSchema = z.object({
  ph: z.string().describe("pH spot color: 'blue' (norm) or 'yellow' (acidic)"),
  lactate: z.string().describe("Lactate spot color: 'clear' (norm), 'dark blue'/'purple' (high)"),
  temp: z.string().describe("Temp spot: 'blue' (norm) or 'red' (elevated)"),
  status: z.enum(['healthy', 'monitor', 'urgent']).describe("Overall health status"),
  details: z.string().describe("Summary explaning status"),
});
export type AnalyzePatchOutput = z.infer<typeof AnalyzePatchOutputSchema>;

// Main exported fn calling internal flow
export async function analyzePatch(
  input: AnalyzePatchInput
): Promise<AnalyzePatchOutput> {
  return analyzePatchFlow(input);
}

// The AI prompt keeps your original wording exactly as requested:
const analyzePatchPrompt = ai.definePrompt({
  name: 'analyzePatchPrompt',
  model: gemini15Pro,
  input: { schema: AnalyzePatchInputSchema },
  output: { schema: AnalyzePatchOutputSchema },
  prompt: `You are an expert at analyzing medical patches from images. Your task is to identify the colors of three specific spots on the patch.
  
The patch has three indicators:
1.  **pH spot**: Turns from **blue (normal)** to **yellow (acidic)** when tissue is ischemic.
2.  **Lactate spot**: Changes from **clear (normal)** to **dark blue** or **purple** if lactate is elevated, indicating anaerobic metabolism.
3.  **Temperature spot**: Uses thermochromic ink to turn from **blue (normal)** to **red** if there’s a fever or inflammation.

Analyze the provided image and determine the color of each spot. Only return the colors.

Image to analyze: {{media url=imageDataUri}}
`,
});

// Flow def executing prompt and applying busines logic
const analyzePatchFlow = ai.defineFlow(
  {
    name: 'analyzePatchFlow',
    inputSchema: AnalyzePatchInputSchema,
    outputSchema: AnalyzePatchOutputSchema,
  },
  async (input) => {
    const { output } = await analyzePatchPrompt(input);
    if (!output) throw new Error('No AI resp from prompt');

    // unpack AI output colors for each spot
    const { ph, lactate, temp } = output;
    const badInds: string[] = [];
    let status: HealthStatus = 'healthy';

    // collect warnings if abnormal colors found
    if (ph.toLowerCase().includes('yellow')) {
      badInds.push('ph is high (acidic) detected.');
    }
    if (lactate.toLowerCase().includes('dark blue') || lactate.toLowerCase().includes('purple')) {
      badInds.push('lactate high, anaerobic metab indicated.');
    }
    if (temp.toLowerCase().includes('red')) {
      badInds.push('temp high (fever/inflam) found.');
    }

    // determine status. 2+ bad inds = urgent, 1 = monitor
    if (badInds.length >= 2) status = 'urgent';
    else if (badInds.length === 1) status = 'monitor';

    // create summary string for details
    const details = badInds.length > 0 ? `Abnorm inds: ${badInds.join(' ')}` : 'norm all good.';

    // finally return original output + status + details
    return {
      ...output,
      status,
      details,
    };
  }
);



