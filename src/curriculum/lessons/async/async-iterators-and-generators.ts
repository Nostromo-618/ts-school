import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "async-iterators-and-generators",
  title: "Async iterators and generators",
  tier: "intermediate",
  track: "async",
  order: 11,
  summary:
    "AsyncIterable<T>, for await, and the three type parameters of a generator — the shape behind every streaming API in Node.",
  prerequisites: ["async-await-typing", "generics-intro"],
  keywords: ["async iterator", "generator", "for await", "yield", "streaming"],
  problem:
    "Generator<T, TReturn, TNext> has three parameters and almost every example on the internet uses only the first.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
