import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "tsserver-and-your-editor",
  title: "tsserver and your editor",
  tier: "beginner",
  track: "tooling",
  order: 2,
  summary:
    "The editor runs the same compiler as CI, from a version you may not have chosen. Workspace versions, restarts, and diagnosing the disagreement.",
  prerequisites: ["editor-driven-development", "tsc-cli"],
  keywords: [
    "tsserver",
    "editor",
    "workspace version",
    "restart",
    "language server",
  ],
  problem:
    "The editor is green and CI is red, and the reason is two different TypeScript versions rather than two different opinions.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
