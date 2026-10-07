import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { backendApi } from '../services/backendApi';

interface AuthContextType {
  user: any | null | undefined;
  loading: boolean;
  error: Error | undefined;
  profile: any | null;
  loginVendor: (username: string, password: string) => Promise<void>;
  loginAdmin: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readStoredValue = (key: string) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(() => {
    return readStoredValue('gmaa_user');
  });
  const [profile, setProfile] = useState<any | null>(() => {
    return readStoredValue('gmaa_profile');
  });
  const [loading, setLoading] = useState(false);
  const [error] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let active = true;

    backendApi.getProfile()
      .then((sessionUser) => {
        if (!active) return;
        const sessionProfile = { role: sessionUser.role, ...sessionUser };
        setUser(sessionUser);
        setProfile(sessionProfile);
        localStorage.setItem('gmaa_user', JSON.stringify(sessionUser));
        localStorage.setItem('gmaa_profile', JSON.stringify(sessionProfile));
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
        setProfile(null);
        localStorage.removeItem('gmaa_user');
        localStorage.removeItem('gmaa_profile');
      });

    return () => {
      active = false;
    };
  }, []);

  //const setSimulationUser = async (newUser: any) => {
  const loginVendor = async (username: string, password: string) => { 
    setLoading(true);
    
    try {
      const response = await backendApi.loginVendor(username, password);
      localStorage.setItem('gmaa_user', JSON.stringify(response.vendor));
      localStorage.setItem('gmaa_profile', JSON.stringify({ role: 'VENDOR', ...response.vendor }));
      
      setUser(response.vendor);
      setProfile({
        role: 'VENDOR',
    ...response.vendor,
  });
} finally {
  setLoading(false);
}};

const loginAdmin = async (email: string, password: string) => {
  setLoading(true);

  try {
    const response = await backendApi.loginAdmin(email, password);

    localStorage.setItem('gmaa_user', JSON.stringify(response.user));
    localStorage.setItem('gmaa_profile', JSON.stringify({ role: 'ADMIN', ...response.user }));

    setUser(response.user);
    setProfile({
      role: 'ADMIN',
      ...response.user,
    });
  } finally {
    setLoading(false);
  }
};

  const logout = async () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('gmaa_user');
    localStorage.removeItem('gmaa_profile');

    try {
      await backendApi.logout();
    } catch (err) {
      console.warn('Logout request failed gracefully', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, profile, loginVendor, loginAdmin, logout }}>
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
