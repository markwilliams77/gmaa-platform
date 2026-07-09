import { VendorSearchDocument } from "./types";

export function findMatches(
  documents: VendorSearchDocument[],
  query: string,
): VendorSearchDocument[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return documents;
  }

  const words = normalized.split(" ").filter(Boolean);

  const matches = documents.filter((vendor) =>
    words.some((word) => vendor.searchableText.includes(word)),
  );

  return documents.filter((vendor) =>
    words.some((word) => vendor.searchableText.includes(word)),
  );
}
