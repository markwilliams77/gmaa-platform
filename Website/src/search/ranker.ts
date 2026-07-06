import { VendorSearchDocument } from "./types";

export function rankMatches(
  vendors: VendorSearchDocument[],
  query: string,
): VendorSearchDocument[] {
  const words = query.toLowerCase().split(" ").filter(Boolean);
  if (words.length === 0) {
    return vendors;
  }

  const scored = vendors.map((vendor) => {
    let score = 0;

    for (const word of words) {
      if ((vendor.companyName ?? "").toLowerCase().includes(word)) {
        score += 100;
      }

      if ((vendor.category ?? "").toLowerCase().includes(word)) {
        score += 70;
      }

      if ((vendor.specialty ?? "").toLowerCase().includes(word)) {
        score += 80;
      }

      if ((vendor.country ?? "").toLowerCase().includes(word)) {
        score += 50;
      }

      if ((vendor.city ?? "").toLowerCase().includes(word)) {
        score += 60;
      }

      (vendor.services ?? []).forEach((service) => {
        if ((service ?? "").toLowerCase().includes(word)) {
          score += 90;
        }
      });

      (vendor.keywords ?? []).forEach((keyword) => {
        if ((keyword ?? "").toLowerCase().includes(word)) {
          score += 20;
        }
      });
    }

    return {
      ...vendor,
      score,
    };
  });

  return scored
    .filter((vendor) => (vendor.score ?? 0) > 0)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}
