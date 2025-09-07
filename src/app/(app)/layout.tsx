"use client";

import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { AppHeader } from "@/components/healthbridge/app-header";
import { AppFooter } from "@/components/healthbridge/app-footer";
import { useApp } from "@/contexts/app-context";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);
  
  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 bg-background">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
