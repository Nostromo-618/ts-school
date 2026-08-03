import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "eslint-with-typescript",
  title: "ESLint and TypeScript together",
  tier: "beginner",
  track: "tooling",
  order: 3,
  summary:
    "typescript-eslint, what the parser does, and the division of labour: the compiler checks types, the linter checks the things types cannot.",
  prerequisites: ["tsc-cli"],
  keywords: ["eslint", "typescript-eslint", "parser", "lint", "rules"],
  problem:
    "Lint rules and type errors overlap enough that teams configure both to check the same thing and neither to check the gaps.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
