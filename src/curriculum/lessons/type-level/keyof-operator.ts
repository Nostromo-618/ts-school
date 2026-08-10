import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "keyof-operator",
  title: "keyof",
  tier: "intermediate",
  track: "type-level",
  order: 1,
  summary:
    "The union of an object type's keys. The first operator that computes a type from a type, and the one every other lesson here builds on.",
  prerequisites: ["interfaces-intro", "union-types"],
  keywords: ["keyof", "keys", "union", "operator", "type query"],
  problem:
    "A helper that takes a property name accepts `any` string, so a renamed field breaks at runtime instead of at build time.",
  js: {
    code: `function get(obj, key) { return obj[key]; }
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Dynamic key access with no key constraint.",
  },
  ts: {
    code: `type User = { id: string; age: number };
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const u: User = { id: "1", age: 2 };
const id: string = get(u, "id");
const bad = get(u, "nope");
`,
    highlights: [{ start: 7, end: 7 }],
    caption: "`keyof` User forbids `unknown` keys.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 7,
        messageIncludes: "Argument of type '\"nope\"' is not assignable to p",
      },
    ],
  },
  insight: [
    "`keyof` T is the union of keys of T.",
    "Pair with T[K] for safe property access.",
    "`keyof` `any` is string | number | symbol — avoid `any`.",
  ],
};
