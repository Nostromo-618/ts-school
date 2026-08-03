import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "worker-threads-and-structured-clone",
  title: "Worker threads",
  tier: "advanced",
  track: "node-migration",
  order: 24,
  summary:
    "Typing the message protocol between threads, what structured clone can carry, and why the boundary deserves the same scepticism as the network.",
  prerequisites: [
    "discriminated-payloads-and-versioning",
    "typing-child-process-and-buffers",
  ],
  keywords: [
    "worker_threads",
    "postMessage",
    "structured clone",
    "protocol",
    "MessagePort",
  ],
  problem:
    "postMessage accepts any, so the protocol between two threads in the same repository is documented nowhere.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
