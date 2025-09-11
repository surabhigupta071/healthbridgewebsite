"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo } from 'react';

// Define the Role type—currently only 'user' or null
export type Role = 'user' | null;

// Shape for our app-wide context
type AppContextType = {
  role: Role;
  setRole: (role: Role) => void;
  isAuthenticated: boolean;
  login: (role: Role) => void;
  logout: () => void;
};

// Create the context with an undefined default (enforcing use within a provider)
const AppContext = createContext<AppContextType | undefined>(undefined);

// Main provider component to wrap your app
export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login: set role and authentication state
  const login = (selectedRole: Role) => {
    setRole(selectedRole);
    setIsAuthenticated(true);
  };

  // Logout: clear role and authentication state
  const logout = () => {
    setRole(null);
    setIsAuthenticated(false);
  };

  // Memoize context to avoid unnecessary rerenders
  const contextValue = useMemo(
    () => ({
      role,
      setRole,
      isAuthenticated,
      login,
      logout,
    }),
    [role, isAuthenticated]
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to conveniently consume the context in components
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
