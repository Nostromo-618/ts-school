import type { Lesson } from "@/curriculum/types";
import { placeholderJsPane, placeholderTsPane } from "@/curriculum/placeholder";

export const lesson: Lesson = {
  id: "typing-http-servers",
  title: "HTTP servers",
  tier: "intermediate",
  track: "node-migration",
  order: 16,
  summary:
    "node:http, Express, and Fastify: what each framework's types actually promise about a request, and where the generics are.",
  prerequisites: ["typing-streams", "generic-classes-and-interfaces"],
  keywords: [
    "http",
    "express",
    "fastify",
    "IncomingMessage",
    "handler",
    "generics",
  ],
  problem:
    "IncomingMessage is a stream with a headers bag, and every framework layers a differently-shaped fiction over it.",
  js: placeholderJsPane(),
  ts: placeholderTsPane(),
  insight: [],
};
