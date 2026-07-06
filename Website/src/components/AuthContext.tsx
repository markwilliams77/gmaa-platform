import React, { createContext, useContext, ReactNode, useState } from 'react';
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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(() => {
    const saved = localStorage.getItem('gmaa_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState<any | null>(() => {
    const saved = localStorage.getItem('gmaa_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error] = useState<Error | undefined>(undefined);

  //const setSimulationUser = async (newUser: any) => {
  const loginVendor = async (username: string, password: string) => { 
    setLoading(true);
    
    try {
      const response = await backendApi.loginVendor(username, password);
      localStorage.setItem('gmaa_token', response.token);
      localStorage.setItem('gmaa_user', JSON.stringify(response.vendor));
      
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

    localStorage.setItem('gmaa_token', response.token);
    localStorage.setItem('gmaa_user', JSON.stringify(response.user));

    setUser(response.user);
    setProfile({
      role: 'ADMIN',
      ...response.user,
    });
  } finally {
    setLoading(false);
  }
};

  const logout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('gmaa_user');
    localStorage.removeItem('gmaa_profile');
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
