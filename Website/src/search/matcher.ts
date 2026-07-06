import { SearchIndex } from "./index";
import { normalizeQuery } from "./normalizer";
import { VendorSearchDocument } from "./types";

export function findMatches(query: string): VendorSearchDocument[] {
  const normalized = normalizeQuery(query);

  if (!normalized) {
    return SearchIndex;
  }

  const words = normalized.split(" ").filter(Boolean);

  return SearchIndex.filter((vendor) =>
    words.some((word) => vendor.searchableText.includes(word)),
  );
}
