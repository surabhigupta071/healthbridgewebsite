"use client";

import { useApp } from "@/contexts/app-context";
import { UserDashboard } from "@/components/healthbridge/user-dashboard";
import { VolunteerDashboard } from "@/components/healthbridge/volunteer-dashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { role } = useApp();

  if (!role) {
    // This can be a loading state
    return (
      <div className="container py-8">
        <Skeleton className="h-32 w-full" />
        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="transition-all duration-500">
      {role === 'user' ? <UserDashboard /> : <VolunteerDashboard />}
    </div>
  );
}
