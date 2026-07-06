import type { RegistryVendor } from "../types/registry";
import { VendorSearchDocument } from "./types";

export function createVendorDocument(
  vendor: RegistryVendor,
): VendorSearchDocument {
  return {
    vendorId: vendor.id,

    companyName: vendor.name,

    category: (vendor as any).mainCategory ?? vendor.category ?? "",

    subCategory: "",

    specialty: vendor.specialty,

    services: vendor.services ?? [],

    city: "",

    state: "",

    country: vendor.location,

    keywords: [
      vendor.name,
      (vendor as any).mainCategory ?? vendor.category,
      vendor.specialty,
      vendor.location,
      ...(vendor.services ?? []),
    ]
      .filter(Boolean)
      .map((x) => x.toLowerCase()),

    searchableText: [
      vendor.name,
      (vendor as any).mainCategory ?? vendor.category ?? "",
      vendor.specialty ?? "",
      vendor.location ?? "",
      ...(vendor.services ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),

    source: vendor,
  };
}
