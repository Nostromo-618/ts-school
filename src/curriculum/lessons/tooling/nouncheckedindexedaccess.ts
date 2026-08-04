import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "nouncheckedindexedaccess",
  title: "noUncheckedIndexedAccess",
  tier: "intermediate",
  track: "tooling",
  order: 9,
  summary:
    "Indexing an array or a record yields T | undefined, which is the truth. Not part of strict, and the highest-value flag outside it.",
  prerequisites: ["array-narrowing", "index-signatures"],
  keywords: [
    "noUncheckedIndexedAccess",
    "array",
    "index",
    "undefined",
    "record",
  ],
  problem:
    "map[key] is typed as present for every key, so a cache miss is typed identically to a cache hit.",
  js: {
    code: `const first = arr[0];
first.toUpperCase();
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "Indexing assumed defined.",
  },
  ts: {
    code: `// Host baseline does not enable noUncheckedIndexedAccess.
// Model the safer type explicitly:
function first(arr: string[]): string | undefined {
  return arr[0];
}
const s: string = first(["a"]);
`,
    highlights: [{ start: 6, end: 6 }],
    caption: "Model index access as T | undefined. Assignment to string fails.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 6,
        messageIncludes: "Type 'string | undefined' is not assignable to t",
      },
    ],
  },
  insight: [
    "noUncheckedIndexedAccess adds | undefined to index reads.",
    "Even without the flag, treat indexes as optional in Node services.",
    "Narrow before use.",
  ],
};
