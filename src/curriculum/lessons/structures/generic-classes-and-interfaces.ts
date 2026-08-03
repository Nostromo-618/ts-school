import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "generic-classes-and-interfaces",
  title: "Generic classes and interfaces",
  tier: "intermediate",
  track: "structures",
  order: 18,
  summary:
    "Type parameters on a container: repositories, caches, and queues that remember what they hold.",
  prerequisites: ["generics-intro", "classes-intro"],
  keywords: [
    "generic class",
    "container",
    "repository",
    "cache",
    "type parameter",
  ],
  problem:
    "A cache typed with any is a cache that returns any, and every read site loses its type.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
