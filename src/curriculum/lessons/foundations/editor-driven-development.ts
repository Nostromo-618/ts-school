import type { Lesson } from "@/curriculum/types";
import {
  placeholderJsPane,
  placeholderTsPane,
} from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "editor-driven-development",
  title: "The editor is the compiler",
  tier: "beginner",
  track: "foundations",
  order: 12,
  summary: "tsserver is the same checker as the CLI. Hover, go-to-definition, rename, and quick fix are not conveniences — they are how you interrogate a type.",
  prerequisites: ["reading-type-errors"],
  keywords: ["tsserver", "editor", "hover", "quick fix", "rename", "ide"],
  problem: "Guessing at a type and running the build to find out is a thirty-second loop; hovering is instant and answers the same question.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
