import api from "./client";
import { LeadMessage } from "../../types";

type CreateLeadRequest = {
  name: string;
  email: string;
  patientPhone: string | null;
  title: string | null;
  description: string | null;
  serviceCategory: string | null;
  country: string | null;
  city: string | null;
};

export const leadsService = {
  getLeads: async () => {
    const response = await api.get("/api/leads");
    return response.data;
  },

  getLeadById: async (leadId: string) => {
    const response = await api.get(`/api/leads/${leadId}`);

    return response.data;
  },

  createLead: async (request: CreateLeadRequest) => {
    const response = await api.post("/api/leads", request);

    return response.data;
  },

  updateRouting: async (
    leadId: string,
    request: {
      routingType: "DIRECT" | "TENDER";
    },
  ) => {
    const response = await api.patch(`/api/leads/${leadId}/routing`, request);

    return response.data;
  },

  addMessage: async (
    leadId: string,
    message: LeadMessage,
  ): Promise<{ success: boolean; messageId: string }> => {
    const response = await api.post(`/api/leads/${leadId}/messages`, message);
    return response.data;
  },

  getLeadNotes: async (leadId: string) => {
    const response = await api.get(`/api/leads/${leadId}/notes`);

    return response.data;
  },

  createLeadNote: async (leadId: string, note: string) => {
    const response = await api.post(`/api/leads/${leadId}/notes`, {
      note,
    });

    return response.data;
  },

  assignVendor: async (leadId: string, vendorId: string) => {
    const response = await api.patch(`/api/leads/${leadId}/assign-vendor`, {
      vendorId,
    });

    return response.data;
  },
};
