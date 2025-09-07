"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { getEnhancedLocation } from '@/actions/enhance-location';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Lightbulb } from 'lucide-react';
import { useEffect, useRef } from 'react';

const initialState = {
  message: '',
  enhancedLocation: '',
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="sm">
      {pending ? 'Enhancing...' : 'Enhance Location'}
    </Button>
  );
}

export function LocationEnhancer({ initialLocation }: { initialLocation: string }) {
  const [state, formAction] = useFormState(getEnhancedLocation, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message === 'Success') {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <Card className="bg-muted/50">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" /> AI Location Helper
            </CardTitle>
            <CardDescription>
                If you have more details about the user's location, enter them below to get a more precise pickup point.
            </CardDescription>
        </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
          <input type="hidden" name="initialLocation" value={initialLocation} />
          <div>
            <Label htmlFor="volunteerFeedback">Volunteer Feedback (e.g., "near the blue building")</Label>
            <Textarea
              id="volunteerFeedback"
              name="volunteerFeedback"
              placeholder="Enter details here..."
            />
            {state.errors?.volunteerFeedback && <p className="text-sm font-medium text-destructive mt-1">{state.errors.volunteerFeedback[0]}</p>}
          </div>
          <SubmitButton />
        </form>
        
        {state.enhancedLocation && (
          <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <h4 className="font-semibold flex items-center gap-2"><Lightbulb className="h-4 w-4 text-primary" /> Enhanced Location:</h4>
            <p className="mt-1">{state.enhancedLocation}</p>
          </div>
        )}
        {state.message && state.message !== 'Success' && !state.errors && (
            <p className="text-destructive mt-2">{state.message}</p>
        )}
      </CardContent>
    </Card>
  );
}
