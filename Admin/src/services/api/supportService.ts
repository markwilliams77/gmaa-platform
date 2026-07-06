import api from './client';
import { SupportTicket, SupportTicketMessage } from '../../types';

export const supportService = {
  getTickets: async (): Promise<{ success: boolean; tickets: SupportTicket[] }> => {
    const response = await api.get('/support-tickets');
    return response.data;
  },

  addMessage: async (
    ticketId: string,
    message: SupportTicketMessage
  ): Promise<{ success: boolean; messageId: string }> => {
    const response = await api.post(
      `/support-tickets/${ticketId}/messages`,
      message
    );
    return response.data;
  },

  getTicketById: async (ticketId: string): Promise<SupportTicket> => {
    const response = await api.get(`/support-tickets/${ticketId}`);
    return response.data.ticket;
  },
};
