import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "json-parse-returns-any",
  title: "JSON.parse returns any",
  tier: "beginner",
  track: "runtime-boundary",
  order: 3,
  summary:
    "JSON.parse is typed as any in lib.es5 — wrap it, annotate unknown, and parse into a checked shape.",
  prerequisites: ["unknown-vs-any", "where-types-end"],
  keywords: ["JSON.parse", "any", "unknown", "parse"],
  problem:
    "const data = JSON.parse(text) silently becomes any, undoing strictness for the rest of the function.",
  js: {
    code: `const data = JSON.parse('{"n":1}');
data.n.toFixed(2);
data.missing.toFixed(2);
`,
    highlights: [{ start: 3, end: 3 }],
    caption: "Missing fields crash later; parse never checked them.",
  },
  ts: {
    code: `// Default lib typing: JSON.parse → any (escape hatch).
const data = JSON.parse('{"n":1}');
const n: number = data.n;
const oops: number = data.missing;
`,
    highlights: [{ start: 2, end: 4 }],
    caption: "any accepts everything — including missing.",
    expectedDiagnostics: [],
  },
  insight: [
    "Treat JSON.parse as returning unknown even when the lib says any.",
    "Write a helper: function parseJson(text: string): unknown { return JSON.parse(text); }",
    "Then validate with predicates or a schema library before use.",
  ],
  security: {
    title: "JSON.parse + any is an open door",
    body: "Any property access on parse results compiles. Force unknown and validate — especially for auth and money fields.",
    severity: "critical",
  },
  quiz: [
    {
      id: "q1",
      prompt: "Safest immediate type for JSON.parse results?",
      choices: [
        { id: "a", text: "any" },
        { id: "b", text: "unknown" },
        { id: "c", text: "object" },
        { id: "d", text: "string" },
      ],
      answerId: "b",
      explanation: "unknown requires narrowing before use.",
    },
  ],
  exercise: {
    prompt: "Type the result as unknown and narrow before reading n.",
    starter: `const data = JSON.parse('{"n":1}');
const n: number = data.n;
`,
    assertion: "no-errors",
    hints: [
      'const data: unknown = JSON.parse(...); if (typeof data === "object" && data && "n" in data && typeof (data as {n: unknown}).n === "number") ...',
    ],
    solution: `const data: unknown = JSON.parse('{"n":1}');
let n = 0;
if (
  typeof data === "object" &&
  data !== null &&
  "n" in data &&
  typeof (data as { n: unknown }).n === "number"
) {
  n = (data as { n: number }).n;
}
void n;
`,
  },
};
