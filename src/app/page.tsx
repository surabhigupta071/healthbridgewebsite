"use client";

import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/app-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Users } from 'lucide-react';
import type { Role } from '@/contexts/app-context';

export default function Home() {
  const { login } = useApp();
  const router = useRouter();

  // Handle login action: set role and navigate to dashboard
  const handleLogin = () => {
    login('user');
    router.push('/dashboard');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
      {/* Title and tagline */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-primary">
          HealthBridge
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-foreground/80">
          Bridging your health with community support.
        </p>
      </div>

      {/* Main Card with "Get Started" and login button */}
      <Card className="flex flex-col text-center shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-sm w-full">
        <CardHeader>
          <Users className="h-12 w-12 mx-auto text-primary" />
          <CardTitle className="mt-4">Get Started</CardTitle>
          <CardDescription className="mt-2 text-base">
            Get health insights from your patch and request help when you need it most.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex items-end justify-center">
          <Button size="lg" className="w-full" onClick={handleLogin}>
            Enter App
          </Button>
        </CardContent>
      </Card>

      {/* Footer tagline */}
      <div className="mt-16 text-center text-foreground/60">
        <p>A new way to monitor your health.</p>
      </div>
    </main>
  );
}
