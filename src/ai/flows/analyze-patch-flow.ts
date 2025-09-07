'use server';

/**
 * @fileOverview Analyzes a health patch image to determine health status based on color indicators.
 *
 * This file exports:
 * - `analyzePatch`: An async function that takes an image of a health patch and returns an analysis
 *   of its color indicators.
 * - `AnalyzePatchInput`: The input type for the analyzePatch function.
 * - `AnalyzePatchOutput`: The output type for the analyzePatch function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { HealthStatus } from '@/lib/types';

const AnalyzePatchInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of the health patch, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzePatchInput = z.infer<typeof AnalyzePatchInputSchema>;

const AnalyzePatchOutputSchema = z.object({
  ph: z.string().describe("Detected color of the pH spot. Can be 'blue' (normal) or 'yellow' (acidic)."),
  lactate: z.string().describe("Detected color of the lactate spot. Can be 'clear' (normal) or 'dark blue'/'purple' (elevated)."),
  temp: z.string().describe("Detected color of the temperature spot. Can be 'blue' (normal) or 'red' (elevated)."),
  status: z.enum(['healthy', 'monitor', 'urgent']).describe("The overall health status based on the indicators."),
  details: z.string().describe("A summary of the analysis and the reasons for the determined status."),
});
export type AnalyzePatchOutput = z.infer<typeof AnalyzePatchOutputSchema>;


export async function analyzePatch(
  input: AnalyzePatchInput
): Promise<AnalyzePatchOutput> {
  return analyzePatchFlow(input);
}

const analyzePatchPrompt = ai.definePrompt({
  name: 'analyzePatchPrompt',
  input: { schema: AnalyzePatchInputSchema },
  output: { schema: AnalyzePatchOutputSchema },
  prompt: `You are an expert at analyzing medical patches from images. Your task is to identify the colors of three specific spots on the patch and determine the overall health status.

The patch has three indicators:
1.  **pH spot**: Turns from **blue (normal)** to **yellow (acidic)** when tissue is ischemic.
2.  **Lactate spot**: Changes from **clear (normal)** to **dark blue** or **purple** if lactate is elevated, indicating anaerobic metabolism.
3.  **Temperature spot**: Uses thermochromic ink to turn from **blue (normal)** to **red** if there’s a fever or inflammation.

Analyze the provided image and determine the color of each spot.

- If pH is yellow, lactate is dark blue/purple, or temp is red, the status is **'urgent'**.
- If one or more indicators are borderline but not fully in the urgent range, the status is **'monitor'**.
- If all indicators are normal (pH: blue, lactate: clear, temp: blue), the status is **'healthy'**.

Based on your color analysis, determine the final status and provide a detailed explanation in the 'details' field.

Image to analyze: {{media url=imageDataUri}}
`,
});

const analyzePatchFlow = ai.defineFlow(
  {
    name: 'analyzePatchFlow',
    inputSchema: AnalyzePatchInputSchema,
    outputSchema: AnalyzePatchOutputSchema,
  },
  async (input) => {
    const { output } = await analyzePatchPrompt(input);
    if (!output) {
      throw new Error('Failed to get a response from the AI model.');
    }

    // Determine status and details based on the AI's color analysis
    const { ph, lactate, temp } = output;
    const badIndicators: string[] = [];
    let status: HealthStatus = 'healthy';

    if (ph && ph.toLowerCase().includes('yellow')) {
      badIndicators.push('High pH (acidic) detected.');
    }
    if (lactate && (lactate.toLowerCase().includes('dark blue') || lactate.toLowerCase().includes('purple'))) {
      badIndicators.push('High lactate (anaerobic metabolism) indicated.');
    }
    if (temp && temp.toLowerCase().includes('red')) {
      badIndicators.push('High temperature (fever/inflammation) indicated.');
    }

    let details = '';
    if (badIndicators.length > 0) {
      status = 'urgent';
      details = 'Urgent indicators detected: ' + badIndicators.join(' ');
    } else {
        // This part can be enhanced if the model provides borderline colors
        status = 'healthy';
        details = 'All indicators are normal.';
    }

    // We can use the AI's generated details, or construct our own like above.
    // Let's stick with the constructed one for consistency.
    return {
        ...output,
        status,
        details,
    };
  }
);
