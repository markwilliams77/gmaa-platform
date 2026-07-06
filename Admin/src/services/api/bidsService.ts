import api from './client';
import { Bid, UpdateBidRequest } from '../../types';

export const bidsService = {
  getBids: async (
  tenderId?: string,
  vendorId?: string
): Promise<{ success: boolean; bids: Bid[] }> => {
  const params = new URLSearchParams();

  if (tenderId)
    params.append("tenderId", tenderId);

  if (vendorId)
    params.append("vendorId", vendorId);

  const response = await api.get(
    `/bids${
      params.toString()
        ? `?${params.toString()}`
        : ""
    }`
  );

  return response.data;
},

getTenderBids: async (
  tenderId: string
): Promise<Bid[]> => {
  const response = await api.get(
    `/tenders/${tenderId}/bids`
  );

  return response.data;
},

  updateBid: async (
    bidId: string,
    request: UpdateBidRequest
  ): Promise<{ success: boolean; bidId: string }> => {
    const response = await api.put(`/bids/${bidId}`, request);
    return response.data;
  },

  getBidById: async (bidId: string): Promise<Bid> => {
    const response = await api.get(`/bids/${bidId}`);
    return response.data.bid;
  },
};
