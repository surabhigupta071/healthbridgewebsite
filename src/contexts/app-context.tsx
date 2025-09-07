"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo } from 'react';
import type { RideRequest, AvailabilitySlot } from '@/lib/types';
import { mockRideRequests, mockAvailability } from '@/lib/mock-data';

export type Role = 'user' | 'volunteer';

type AppContextType = {
  role: Role | null;
  setRole: (role: Role) => void;
  isAuthenticated: boolean;
  login: (role: Role) => void;
  logout: () => void;
  rideRequests: RideRequest[];
  acceptRide: (rideId: string) => void;
  availability: AvailabilitySlot[];
  toggleAvailability: (slot: AvailabilitySlot) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rideRequests, setRideRequests] = useState<RideRequest[]>(mockRideRequests);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>(mockAvailability);

  const login = (selectedRole: Role) => {
    setRole(selectedRole);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setRole(null);
    setIsAuthenticated(false);
  };
  
  const acceptRide = (rideId: string) => {
    setRideRequests(prev => prev.filter(r => r.id !== rideId));
  };
  
  const toggleAvailability = (slot: AvailabilitySlot) => {
    setAvailability(prev => {
      const isSet = prev.some(s => s.day === slot.day && s.time === slot.time);
      if (isSet) {
        return prev.filter(s => s.day !== slot.day || s.time !== slot.time);
      } else {
        return [...prev, slot];
      }
    });
  };

  const contextValue = useMemo(() => ({
    role,
    setRole: (newRole: Role) => {
        if(isAuthenticated) setRole(newRole);
    },
    isAuthenticated,
    login,
    logout,
    rideRequests,
    acceptRide,
    availability,
    toggleAvailability,
  }), [role, isAuthenticated, rideRequests, availability]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
