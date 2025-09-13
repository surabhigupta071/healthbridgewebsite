'use server';

/**
 * @fileOverview Analyzes a health patch image to determine health status based on color indicators.
 * This file exports:
 * - analyzePatch: async function taking a patch image and returning health analysis.
 * - Input/output schemas for validation and typing.
 */

import { ai } from '@/ai/genkit'; // AI integration from Genkit
import { z } from 'genkit'; // schema validation lib
import type { HealthStatus } from '@/lib/types';

// Input schema for the AI prompt, expects image as base64 data URI
const AnalyzePatchInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "Photo of health patch as data URI, must include MIME type & base64 data, eg: 'data:<mimetype>;base64,<encoded>'."
    ),
});

export type AnalyzePatchInput = z.infer<typeof AnalyzePatchInputSchema>;

// Output schema describing possible status & details from AI analysis
const AnalyzePatchOutputSchema = z.object({
  ph: z.string().describe("Color of the pH spot: 'blue' (normal) or 'yellow' (acidic)."),
  temp: z.string().describe("Color of temperature spot: 'blue' (normal) or 'red' (elevated)."),
  status: z.enum(['healthy', 'monitor', 'urgent']).describe("Overall health status."),
  details: z.string().describe("User-friendly summary of abnormalities or confirmation all normal."),
});

export type AnalyzePatchOutput = z.infer<typeof AnalyzePatchOutputSchema>;

// Exposed main async function to analyze patch image, delegates to internal flow
export async function analyzePatch(
  input: AnalyzePatchInput
): Promise<AnalyzePatchOutput> {
  return analyzePatchFlow(input);
}

// Defines the AI prompt text and input/output schemas to use with Genkit
const analyzePatchPrompt = ai.definePrompt({
  name: 'analyzePatchPrompt',
  input: { schema: AnalyzePatchInputSchema },
  output: { schema: AnalyzePatchOutputSchema },
  prompt: `You are an expert at analyzing medical patches from images. Your task is to identify colors of two spots and determine health status.

Patch has two indicators:
1. pH spot: blue(normal)→yellow(ischemic)
2. Temperature spot: blue(normal)→red(elevated fever)

- If pH is yellow, status = 'urgent'
- If temperature is red, status = 'monitor'
- If both normal (blue), status = 'healthy'

Provide final status and simple user summary (e.g. 'Elevated temperature detected...').

Image: {{media url=imageDataUri}}
`,
});

// Internal reusable AI flow to send prompt and get parsed output, with a 1 hour cache
const analyzePatchFlow = ai.defineFlow(
  {
    name: 'analyzePatchFlow',
    inputSchema: AnalyzePatchInputSchema,
    outputSchema: AnalyzePatchOutputSchema,
    cache: {
      ttl: 3600, // 1 hour cache
    },
  },
  async (input) => {
    const { output } = await analyzePatchPrompt(input);
    if (!output) {
      throw new Error('Failed to get a response from AI model.');
    }
    return output;
  }
);

