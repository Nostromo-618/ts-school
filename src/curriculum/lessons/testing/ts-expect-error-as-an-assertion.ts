import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "ts-expect-error-as-an-assertion",
  title: "Asserting that code does not compile",
  tier: "advanced",
  track: "testing",
  order: 11,
  summary:
    "@ts-expect-error fails when the error disappears, which makes it the only built-in way to test that an invalid call is still rejected.",
  prerequisites: ["suppressions", "type-level-tests"],
  keywords: [
    "ts-expect-error",
    "negative test",
    "compile error",
    "assertion",
    "api",
  ],
  problem:
    "Nothing stops a type from getting looser, so the invalid usage your API deliberately rejects starts compiling and no test notices.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
