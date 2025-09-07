"use client";

import { useApp } from "@/contexts/app-context";
import { UserProfileForm } from "@/components/healthbridge/user-profile-form";
import { VolunteerProfileForm } from "@/components/healthbridge/volunteer-profile-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { role } = useApp();

  if (!role) {
    return (
      <div className="container py-8 max-w-2xl mx-auto">
        <Skeleton className="h-10 w-1/2 mb-8" />
        <div className="space-y-8">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  return (
     <div className="container max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">{role === 'user' ? 'User' : 'Volunteer'} Profile</h2>
            <p className="text-muted-foreground">Manage your personal information and preferences.</p>
        </div>
        {role === 'user' ? <UserProfileForm /> : <VolunteerProfileForm />}
    </div>
  );
}
