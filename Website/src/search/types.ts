import { RegistryVendor } from "../types/registry";

export interface SearchQuery {
  text: string;
}

export interface SearchIntent {
  originalQuery: string;

  action?: string;

  category?: string;

  service?: string;

  specialty?: string;

  city?: string;

  country?: string;

  region?: string;

  confidence?: number;
}

export interface VendorSearchDocument {
  vendorId: string;

  companyName: string;

  category: string;

  subCategory?: string;

  specialty?: string;

  services: string[];

  city?: string;

  state?: string;

  country?: string;

  keywords: string[];

  searchableText: string;

  score?: number;

  source: unknown;
}

export interface SearchResult {
  intent: SearchIntent;

  vendors: RegistryVendor[];
}