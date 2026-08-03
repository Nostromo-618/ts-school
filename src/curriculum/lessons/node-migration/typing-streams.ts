import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "typing-streams",
  title: "Streams",
  tier: "intermediate",
  track: "node-migration",
  order: 15,
  summary:
    "Readable, Writable, Transform and their generics, object mode, pipeline, and the async-iterator interface that makes them tolerable.",
  prerequisites: ["async-iterators-and-generators", "typing-fs-and-path"],
  keywords: [
    "stream",
    "Readable",
    "Transform",
    "pipeline",
    "object mode",
    "backpressure",
  ],
  problem:
    "Streams predate generics in Node's types, so object-mode chunks are typed as any unless you say otherwise.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
