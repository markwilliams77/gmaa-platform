/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useAuth } from './components/AuthContext';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-navy animate-spin" />
      </div>
    );
  }

  return <RouterProvider router={router} />;
}
