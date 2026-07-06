import api from "./client";

export const verificationService = {
  getStats: async () => {
    const response = await api.get("/admin/verifications/stats");
    return response.data;
  },
  getPendingVerifications: async () => {
    const response = await api.get("/admin/verifications");
    return response.data;
  },
};
