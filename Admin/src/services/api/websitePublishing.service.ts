import api from "./client";

export interface WebsitePublishingVendor {
  id: string;
  vendorNumber: string;
  companyName: string;
  mainCategory: string | null;
  verificationStatus: string;
  websiteStatus: string;
  featured: boolean;
}

export const websitePublishingService = {
  getVendors: async (): Promise<WebsitePublishingVendor[]> => {
    const response = await api.get("/admin/website-publishing/vendors");

    return response.data;
  },

  getWebsiteProfile: async (vendorId: string) => {
    const response = await api.get(
      `/admin/website-publishing/vendors/${vendorId}`,
    );

    return response.data;
  },

  updateWebsiteProfile: async (vendorId: string, payload: any) => {
    const response = await api.patch(
      `/admin/website-publishing/vendors/${vendorId}`,
      payload,
    );

    return response.data;
  },

  getWebsiteServices: async (vendorId: string) => {
    const response = await api.get(
      `/admin/website-publishing/vendors/${vendorId}/services`,
    );

    return response.data;
  },

  createWebsiteService: async (vendorId: string, payload: any) => {
    const response = await api.post(
      `/admin/website-publishing/vendors/${vendorId}/services`,
      payload,
    );

    return response.data;
  },

  updateWebsiteService: async (serviceId: string, payload: any) => {
    const response = await api.patch(
      `/admin/website-publishing/services/${serviceId}`,
      payload,
    );

    return response.data;
  },

  deleteWebsiteService: async (serviceId: string) => {
    await api.delete(`/admin/website-publishing/services/${serviceId}`);
  },
  getWebsiteAccreditations: async (vendorId: string) => {
    const response = await api.get(
      `/admin/website-publishing/vendors/${vendorId}/accreditations`,
    );

    return response.data;
  },

  createWebsiteAccreditation: async (vendorId: string, payload: any) => {
    const response = await api.post(
      `/admin/website-publishing/vendors/${vendorId}/accreditations`,
      payload,
    );

    return response.data;
  },

  updateWebsiteAccreditation: async (accreditationId: string, payload: any) => {
    const response = await api.patch(
      `/admin/website-publishing/accreditations/${accreditationId}`,
      payload,
    );

    return response.data;
  },

  deleteWebsiteAccreditation: async (accreditationId: string) => {
    await api.delete(
      `/admin/website-publishing/accreditations/${accreditationId}`,
    );
  },
  getWebsiteGallery: async (vendorId: string) => {
    const response = await api.get(
      `/admin/website-publishing/vendors/${vendorId}/gallery`,
    );

    return response.data;
  },

  createWebsiteGalleryImage: async (vendorId: string, payload: any) => {
    const response = await api.post(
      `/admin/website-publishing/vendors/${vendorId}/gallery`,
      payload,
    );

    return response.data;
  },

  updateWebsiteGalleryImage: async (galleryId: string, payload: any) => {
    const response = await api.patch(
      `/admin/website-publishing/gallery/${galleryId}`,
      payload,
    );

    return response.data;
  },

  deleteWebsiteGalleryImage: async (galleryId: string) => {
    await api.delete(`/admin/website-publishing/gallery/${galleryId}`);
  },

  getWebsiteTestimonials: async (vendorId: string) => {
    const response = await api.get(
      `/admin/website-publishing/vendors/${vendorId}/testimonials`,
    );

    return response.data;
  },

  createWebsiteTestimonial: async (vendorId: string, payload: any) => {
    const response = await api.post(
      `/admin/website-publishing/vendors/${vendorId}/testimonials`,
      payload,
    );

    return response.data;
  },

  updateWebsiteTestimonial: async (testimonialId: string, payload: any) => {
    const response = await api.patch(
      `/admin/website-publishing/testimonials/${testimonialId}`,
      payload,
    );

    return response.data;
  },

  deleteWebsiteTestimonial: async (testimonialId: string) => {
    await api.delete(
      `/admin/website-publishing/testimonials/${testimonialId}`,
    );
  },
};
