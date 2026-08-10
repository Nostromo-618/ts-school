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
    "arr[0] is typed T even on an empty array, so the safest-looking line in the file is the one that throws. Look at the left pane: assuming items[0] exists. Without a typechecker there is nothing to refuse that misuse while you type — only later, on a live path.",
  solution:
    "first returns string | `undefined`. Indexing may yield `undefined` — narrow before using methods. `noUncheckedIndexedAccess` makes this the default; model it even without the flag. Empty arrays are the classic production crash. Hold the dual panes side by side: the left side is the silent failure; the right side is where the checker finally refuses it.",
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
