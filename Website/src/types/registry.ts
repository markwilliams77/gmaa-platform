export interface RegistryVendor {
  id: string;
  name: string;
  image?: string | null;

  mainCategory: string;
  subCategory: string;

  specialty: string;
  services: string[];

  location: string;

  country: string;
  state: string;
  city: string;

  description?: string | null;
  accreditation?: string[];
  rating?: number | null;

  stats?: {
    patients?: number;
    experience?: number;
    countries?: number;
    successRate?: number;
  } | null;
}

export interface VendorProfile {
  id: string;
  name: string;
  location: string;

  image?: string | null;

  mainCategory: string;
  specialty: string;

  rating?: number | null;

  profileHeadline?: string | null;
  description?: string | null;

  fullServices: string[];

  accreditation: string[];

  gallery: {
    id: string;
    imageUrl: string;
    caption?: string | null;
    sortOrder: number;
  }[];

  testimonials: {
    id: string;
    patientName: string;
    country?: string | null;
    testimonial: string;
    imageUrl?: string | null;
  }[];

  stats: Record<string, string>;

  staffCount?: number | null;

  hasConcierge: boolean;

  phone?: string | null;

  faqs?: {
    question: string;
    answer: string;
  }[];
}
