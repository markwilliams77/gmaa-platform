import api from './client';
import {
  AdminCredentials,
  AdminGenerateResponse,
  AuthLoginRequest,
  AuthLoginResponse,
} from '../../types';

export const authService = {
  generateAdminCredentials: async (secret: string): Promise<AdminGenerateResponse> => {
    const response = await api.post<AdminGenerateResponse>('/api/auth/admin/generate', {
      secret,
    });
    return response.data;
  },

  login: async (identifier: string, password: string): Promise<AuthLoginResponse> => {
    const response = await api.post<AuthLoginResponse>('/api/auth/login', {
      identifier,
      password,
    } as AuthLoginRequest);

    console.log("LOGIN RESPONSE:", response.data); //temporary need to remove chutiya gpt
    console.log("TOKEN CHECK:", response.data.token); //temporary need to remove
    console.log(response.data); //temporary need to remove

    if (response.data.token) {
  console.log("SAVING TOKEN");

  localStorage.setItem('auth_token', response.data.token);

  console.log(
    "AFTER SAVE:",
    localStorage.getItem('auth_token')
  );

  localStorage.setItem(
    'admin_user',
    JSON.stringify(response.data.user)
  );
}

    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('admin_user');
  },

  getStoredToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  getStoredUser: () => {
    const user = localStorage.getItem('admin_user');
    return user ? JSON.parse(user) : null;
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
