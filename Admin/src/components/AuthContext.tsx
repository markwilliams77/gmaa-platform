import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { authService } from '../services/api';

type AdminUser = {
  id?: string;
  uid?: string;
  email: string;
  username?: string;
  displayName?: string;
};

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  error: Error | undefined;
  profile: AdminUser | null;
  setSimulationUser: (user: AdminUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => authService.getStoredUser());

  const effectiveUser = useMemo(() => {
    if (!adminUser) return null;

    return {
      ...adminUser,
      uid: adminUser.uid || adminUser.id || adminUser.email,
      displayName: adminUser.displayName || adminUser.username || adminUser.email,
    };
  }, [adminUser]);

  return (
    <AuthContext.Provider
      value={{
        user: effectiveUser,
        loading: false,
        error: undefined,
        profile: effectiveUser,
        setSimulationUser: setAdminUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
