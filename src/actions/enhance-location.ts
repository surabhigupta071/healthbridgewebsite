"use server";

import { enhanceUserLocationAccuracy } from "@/ai/flows/enhance-user-location-accuracy";
import { z } from "zod";

const schema = z.object({
  initialLocation: z.string(),
  volunteerFeedback: z.string().min(1, 'Feedback cannot be empty.'),
});

type State = {
  message: string;
  enhancedLocation?: string;
  errors?: {
    volunteerFeedback?: string[];
  }
};

export async function getEnhancedLocation(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = schema.safeParse({
    initialLocation: formData.get('initialLocation'),
    volunteerFeedback: formData.get('volunteerFeedback'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await enhanceUserLocationAccuracy(validatedFields.data);
    return {
      message: 'Success',
      enhancedLocation: result.enhancedLocation,
    };
  } catch (error) {
    return {
      message: 'Failed to enhance location. Please try again.',
    };
  }
}
