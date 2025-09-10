"use client";

import { useApp } from "@/contexts/app-context";
import { UserDashboard } from "@/components/healthbridge/user-dashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { role } = useApp();

  // If the user role isn’t loaded yet, show a loading placeholder
  if (!role) {
    return (
      <div className="container py-8">
        {/* Large header placeholder */}
        <Skeleton className="h-32 w-full" />
        {/* Placeholder cards for dashboard content */}
        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Once the role is loaded, show the actual user dashboard with a smooth transition
  return (
    <div className="transition-all duration-500">
      <UserDashboard />
    </div>
  );
}
