import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "project-references",
  title: "Project references and monorepos",
  tier: "advanced",
  track: "tooling",
  order: 17,
  summary:
    "Splitting a repository into buildable units, tsc --build, and the difference between referencing a project and importing its source.",
  prerequisites: ["incremental-builds", "package-json-exports-and-types"],
  keywords: [
    "project references",
    "monorepo",
    "composite",
    "tsc --build",
    "workspace",
  ],
  problem:
    "A monorepo where every package sees every other package's source has one enormous compilation unit and no boundaries at all.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
