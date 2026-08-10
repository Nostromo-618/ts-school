import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "array-narrowing",
  title: "Narrowing arrays and their elements",
  tier: "intermediate",
  track: "types",
  order: 16,
  summary:
    "`Array.isArray`, .find returning T | `undefined`, and why .filter(Boolean) does not remove `null` from the type unless you help it.",
  prerequisites: ["arrays-and-tuples", "truthiness-narrowing"],
  keywords: [
    "Array.isArray",
    "filter",
    "find",
    "predicate",
    "noUncheckedIndexedAccess",
  ],
  problem:
    "Assuming items[0] exists. The type system is supposed to make that state unrepresentable — if it does not, callers invent ad-hoc checks and still miss a branch. Model the domain so the illegal mix cannot be constructed. Prefer a model where the illegal state cannot be written down.",
  solution:
    "first returns string | `undefined`. Indexing may yield `undefined` — narrow before using methods. `noUncheckedIndexedAccess` makes this the default; model it even without the flag. Empty arrays are the classic production crash. Do not silence the diagnostic without restoring the shape.",
  js: {
    code: `function first(items) {
  return items[0].toUpperCase();
}
`,
    highlights: [{ start: 2, end: 2 }],
    caption: "Assuming items[0] exists.",
  },
  ts: {
    code: `function first(items: string[]): string | undefined {
  const head = items[0];
  if (head === undefined) return undefined;
  return head.toUpperCase();
}

const boom: string = first([]);
`,
    highlights: [{ start: 8, end: 8 }],
    caption: "first returns string | `undefined`.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 7,
        messageIncludes: "Type 'string | undefined' is not assignable to t",
      },
    ],
  },
  insight: [
    "Indexing may yield `undefined` — narrow before using methods.",
    "`noUncheckedIndexedAccess` makes this the default; model it even without the flag.",
    "Empty arrays are the classic production crash.",
  ],
};
