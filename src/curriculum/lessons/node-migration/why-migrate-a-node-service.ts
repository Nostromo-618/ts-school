import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "why-migrate-a-node-service",
  title: "Migrating a Node service: what changes",
  tier: "beginner",
  track: "node-migration",
  order: 1,
  summary:
    "What adopting TypeScript changes in a running Node service — and what it deliberately does not change at runtime.",
  prerequisites: ["why-types", "types-are-erased"],
  keywords: ["migration", "Node", "incremental", "adopt"],
  problem:
    "Teams rewrite everything in one PR, break production, and blame TypeScript instead of the big-bang process.",
  js: {
    code: `// The service already works. The risk is untyped boundaries.
function handler(req, res) {
  const id = req.query.id;
  res.end(String(id.toUpperCase()));
}
`,
    highlights: [{ start: 3, end: 4 }],
    caption: "id may be string | string[] | undefined in real Node.",
  },
  ts: {
    code: `type Req = { query: { id?: string | string[] } };
type Res = { end: (body: string) => void };

function handler(req: Req, res: Res): void {
  const id = req.query.id;
  res.end(id.toUpperCase());
}
`,
    highlights: [{ start: 6, end: 6 }],
    caption: "Migration surfaces the union you already had to handle.",
    expectedDiagnostics: [
      { code: 18048, line: 6, messageIncludes: "undefined" },
      { code: 2339, line: 6, messageIncludes: "toUpperCase" },
    ],
  },
  insight: [
    "Migrate incrementally: allowJs, then checkJs, then rename files.",
    "Runtime behavior stays JavaScript — types do not deploy a new Node.",
    "Start with boundary modules (HTTP, env, DB rows) where bugs cluster.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Best first migration step for a large Node service?",
      choices: [
        { id: "a", text: "Rewrite every file overnight" },
        { id: "b", text: "Add TypeScript beside JS and tighten gradually" },
        { id: "c", text: "Disable all strict flags forever" },
        { id: "d", text: "Delete tests" },
      ],
      answerId: "b",
      explanation: "Incremental adoption keeps the service shippable.",
    },
  ],
  exercise: {
    prompt: "Narrow id to a single string before toUpperCase.",
    starter: `type Req = { query: { id?: string | string[] } };
type Res = { end: (body: string) => void };

function handler(req: Req, res: Res): void {
  const id = req.query.id;
  res.end(id.toUpperCase());
}
`,
    assertion: "no-errors",
    hints: ['typeof id === "string"'],
    solution: `type Req = { query: { id?: string | string[] } };
type Res = { end: (body: string) => void };

function handler(req: Req, res: Res): void {
  const id = req.query.id;
  if (typeof id !== "string") {
    res.end("");
    return;
  }
  res.end(id.toUpperCase());
}
`,
  },
};
