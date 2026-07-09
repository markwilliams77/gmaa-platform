import { createVendorDocument } from "./document";
import { detectIntent } from "./intent";
import { findMatches } from "./matcher";
import { rankMatches } from "./ranker";
import { SearchResult } from "./types";

export function search(vendors: any[], query: string): SearchResult {
  const documents = vendors.map(createVendorDocument);

  const intent = detectIntent(documents, query);

  const filteredDocuments = documents.filter((vendor) => {
    if (
      intent.category &&
      vendor.category.toLowerCase() !== intent.category.toLowerCase()
    ) {
      return false;
    }

    if (
      intent.specialty &&
      vendor.specialty &&
      vendor.specialty.toLowerCase() !== intent.specialty.toLowerCase()
    ) {
      return false;
    }

    if (
      intent.country &&
      vendor.country &&
      vendor.country.toLowerCase() !== intent.country.toLowerCase()
    ) {
      return false;
    }

    if (
      intent.city &&
      vendor.city &&
      vendor.city.toLowerCase() !== intent.city.toLowerCase()
    ) {
      return false;
    }

    return true;
  });

  const matches = findMatches(filteredDocuments, query);

  const ranked = rankMatches(matches, query);

  return {
    intent,
    vendors: ranked.map((document) => document.source),
  };
}
