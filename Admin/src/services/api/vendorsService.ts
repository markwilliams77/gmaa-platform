import api from "./client";
import {
  Vendor,
  VendorOnboarding,
  ListVendorOnboardingsResponse,
  GetVendorOnboardingResponse,
  ApproveVendorRequest,
  ApproveVendorResponse,
  RejectVendorResponse,
  DocumentResponse,
} from "../../types";

export const vendorsService = {
  // Existing vendor endpoints
  getVendors: async (): Promise<{ data: Vendor[] }> => {
    const response = await api.get("/api/vendors/admin/vendors");
    return response.data;
  },

  getVendorById: async (vendorId: string): Promise<Vendor> => {
    const response = await api.get(`/api/vendors/${vendorId}`);
    return response.data.vendor;
  },

  // Vendor Onboarding endpoints
  /**
   * List pending vendor reviews
   * @param status - Filter by status (default: UNDER_REVIEW)
   * @param paymentStatus - Filter by payment status (default: COMPLETED)
   * @param completedOnly - Filter for completed only (default: true)
   */
  listPendingReviews: async (
    status = "UNDER_REVIEW",
    paymentStatus = "COMPLETED",
    completedOnly = true,
  ): Promise<ListVendorOnboardingsResponse> => {
    const params = new URLSearchParams();
    params.append("status", status);
    params.append("paymentStatus", paymentStatus);
    params.append("completedOnly", String(completedOnly));

    const response = await api.get(
      `/api/vendors/admin/vendor-onboardings?${params.toString()}`,
    );
    return response.data;
  },

  /**
   * Fetch a single vendor onboarding record
   * @param vendorId - The vendor ID
   */
  getOnboardingRecord: async (
    vendorId: string,
  ): Promise<GetVendorOnboardingResponse> => {
    const response = await api.get(
      `/api/vendors/admin/vendor-onboardings/${vendorId}`,
    );
    return response.data;
  },

  /**
   * Approve vendor onboarding
   * @param vendorId - The vendor ID
   * @param status - The new status (PENDING_ACTIVATION or ACTIVE)
   */
  approveOnboarding: async (
    vendorId: string,
    status: "PENDING_ACTIVATION" | "ACTIVE" = "ACTIVE",
    remarks?: string,
  ): Promise<ApproveVendorResponse> => {
    const response = await api.patch(
      `/api/admin/verifications/${vendorId}/approve`,
      {
        status,
        remarks,
      },
    );
    return response.data;
  },

  /**
   * Reject vendor onboarding
   * @param vendorId - The vendor ID
   */
  rejectOnboarding: async (
    vendorId: string,
    remarks: string,
  ): Promise<RejectVendorResponse> => {
    const response = await api.patch(
      `/api/admin/verifications/${vendorId}/reject`,
      {
        remarks,
      },
    );

    return response.data;
  },

  /**
   * Get document download URL
   * @param vendorId - The vendor ID
   * @param documentType - The document type (business_license, moh_accreditation, tax_identification)
   */
  getDocumentDownloadUrl: async (
    vendorId: string,
    documentType:
      | "business_license"
      | "moh_accreditation"
      | "tax_identification",
  ): Promise<DocumentResponse> => {
    const response = await api.get(
      `/api/vendors/admin/vendor-onboardings/${vendorId}/documents/${documentType}`,
    );
    return response.data;
  },
  updateVendorStatus: async (
    vendorId: string,
    vendorStatus: "ACTIVE" | "SUSPENDED" | "REJECTED",
  ) => {
    const response = await api.patch(
      `/api/vendors/admin/vendors/${vendorId}/status`,
      {
        vendorStatus,
      },
    );

    return response.data;
  },
};
