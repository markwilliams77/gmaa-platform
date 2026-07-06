import api from './client';

export const systemService = {
  seedDemoData: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/system/seed', { mode: 'demo' });
    return response.data;
  },

  purgeDemoData: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/system/purge', { mode: 'all' });
    return response.data;
  },
};
