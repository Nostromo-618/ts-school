import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "adding-typescript-to-an-existing-project",
  title: "Adding TypeScript to a project that works",
  tier: "beginner",
  track: "node-migration",
  order: 2,
  summary:
    "Install, a tsconfig aimed at Node, a build script, and a first passing check — without moving a single file.",
  prerequisites: ["tsconfig-essentials", "why-migrate-a-node-service"],
  keywords: ["setup", "install", "tsconfig", "build script", "incremental"],
  problem:
    "Most getting-started guides assume an empty directory, which is the one situation a migration is never in.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
