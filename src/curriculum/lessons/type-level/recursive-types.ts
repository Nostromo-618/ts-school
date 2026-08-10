import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "recursive-types",
  title: "Recursive types",
  tier: "advanced",
  track: "type-level",
  order: 14,
  summary:
    "Self-referential types for trees, linked structures, and JSON. How lazy resolution makes them possible and where it gives up.",
  prerequisites: ["type-aliases-intro", "conditional-types-intro"],
  keywords: ["recursive type", "json", "tree", "self reference", "lazy"],
  problem:
    "JSON has no fixed shape, so the honest type for it is recursive and most codebases substitute `any` instead. Look at the left pane: without a recursive type, nested JSON is unchecked hope. Edit-time tools are silent, so the mistake travels with the deploy until a concrete input detonates it.",
  solution:
    "A recursive alias names the real JSON grammar. Type aliases may refer to themselves; interfaces may too via property types. The checker expands recursion lazily — it does not unfold infinitely at definition time. Prefer Json over `any` at boundaries; pair with a runtime parse that enforces the same grammar. Once the types name the contract, the same edit that would have shipped quietly becomes a red squiggle at the call site instead.",
  js: {
    code: `// JS: JSON is "whatever" — any nested object or array.
function readConfig(raw) {
  return JSON.parse(raw); // any shape, no recursion named
}

const cfg = readConfig('{"db":{"host":"x"}}');
cfg.db.host.toUpperCase(); // hope the nesting is right
`,
    highlights: [{ start: 3, end: 7 }],
    caption: "Without a recursive type, nested JSON is unchecked hope.",
  },
  ts: {
    code: `type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

const ok: Json = { db: { host: "localhost", port: 5432 } };

const bad: Json = { db: { host: () => "nope" } };
// functions are not JSON
`,
    highlights: [
      { start: 1, end: 7 },
      { start: 11, end: 12 },
    ],
    caption: "A recursive alias names the real JSON grammar.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 11,
        messageIncludes: "not assignable",
      },
    ],
  },
  insight: [
    "Type aliases may refer to themselves; interfaces may too via property types.",
    "The checker expands recursion lazily — it does not unfold infinitely at definition time.",
    "Prefer Json over `any` at boundaries; pair with a runtime parse that enforces the same grammar.",
  ],
  quiz: [
    {
      id: "rec-lazy",
      prompt:
        "Why does `type Json = … | Json[] | …` compile instead of looping forever?",
      choices: [
        { id: "a", text: "TypeScript forbids nested arrays" },
        { id: "b", text: "Expansion is lazy and demand-driven" },
        { id: "c", text: "Json is erased before checking" },
        { id: "d", text: "Only interfaces may recurse" },
      ],
      answerId: "b",
      explanation:
        "The checker expands recursive aliases when needed for a check, not exhaustively at parse time.",
    },
  ],
  exercise: {
    prompt:
      "Define a Tree<T> type: a node with value: T and children: Tree<T>[]. Then create a valid number tree.",
    starter: `type Tree<T> = unknown; // TODO

const t: Tree<number> = { value: 1, children: [] };
`,
    assertion: "no-errors",
    hints: ["type Tree<T> = { value: T; children: Tree<T>[] }"],
    solution: `type Tree<T> = { value: T; children: Tree<T>[] };

const t: Tree<number> = {
  value: 1,
  children: [{ value: 2, children: [] }],
};
void t;
`,
  },
};
