import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Lock, ShieldAlert } from 'lucide-react';
import { authService } from '../services/api';

interface LoginPageProps {
  onLoginSuccess: (user: { email: string; uid: string; displayName: string; id?: string; username?: string }) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authService.login(identifier.trim(), password);
      onLoginSuccess({
        id: response.user.id,
        uid: response.user.id,
        email: response.user.email,
        username: response.user.username,
        displayName: response.user.username || response.user.email,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#071018] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0f172a]/95 p-6 shadow-[0_30px_80px_rgba(8,16,36,0.45)] sm:p-8"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red">
            <ShieldAlert size={26} />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Admin Access</h1>
          <p className="mt-3 text-xs uppercase tracking-[0.25em] text-slate-400">Admin credentials only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Email or Username
            </label>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="admin-...@gmaa.local or toothless-night-534"
              className="w-full rounded-2xl border border-white/10 bg-[#081127] px-5 py-4 text-sm text-white outline-none transition focus:border-brand-red/60 focus:ring-2 focus:ring-brand-red/10"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="generated password"
                className="w-full rounded-2xl border border-white/10 bg-[#081127] px-12 py-4 text-sm text-white outline-none transition focus:border-brand-red/60 focus:ring-2 focus:ring-brand-red/10"
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-brand-red px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
