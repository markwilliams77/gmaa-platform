import { useAuth } from './AuthContext';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ChevronLeft, Mail, Lock, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onBack?: () => void;
  onLoginBypass?: (user: { email: string; uid: string }) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack, onLoginBypass }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { loginVendor, loginAdmin } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) return;

    setLoading(true);
    setError(null);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (
        normalizedEmail.includes('@') &&
        (
          normalizedEmail.includes('admin') ||
          normalizedEmail === 'digitalised17@gmail.com'
        )
      ) {
        await loginAdmin(normalizedEmail, password);
      } else {
        await loginVendor(normalizedEmail, password);
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setError(null);
    // Simulate SSO with the official developer email for admin privileges
    setTimeout(() => {
      onLoginBypass?.({
        email: 'digitalised17@gmail.com',
        uid: 'sim-admin-google'
      });
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden px-4 sm:px-0">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-y-0 left-[10%] w-[1px] bg-navy/5"></div>
        <div className="absolute inset-y-0 right-[10%] w-[1px] bg-navy/5"></div>
        <div className="absolute inset-y-0 left-1/2 w-[1px] bg-navy/5 opacity-50"></div>
      </div>
      
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-6 sm:top-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 text-navy/40 hover:text-navy transition-all px-5 py-2.5 sm:px-6 sm:py-3 rounded-full hover:bg-slate-bg uppercase text-[10px] font-black tracking-widest group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Return to Portal
        </button>
      )}
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm p-6 sm:p-8 md:p-12 glass bg-white/80 border-navy/5 rounded-[32px] sm:rounded-[48px] shadow-2xl backdrop-blur-3xl mt-12 sm:mt-0"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-navy rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-navy/20 mb-6 sm:mb-8 shrink-0">
            <ShieldCheck className="text-brand-red" size={28} />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-serif italic text-navy mb-1.5 sm:mb-2 tracking-tight pr-2">
            Institutional Access
          </h1>
          <p className="text-navy/40 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6 sm:mb-10">
            Security Gateway
          </p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-navy/40 px-4 sm:px-5">
              ID / Email
            </label>
            <div className="relative">
              <Mail className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-navy/20" size={16} />
              <input 
                type="email" 
                required
                placeholder="institution@partner.com"
                className="w-full bg-slate-bg border-none rounded-xl sm:rounded-2xl py-3.5 sm:py-4 pl-12 sm:pl-14 pr-5 sm:pr-6 text-sm font-semibold focus:ring-2 focus:ring-navy/20 transition-all placeholder:text-slate-400 text-navy"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-navy/40 px-4 sm:px-5">
              Access Key
            </label>
            <div className="relative">
              <Lock className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-navy/20" size={16} />
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full bg-slate-bg border-none rounded-xl sm:rounded-2xl py-3.5 sm:py-4 pl-12 sm:pl-14 pr-5 sm:pr-6 text-sm font-semibold focus:ring-2 focus:ring-navy/20 transition-all placeholder:text-slate-400 text-navy"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-[10px] font-bold text-brand-red uppercase tracking-wide bg-brand-red/5 p-3.5 sm:p-4 rounded-xl border border-brand-red/10 leading-relaxed">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-navy text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] shadow-xl hover:bg-brand-red transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Authorize Login'}
          </button>
        </form>

        <div className="relative my-6 sm:my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-navy/5"></div>
          </div>
          <div className="relative flex justify-center text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
            <span className="bg-white px-3 sm:px-4 text-navy/20">OR SSO Access</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 sm:gap-4 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border border-navy/5 text-navy/60 hover:text-navy hover:bg-slate-bg transition-all text-[9px] sm:text-[10px] font-black uppercase tracking-widest active:scale-95 disabled:opacity-50"
        >
          <img src="https://www.gstatic.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" className="h-3.5 sm:h-4 object-contain" alt="Google" />
          Sign in with Google
        </button>
        
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-navy/5 text-center">
           <p className="text-[9px] font-bold text-navy/20 uppercase tracking-[0.25em] sm:tracking-[0.3em] leading-relaxed mb-4">
             Secured Access: Use credentials or simulate SSO to view designated dashboards easily.
           </p>
           <div className="text-[8px] sm:text-[9px] text-navy/40 text-left bg-slate-bg p-3 rounded-lg border border-navy/5 space-y-1 font-mono">
             <div>• Provider: radha@hospital.in & access123</div>
             <div>• Admin: admin@globalmaa.com & 12345</div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;