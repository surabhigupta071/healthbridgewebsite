'use server';

/**
 * @fileOverview Enhances user location accuracy based on volunteer responses using generative AI.
 *
 * This file exports:
 * - `enhanceUserLocationAccuracy`: An async function that takes a user's initial location and
 *   volunteer feedback to provide a more accurate location for ride requests.
 * - `EnhanceUserLocationAccuracyInput`: The input type for the enhanceUserLocationAccuracy function.
 * - `EnhanceUserLocationAccuracyOutput`: The output type for the enhanceUserLocationAccuracy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceUserLocationAccuracyInputSchema = z.object({
  initialLocation: z
    .string()
    .describe('The user\u0027s initial location (e.g., GPS coordinates or address).'),
  volunteerFeedback: z
    .string()
    .describe(
      'Feedback from the volunteer about the user\u0027s location (e.g., \u0022near the blue building,\u0022 or \u0022across from the park\u0022).'
    ),
});
export type EnhanceUserLocationAccuracyInput = z.infer<
  typeof EnhanceUserLocationAccuracyInputSchema
>;

const EnhanceUserLocationAccuracyOutputSchema = z.object({
  enhancedLocation: z
    .string()
    .describe('The enhanced and more accurate location of the user.'),
});
export type EnhanceUserLocationAccuracyOutput = z.infer<
  typeof EnhanceUserLocationAccuracyOutputSchema
>;

export async function enhanceUserLocationAccuracy(
  input: EnhanceUserLocationAccuracyInput
): Promise<EnhanceUserLocationAccuracyOutput> {
  return enhanceUserLocationAccuracyFlow(input);
}

const enhanceUserLocationAccuracyPrompt = ai.definePrompt({
  name: 'enhanceUserLocationAccuracyPrompt',
  input: {schema: EnhanceUserLocationAccuracyInputSchema},
  output: {schema: EnhanceUserLocationAccuracyOutputSchema},
  prompt: `You are an AI assistant designed to improve the accuracy of user locations for volunteer ride requests.

Given the user\u0027s initial location and feedback from the volunteer, provide a more accurate and detailed location.

Initial Location: {{{initialLocation}}}
Volunteer Feedback: {{{volunteerFeedback}}}

Enhanced Location:`,
});

const enhanceUserLocationAccuracyFlow = ai.defineFlow(
  {
    name: 'enhanceUserLocationAccuracyFlow',
    inputSchema: EnhanceUserLocationAccuracyInputSchema,
    outputSchema: EnhanceUserLocationAccuracyOutputSchema,
  },
  async input => {
    const {output} = await enhanceUserLocationAccuracyPrompt(input);
    return output!;
  }
);
