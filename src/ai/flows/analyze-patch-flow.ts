'use server';

// main file for health patch checker -- basically runs the logic for "is this patch showing wack health stuff?"

/**
 * @fileOverview does patch img analysis & spits out if stuff is urgent or not
 *
 * this file exports:
 * - `analyzePatch`: async function, puts image in, gets result out (kinda magic)
 * - `AnalyzePatchInput`: basically the shape for what analyzePatch eats
 * - `AnalyzePatchOutput`: shape for what comes out of analyzePatch
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { HealthStatus } from '@/lib/types';

// Schema for what pic comes in -- gotta be a data uri, base64, all that jazz (see docs if confused tbh)
const AnalyzePatchInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of the health patch, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzePatchInput = z.infer<typeof AnalyzePatchInputSchema>;

// Output tells us color for each spot + summary status. comments explain what we're lookin' for
const AnalyzePatchOutputSchema = z.object({
  ph: z.string().describe("Detected color of the pH spot. Can be 'blue' (normal) or 'yellow' (acidic)."),
  lactate: z.string().describe("Detected color of the lactate spot. Can be 'clear' (normal) or 'dark blue'/'purple' (elevated)."),
  temp: z.string().describe("Detected color of the temperature spot. Can be 'blue' (normal) or 'red' (elevated)."),
  status: z.enum(['healthy', 'monitor', 'urgent']).describe("The overall health status based on the indicators."),
  details: z.string().describe("A summary of the analysis and the reasons for the determined status."),
});
export type AnalyzePatchOutput = z.infer<typeof AnalyzePatchOutputSchema>;

// ok this is the main function - give it patch data, it runs the flow and gives u an answer (no side effects I think)
export async function analyzePatch(
  input: AnalyzePatchInput
): Promise<AnalyzePatchOutput> {
  return analyzePatchFlow(input); // just calls below, nothing too wild
}

// defines the prompt -- this is what we tell the AI to do, pretty literal
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

// this is the actual "flow" that uses the prompt + puts together a final answer for the UI
const analyzePatchFlow = ai.defineFlow(
  {
    name: 'analyzePatchFlow',
    inputSchema: AnalyzePatchInputSchema,
    outputSchema: AnalyzePatchOutputSchema,
  },
  async (input) => {
    // ask the ai, fingers crossed it works
    const { output } = await analyzePatchPrompt(input);
    if (!output) {
      // uhhh something broke :/ panic
      throw new Error('Failed to get a response from the AI model.');
    }

    // basic logic -- look for urgent signs and build up our list of probs
    const { ph, lactate, temp } = output;
    const badIndicators: string[] = [];
    let status: HealthStatus = 'healthy';

    // check phrases, not case sensitive (doing it the lazy way for now)
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
      // yeah it's bad news
      status = 'urgent';
      details = 'Urgent indicators detected: ' + badIndicators.join(' ');
    } else {
        // TODO: could handle monitor/borderline better but whatever for now
        status = 'healthy';
        details = 'All indicators are normal.';
    }

    // note: could use AI's details but sticking with ours for now (maybe change later)
    return {
        ...output,
        status,
        details,
    };
  }
);


