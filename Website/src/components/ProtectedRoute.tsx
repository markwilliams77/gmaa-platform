import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, profile, } = useAuth();
  const navigate = useNavigate();

  const isAdminEmployee = (profile?.role === 'admin' || 
                          user?.email === 'digitalised17@gmail.com' ||
                          (user?.email === 'admin@globalmaa.com')) && profile?.role !== 'vendor';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-navy animate-spin" />
      </div>
    );
  }

  if (requireAdmin && !isAdminEmployee) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8 text-center">
        <h1 className="text-2xl font-bold text-navy mb-4">Verification Required</h1>
        <p className="text-navy/60 mb-6">You need administrative privileges to view this portal.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-navy text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-red transition-all cursor-pointer"
        >
          Return Home
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
