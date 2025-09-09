"use server";
// imports -- patch analyzer stuff + zod for checks
import { analyzePatch, AnalyzePatchOutput } from "@/ai/flows/analyze-patch-flow";
import { z } from "zod";

// schema to make sure we actually got the img (not empty, lol)
const schema = z.object({
  imageDataUri: z.string().min(1, 'Image data is required.'), // must actually send something here
});

// State type just holds message + result if you get success (errors too, classic)
type State = {
  message: string;
  result?: AnalyzePatchOutput; // might be missing, that’s fine
  errors?: {
    imageDataUri?: string[]; // if img fails, show error msg for that field
  }
};

// this is the main action function 4 the form - gets the patch img, runs analyze, returns status/report
export async function analyzePatchAction(prevState: State, formData: FormData): Promise<State> {
  // validate fields first -- zod does the heavy lifting
  const validatedFields = schema.safeParse({
    imageDataUri: formData.get('imageDataUri'),
  });
  if (!validatedFields.success) {
    // didn’t pass schema, fieldErrors says what’s up
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  try {
    // ok everything seems fine, go analyze the patch (call the ai thing)
    const result = await analyzePatch(validatedFields.data);
    return {
      message: 'Success', // yay
      result,
    };
  } catch (error) {
    // if anything blew up, just say failed (check console for real err)
    console.error(error);
    return {
      message: 'Failed to analyze patch. Please try again.', // classic fallback
    };
  }
}
// todo: maybe handle more errors lol?
