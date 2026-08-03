import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "branded-and-nominal-types",
  title: "Branded types",
  tier: "advanced",
  track: "type-level",
  order: 18,
  summary:
    "Adding an unforgeable marker to a structural type so UserId and OrderId stop being interchangeable strings.",
  prerequisites: ["unique-symbol", "intersection-types"],
  keywords: ["branded type", "nominal", "opaque", "UserId", "unique symbol"],
  problem:
    "Every id in the system is a string, so passing an order id where a user id was expected is a type-correct data breach.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
