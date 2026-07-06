import type { RegistryVendor } from "../types/registry";
import { createVendorDocument } from "./document";
import { SearchIndex } from "./index";
import { VendorSearchDocument } from "./types";

export function buildSearchIndex(
  vendors: RegistryVendor[],
): VendorSearchDocument[] {
  SearchIndex.length = 0;

  SearchIndex.push(
    ...vendors.map((vendor) => createVendorDocument(vendor)),
  );

  return SearchIndex;
}