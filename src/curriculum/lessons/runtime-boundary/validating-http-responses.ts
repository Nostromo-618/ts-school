import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "validating-http-responses",
  title: "Validating what came back",
  tier: "intermediate",
  track: "runtime-boundary",
  order: 10,
  summary:
    "fetch gives you any, your API client gives you confidence, and neither gives you a guarantee. Where the parse belongs in a request pipeline.",
  prerequisites: ["schema-validation-libraries", "async-await-typing"],
  keywords: [
    "fetch",
    "http",
    "response",
    "api client",
    "validation",
    "boundary",
  ],
  problem:
    "An upstream service renames a field and your typed client keeps compiling, all the way to the undefined that reaches the user.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
