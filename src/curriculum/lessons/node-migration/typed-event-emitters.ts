import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "typed-event-emitters",
  title: "Typed event emitters",
  tier: "intermediate",
  track: "node-migration",
  order: 17,
  summary:
    "EventEmitter's untyped on and emit, generic emitter maps, and the typed-events option that arrived in newer Node types.",
  prerequisites: ["template-literal-types-intro", "typing-http-servers"],
  keywords: ["EventEmitter", "events", "typed events", "on", "emit", "generic"],
  problem:
    "emitter.on('conected', handler) compiles, runs, and never fires, because event names are just strings.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
