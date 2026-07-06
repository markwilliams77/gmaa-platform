import { detectIntent } from "./intent";
import { findMatches } from "./matcher";
import { rankMatches } from "./ranker";
import { SearchResult } from "./types";
import type { RegistryVendor } from "../types/registry";

export function search(query: string): SearchResult {
  const intent = detectIntent(query);

  const matches = findMatches(query);

  const ranked = rankMatches(matches, query);

  return {
    intent,
    vendors: ranked.map((v) => v.source as RegistryVendor),
  };
}
