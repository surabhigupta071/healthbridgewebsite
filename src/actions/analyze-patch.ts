"use server";

import { analyzePatch, AnalyzePatchOutput } from "@/ai/flows/analyze-patch-flow";
import { z } from "zod";

const schema = z.object({
  imageDataUri: z.string().min(1, 'Image data is required.'),
});

type State = {
  message: string;
  result?: AnalyzePatchOutput;
  errors?: {
    imageDataUri?: string[];
  }
};

export async function analyzePatchAction(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = schema.safeParse({
    imageDataUri: formData.get('imageDataUri'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await analyzePatch(validatedFields.data);
    return {
      message: 'Success',
      result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'Failed to analyze patch. Please try again.',
    };
  }
}
