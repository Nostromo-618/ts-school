import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "index-signatures",
  title: "Index signatures",
  tier: "intermediate",
  track: "structures",
  order: 10,
  summary:
    "[key: string]: T describes an open bag. What it buys, what it costs, and why `Record` and a mapped type are usually the better tool.",
  prerequisites: ["interfaces-intro", "type-aliases-intro"],
  keywords: ["index signature", "Record", "dictionary", "open shape", "key"],
  problem:
    "An index signature says every key exists, so a typo'd lookup type-checks and returns `undefined`. Look at the left pane: open string key bag with mixed values. Without a typechecker there is nothing to refuse that misuse while you type — only later, on a live path.",
  solution:
    "Index signature number forbids string values. Index signatures describe open-ended key sets. They weaken specific known keys — use carefully. Prefer `Record<K,V>` or maps for many dynamic keys. That is the whole move: make the broken path unrepresentable (or at least loudly illegal) before it reaches production.",
  js: {
    code: `const bag = {};
bag[key] = value;
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "Open string key bag with mixed values.",
  },
  ts: {
    code: `type Bag = { [key: string]: number };
const bag: Bag = {};
bag["score"] = 1;
bag["label"] = "x";
`,
    highlights: [{ start: 4, end: 4 }],
    caption: "Index signature number forbids string values.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 4,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "Index signatures describe open-ended key sets.",
    "They weaken specific known keys — use carefully.",
    "Prefer `Record<K,V>` or maps for many dynamic keys.",
  ],
};
