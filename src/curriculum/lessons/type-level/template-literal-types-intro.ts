import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "template-literal-types-intro",
  title: "Template literal types",
  tier: "intermediate",
  track: "type-level",
  order: 9,
  summary:
    "`on${Capitalize<E>}` builds string types from other string types — event names, CSS properties, route paths, all checked.",
  prerequisites: ["literal-types", "mapped-types-intro"],
  keywords: [
    "template literal type",
    "Capitalize",
    "string type",
    "event",
    "route",
  ],
  problem:
    "`String` concatenation for event names. A type-level transform that widens or distributes incorrectly will type-check while describing the wrong value. Read the conditional or mapped type the way you would read a function — inputs, outputs, and failure cases. Hover the resulting type; if it widened, the transform is wrong.",
  solution:
    "Template literal unions forbid `unknown` actions. Template literal types compose string unions. Great for event names, CSS, and routes. Keep the unions small enough to read. Prefer the smallest honest type that still rejects the bad input.",
  js: {
    code: `function eventName(entity, action) {
  return entity + ":" + action;
}
`,
    highlights: [{ start: 1, end: 3 }],
    caption: "`String` concatenation for event names.",
  },
  ts: {
    code: `type Entity = "user" | "order";
type Action = "created" | "updated";
type EventName = \`\${Entity}:\${Action}\`;
const ok: EventName = "user:created";
const bad: EventName = "user:deleted";
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "Template literal unions forbid `unknown` actions.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 5,
        messageIncludes: "Type '\"user:deleted\"' is not assignable to type",
      },
    ],
  },
  insight: [
    "Template literal types compose string unions.",
    "Great for event names, CSS, and routes.",
    "Keep the unions small enough to read.",
  ],
};
