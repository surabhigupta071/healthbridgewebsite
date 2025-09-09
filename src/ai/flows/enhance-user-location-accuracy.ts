'use server';

/*
 * file: improves user location using volunteer input + gen ai
 * 
 * exports:
 * - enhanceUserLocationAccuracy: main async fn, takes user loc + volunteer notes, hopefully makes loc better
 * - EnhanceUserLocationAccuracyInput: type for input params
 * - EnhanceUserLocationAccuracyOutput: type for output (should be better loc)
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// schema for what u start with - raw location + what the volunteer says ('across from 7-eleven etc')
const EnhanceUserLocationAccuracyInputSchema = z.object({
  initialLocation: z
    .string()
    .describe('User location originally (could be GPS or just an address—sometimes really vague tbh)'),
  volunteerFeedback: z
    .string()
    .describe(
      'Volunteer’s feedback about where the user is ("by bus stop" or "close to the park," you get the idea)'
    ),
});
export type EnhanceUserLocationAccuracyInput = z.infer<
  typeof EnhanceUserLocationAccuracyInputSchema
>;

// output just has the new/better location string, ai is supposed to fix it up
const EnhanceUserLocationAccuracyOutputSchema = z.object({
  enhancedLocation: z
    .string()
    .describe('Supposedly more accurate location for the user. try to make it specific lol'),
});
export type EnhanceUserLocationAccuracyOutput = z.infer<
  typeof EnhanceUserLocationAccuracyOutputSchema
>;

// main logic here - runs the flow below with your input, returns output (shouldn’t break but who knows)
export async function enhanceUserLocationAccuracy(
  input: EnhanceUserLocationAccuracyInput
): Promise<EnhanceUserLocationAccuracyOutput> {
  return enhanceUserLocationAccuracyFlow(input); // dunno, just calls the next thing
}

// ai prompt - tells ai to mash up user’s location and what the volunteer said to make a smarter answer
const enhanceUserLocationAccuracyPrompt = ai.definePrompt({
  name: 'enhanceUserLocationAccuracyPrompt',
  input: {schema: EnhanceUserLocationAccuracyInputSchema},
  output: {schema: EnhanceUserLocationAccuracyOutputSchema},
  prompt: `You are an AI assistant designed to improve the accuracy of user locations for volunteer ride requests.

Given the user's first location info and the volunteer's feedback, give a wayyy more accurate address or place.

Initial Location: {{{initialLocation}}}
Volunteer Feedback: {{{volunteerFeedback}}}

Enhanced Location:`, // fill this out good pls!
});

// main flow fn - runs prompt above and spits out "enhancedLocation" string
const enhanceUserLocationAccuracyFlow = ai.defineFlow(
  {
    name: 'enhanceUserLocationAccuracyFlow',
    inputSchema: EnhanceUserLocationAccuracyInputSchema,
    outputSchema: EnhanceUserLocationAccuracyOutputSchema,
  },
  async input => {
    // runs the ai thing, hopefully gives a better spot
    const {output} = await enhanceUserLocationAccuracyPrompt(input);
    return output!; // trust the process ig
  }
);

// can add more stuff later if needed (idk)
