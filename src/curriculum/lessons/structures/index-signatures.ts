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
    "Open string key bag with mixed values. Object and class APIs leak through optional fields, mutable shared state, or signatures that do not match how instances are actually used. Tighten the shape so consumers cannot rely on properties you `never` meant to promise. Consumers will depend on whatever the type allows, including accidents.",
  solution:
    "Index signature number forbids string values. Index signatures describe open-ended key sets. They weaken specific known keys — use carefully. Prefer `Record<K,V>` or maps for many dynamic keys. Public APIs first; loosen only where you can name the tradeoff.",
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
