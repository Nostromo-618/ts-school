import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "tsc-cli",
  title: "The tsc command line",
  tier: "beginner",
  track: "tooling",
  order: 1,
  summary:
    "--noEmit, --watch, --showConfig, and --build. The four flags that cover almost everything you will ever type at a prompt.",
  prerequisites: ["tsconfig-essentials"],
  keywords: ["tsc", "noEmit", "watch", "showConfig", "cli"],
  problem:
    "Running tsc with no arguments in a project with a tsconfig does something subtly different from running it with a file name.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
