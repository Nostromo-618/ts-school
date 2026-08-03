import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "template-literal-inference",
  title: "Parsing strings in the type system",
  tier: "advanced",
  track: "type-level",
  order: 16,
  summary:
    "infer inside a template literal type turns a string into structure: route parameters, query keys, and typed string builders.",
  prerequisites: ["template-literal-types-intro", "infer-keyword"],
  keywords: ["template literal", "infer", "parse", "route params", "string"],
  problem:
    '"/users/:id/posts/:postId" contains two parameter names that no framework can check unless the type system reads the string.',
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
