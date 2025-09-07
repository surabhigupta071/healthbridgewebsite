"use client";

import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/app-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, HeartHandshake } from 'lucide-react';
import type { Role } from '@/contexts/app-context';

export default function Home() {
  const { login } = useApp();
  const router = useRouter();

  const handleRoleSelection = (role: Role) => {
    login(role);
    router.push('/dashboard');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-primary">
          HealthBridge
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-foreground/80">
          Bridging your health with community support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <Card className="flex flex-col text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <Users className="h-12 w-12 mx-auto text-primary" />
            <CardTitle className="mt-4">For Users</CardTitle>
            <CardDescription className="mt-2 text-base">
              Get health insights from your patch and request a ride when you need it most.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end justify-center">
            <Button size="lg" className="w-full" onClick={() => handleRoleSelection('user')}>
              I am a User
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <HeartHandshake className="h-12 w-12 mx-auto text-accent" />
            <CardTitle className="mt-4">For Volunteers</CardTitle>
            <CardDescription className="mt-2 text-base">
              Offer a helping hand. Set your availability and respond to ride requests in your community.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end justify-center">
            <Button size="lg" variant="secondary" className="w-full" onClick={() => handleRoleSelection('volunteer')}>
              I am a Volunteer
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-16 text-center text-foreground/60">
        <p>Already have an account? <a href="#" className="font-semibold text-primary hover:underline">Log In</a></p>
      </div>
    </main>
  );
}
