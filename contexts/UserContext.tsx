// contexts/UserContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';

export type UserRole = 'tenant' | 'landlord';

interface UserContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  toggleRole: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [userRole, setUserRole] = useState<UserRole>('landlord');

  const toggleRole = () => {
    setUserRole(prev => prev === 'landlord' ? 'tenant' : 'landlord');
  };

  return (
    <UserContext.Provider value={{ userRole, setUserRole, toggleRole }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
