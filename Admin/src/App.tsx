/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Loader2 } from 'lucide-react';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import { useAuth } from './components/AuthContext';
import { authService } from './services/api';

export default function App() {
  const { user, loading, setSimulationUser } = useAuth();

  const handleLogout = async () => {
    authService.logout();
    setSimulationUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1220]">
        <Loader2 className="w-16 h-16 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      {user ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={(adminUser) => setSimulationUser(adminUser)} />
      )}
    </div>
  );
}
