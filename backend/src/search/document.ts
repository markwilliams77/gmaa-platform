import { VendorSearchDocument } from "./types";

export function createVendorDocument(vendor: any): VendorSearchDocument {
  return {
  vendorId: vendor.id,

  companyName: vendor.companyName,

  category: vendor.mainCategory ?? "",

  subCategory: vendor.subCategory ?? "",

  specialty: vendor.specialty ?? "",

  services: vendor.websiteServices?.map((service: any) => service.name) ?? [],

  city: vendor.city ?? "",

  state: vendor.state ?? "",

  country: vendor.country ?? "",

  keywords: [
    vendor.companyName,
    vendor.mainCategory,
    vendor.subCategory,
    vendor.specialty,
    vendor.country,
    vendor.state,
    vendor.city,
    ...(vendor.websiteServices?.map((service: any) => service.name) ?? []),
  ]
    .filter(Boolean)
    .map((x) => x.toLowerCase()),

  searchableText: [
    vendor.companyName,
    vendor.mainCategory,
    vendor.subCategory,
    vendor.specialty,
    vendor.country,
    vendor.state,
    vendor.city,
    ...(vendor.websiteServices?.map((service: any) => service.name) ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase(),

  source: vendor,
};
}