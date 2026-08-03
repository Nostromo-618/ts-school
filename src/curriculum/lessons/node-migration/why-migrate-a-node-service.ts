import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "why-migrate-a-node-service",
  title: "Migrating a Node service: what changes",
  tier: "beginner",
  track: "node-migration",
  order: 1,
  summary:
    "What you actually get from types in a server codebase, what it costs in build time and ceremony, and what stays exactly the same.",
  prerequisites: ["why-types"],
  keywords: ["migration", "node", "service", "adoption", "cost"],
  problem:
    "Rewriting a working service is never justified on its own, so a migration has to pay for itself while the service keeps shipping.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
