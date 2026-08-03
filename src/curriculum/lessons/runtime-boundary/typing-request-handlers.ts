import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "typing-request-handlers",
  title: "Request handlers lie",
  tier: "intermediate",
  track: "runtime-boundary",
  order: 13,
  summary:
    "req.body, req.params, and req.query are typed as whatever the framework felt like — usually any or string. Making a handler honest without fighting the framework.",
  prerequisites: ["parse-dont-validate", "typing-http-servers"],
  keywords: [
    "express",
    "fastify",
    "req.body",
    "params",
    "handler",
    "validation",
  ],
  problem:
    "Express types req.body as any, so the most attacker-controlled value in the process is the least checked one.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
