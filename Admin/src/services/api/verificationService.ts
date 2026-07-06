import api from "./client";

export const verificationService = {
  getStats: async () => {
    const response = await api.get("/api/admin/verifications/stats");
    return response.data;
  },
  getPendingVerifications: async () => {
    const response = await api.get("/api/admin/verifications");
    return response.data;
  },
};
