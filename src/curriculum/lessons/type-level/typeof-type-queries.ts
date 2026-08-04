import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "typeof-type-queries",
  title: "typeof in type position",
  tier: "intermediate",
  track: "type-level",
  order: 2,
  summary:
    "typeof config in a type annotation asks for the type of a value. The bridge from the values you already have to the types you need.",
  prerequisites: ["type-space-vs-value-space", "const-assertions"],
  keywords: ["typeof", "type query", "value to type", "inference", "config"],
  problem:
    "The config object and the Config interface are maintained separately, and they diverge on the first hurried commit.",
  js: {
    code: `const defaults = { host: 'localhost', port: 3000 };
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Config object with no derived type.",
  },
  ts: {
    code: `const defaults = { host: "localhost", port: 3000 } as const;
type Defaults = typeof defaults;
type Port = Defaults["port"];
const p: Port = 3000;
const bad: Port = "3000";
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "typeof + as const derives literal port type.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 5,
        messageIncludes: "Type '\"3000\"' is not assignable to type '3000'.",
      },
    ],
  },
  insight: [
    "typeof value queries the type of a value.",
    "Use it to keep config objects as the source of truth.",
    "Combine with as const for literal unions.",
  ],
};
