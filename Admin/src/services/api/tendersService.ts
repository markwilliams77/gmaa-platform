import api from './client';
import {
  Tender,
  CreateTenderRequest,
  CreateTenderResponse,
  UpdateTenderRequest,
} from '../../types';

export const tendersService = {
  getTenders: async (): Promise<{ success: boolean; tenders: Tender[] }> => {
  const response = await api.get('/tenders');

  return {
    success: true,
    tenders: Array.isArray(response.data)
      ? response.data
      : response.data.tenders || [],
  };
},

  createTender: async (
    request: CreateTenderRequest
  ): Promise<CreateTenderResponse> => {
    const response = await api.post<CreateTenderResponse>(
      '/tenders',
      request
    );
    return response.data;
  },

  broadcastTender: async (tenderId: string) => {
  const response = await api.patch(
    `/tenders/${tenderId}/broadcast`
  );

  return response.data;
},

  updateTender: async (
    tenderId: string,
    request: UpdateTenderRequest
  ): Promise<{ success: boolean; tenderId: string }> => {
    const response = await api.put(`/tenders/${tenderId}`, request);
    return response.data;
  },

awardBid: async (
  tenderId: string,
  bidId: string
) => {
  const response = await api.patch(
    `/tenders/${tenderId}/award/${bidId}`
  );

  return response.data;
},

  getTenderById: async (tenderId: string) => {
  const response = await api.get(
    `/tenders/${tenderId}`
  );

  return response.data;
},

requestRebid: async (
  tenderId: string,
  vendorIds: string[],
) => {
  const response = await api.patch(
    `/tenders/${tenderId}/rebid`,
    {
      vendorIds,
    },
  );

  return response.data;
},
};


