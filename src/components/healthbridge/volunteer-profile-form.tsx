"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { mockVolunteerProfile } from "@/lib/mock-data";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  contact: z.string().min(5, "Please enter a valid contact number."),
  emergencyContacts: z.string(),
  qualifications: z.string().optional(),
  language: z.string(),
  notificationPreferences: z.object({
      push: z.boolean(),
      email: z.boolean(),
  })
});

export function VolunteerProfileForm() {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ...mockVolunteerProfile,
      emergencyContacts: mockVolunteerProfile.emergencyContacts.join(", "),
    },
  });

  function onSubmit(values: z.infer<typeof profileSchema>) {
    console.log(values);
    // In a real app, you'd save this data.
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="emergencyContacts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emergency Contacts</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormDescription>Please enter contacts separated by a comma.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="qualifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qualifications (optional)</FormLabel>
              <FormControl><Input {...field} placeholder="e.g., First Aid Certified" /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-4">
            <FormLabel>Notification Preferences</FormLabel>
            <FormField
            control={form.control}
            name="notificationPreferences.push"
            render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-2 rounded-md border">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel className="font-normal">Push Notifications</FormLabel>
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="notificationPreferences.email"
            render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-2 rounded-md border">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel className="font-normal">Email Notifications</FormLabel>
                </FormItem>
            )}
            />
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
}
