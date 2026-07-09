import type { RegistryVendor } from "../types/registry";

const API = import.meta.env.VITE_API_BASE_URL;

export interface RegistryResponse {
  data: RegistryVendor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getRegistryVendors(params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  country?: string;
  state?: string;
  city?: string;
}) {
  const query = new URLSearchParams();

  if (params.page) query.set("page", params.page.toString());
  if (params.limit) query.set("limit", params.limit.toString());
  if (params.search) query.set("search", params.search);
  if (params.category) query.set("category", params.category);
  if (params.country) query.set("country", params.country);
  if (params.state) query.set("state", params.state);
  if (params.city) query.set("city", params.city);

  const response = await fetch(`${API}/registry/vendors?${query}`);

  if (!response.ok) {
    throw new Error("Failed to load vendors");
  }

  return (await response.json()) as RegistryResponse;
}