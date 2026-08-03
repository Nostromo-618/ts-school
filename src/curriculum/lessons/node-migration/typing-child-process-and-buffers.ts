import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "typing-child-process-and-buffers",
  title: "Child processes, Buffers, and binary data",
  tier: "intermediate",
  track: "node-migration",
  order: 18,
  summary:
    "spawn against exec, stdio typing, Buffer against Uint8Array, and encodings that the types describe more precisely than most code uses.",
  prerequisites: ["typing-streams"],
  keywords: [
    "child_process",
    "spawn",
    "Buffer",
    "Uint8Array",
    "stdio",
    "encoding",
  ],
  problem:
    "Buffer is a Uint8Array with extras, and code that assumes one when it has the other fails only on the byte sequences you did not test.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
