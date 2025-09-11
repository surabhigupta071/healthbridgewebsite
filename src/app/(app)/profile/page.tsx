"use client";

import { UserProfileForm } from "@/components/healthbridge/user-profile-form";

export default function ProfilePage() {
  return (
     <div className="container max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">User Profile</h2>
            <p className="text-muted-foreground">Manage your personal information and preferences.</p>
        </div>
        <UserProfileForm />
    </div>
  );
}

