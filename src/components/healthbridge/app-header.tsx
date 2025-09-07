"use client";

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useApp } from "@/contexts/app-context";
import type { Role } from "@/contexts/app-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut, Shield, HeartHandshake, LayoutDashboard, UserCog } from "lucide-react";

export function AppHeader() {
  const { role, setRole, logout } = useApp();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
    { href: "/profile", label: "Profile", icon: <UserCog className="w-4 h-4 mr-2" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg font-headline">HealthBridge</span>
          </Link>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium mt-8">
                <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                  <span className="font-bold font-headline">HealthBridge</span>
                </Link>
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* Role Toggle */}
          <div className="flex items-center gap-2 p-1 rounded-full bg-muted">
            <Button
              size="sm"
              variant={role === 'user' ? 'default' : 'ghost'}
              className="rounded-full"
              onClick={() => setRole('user' as Role)}
            >
              <User className="mr-2 h-4 w-4" /> User
            </Button>
            <Button
              size="sm"
              variant={role === 'volunteer' ? 'secondary' : 'ghost'}
              className="rounded-full"
              onClick={() => setRole('volunteer' as Role)}
            >
              <HeartHandshake className="mr-2 h-4 w-4" /> Volunteer
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://picsum.photos/100" alt="User avatar" data-ai-hint="person face" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Account</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {role === 'user' ? 'john.smith@email.com' : 'sarah.chen@email.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
