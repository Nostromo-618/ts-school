import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "type-safe-serialization",
  title: "The round trip",
  tier: "advanced",
  track: "runtime-boundary",
  order: 18,
  summary:
    "Date, Map, Set, BigInt, and undefined do not survive JSON. Typing what comes back so it matches what is actually there.",
  prerequisites: ["generated-types-from-contracts", "utility-types-tour"],
  keywords: ["serialization", "JSON", "Date", "round trip", "Jsonify"],
  problem:
    "A field typed Date is a string by the time it reaches the client, and the type says otherwise on both sides.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
