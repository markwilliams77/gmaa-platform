import api, { setCsrfToken } from './client';
import {
  AdminCredentials,
  AdminGenerateResponse,
  AuthLoginRequest,
  AuthLoginResponse,
} from '../../types';

export const authService = {
  generateAdminCredentials: async (secret: string): Promise<AdminGenerateResponse> => {
    const response = await api.post<AdminGenerateResponse>('/auth/admin/generate', {
      secret,
    });
    return response.data;
  },

  login: async (identifier: string, password: string): Promise<AuthLoginResponse> => {
    const response = await api.post<AuthLoginResponse>('/auth/login', {
      identifier,
      password,
    } as AuthLoginRequest);

    setCsrfToken(response.data.csrfToken);

    if (response.data.user) {
      authService.storeUser(response.data.user);
    }

    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout', {});
    } finally {
      authService.clearStoredUser();
    }
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  storeUser: (user: unknown): void => {
    localStorage.setItem('admin_user', JSON.stringify(user));
  },

  clearStoredUser: (): void => {
    localStorage.removeItem('admin_user');
  },

  getStoredToken: (): string | null => {
    return null;
  },

  getStoredUser: () => {
    const user = localStorage.getItem('admin_user');
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch {
      localStorage.removeItem('admin_user');
      return null;
    }
  },

  downloadCredentials: (credentials: AdminCredentials): void => {
    const content = `GMAA Admin Portal Credentials
================================

Username: ${credentials.username}
Email: ${credentials.email}
Password: ${credentials.password}

IMPORTANT: Save this file in a secure location.
Do NOT share this password with anyone.
This is your only copy - we cannot retrieve it later.
Password reset functionality will be available soon.

Generated: ${new Date().toLocaleString()}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gmaa-admin-credentials-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
