import api from './client';
import { Consultation, UpdateConsultationRequest } from '../../types';

export const consultationsService = {
  getConsultations: async (): Promise<{ success: boolean; consultations: Consultation[] }> => {
    const response = await api.get('/consultations');
    return response.data;
  },

  updateConsultation: async (
    consultationId: string,
    request: UpdateConsultationRequest
  ): Promise<{ success: boolean; consultationId: string }> => {
    const response = await api.patch(
      `/consultations/${consultationId}`,
      request
    );
    return response.data;
  },

  getConsultationById: async (consultationId: string): Promise<Consultation> => {
    const response = await api.get(`/consultations/${consultationId}`);
    return response.data.consultation;
  },

  convertToLead: async (
  consultationId: string
): Promise<any> => {
  const response = await api.post(
    `/consultations/${consultationId}/convert-to-lead`
  );

  return response.data;
},
};
