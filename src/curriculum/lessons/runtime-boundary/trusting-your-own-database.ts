import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "trusting-your-own-database",
  title: "Rows are untrusted too",
  tier: "advanced",
  track: "runtime-boundary",
  order: 19,
  summary:
    "Query results are any in most drivers. Schema-derived row types, nullable columns, and why the database is a boundary like any other.",
  prerequisites: ["generated-types-from-contracts", "typing-request-handlers"],
  keywords: ["database", "sql", "rows", "prisma", "kysely", "nullable"],
  problem:
    "A migration made a column nullable and every read site still believes it cannot be null.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
