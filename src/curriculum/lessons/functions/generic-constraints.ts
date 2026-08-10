import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "generic-constraints",
  title: "Constraining a type parameter",
  tier: "intermediate",
  track: "functions",
  order: 8,
  summary:
    "T extends { id: string } lets a generic function actually use its argument. Constraints are how a hole gets a shape without losing the caller's specifics.",
  prerequisites: ["generics-intro"],
  keywords: ["extends", "constraint", "bounded", "keyof", "generic"],
  problem:
    "An unconstrained type parameter can be anything, so the function body can do nothing with it.",
  js: {
    code: `function len(x) { return x.length; }
len(1);
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "Reading .length on anything.",
  },
  ts: {
    code: `function len<T extends { length: number }>(x: T): number {
  return x.length;
}
len("hi");
len([1, 2]);
len(1);
`,
    highlights: [{ start: 6, end: 6 }],
    caption: "Constraint requires length. number does not qualify.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 6,
        messageIncludes: "Argument of type 'number' is not assignable to p",
      },
    ],
  },
  insight: [
    "extends constrains what T can be.",
    "Constraints unlock property access inside the function.",
    "Prefer precise constraints over `any`.",
  ],
};
