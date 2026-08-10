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
    "Dynamic key access with no key constraint. A type-level transform that widens or distributes incorrectly will type-check while describing the wrong value. Read the conditional or mapped type the way you would read a function — inputs, outputs, and failure cases. Hover the resulting type; if it widened, the transform is wrong.",
  solution:
    "`keyof T` produces the union of known keys, so `obj[key]` stays checked when `key` is typed as `keyof T`. Indexing with a plain `string` reopens `any`-like holes under default settings. Prefer `keyof` (and mapped types) when you walk an object's properties; widen to `string` only when the key truly comes from outside the type.",
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
