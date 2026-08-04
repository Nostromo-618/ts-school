import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "overload-resolution-order",
  title: "How an overload is chosen",
  tier: "advanced",
  track: "functions",
  order: 20,
  summary:
    "The checker tries signatures in declaration order and takes the first that fits. Why that makes ordering load-bearing and generic overloads risky.",
  prerequisites: ["function-overloads", "assignability-rules"],
  keywords: ["overload", "resolution", "order", "arity", "declaration"],
  problem:
    "Adding a convenience overload at the top of the list quietly captures calls that were meant for the one below it.",
  js: {
    code: `// JS: one function, many call shapes — documentation only.
function read(source, encoding) {
  if (typeof source === "number") return Buffer.alloc(0);
  return String(source);
}
read(10);
read("file.txt", "utf8");
`,
    highlights: [{ start: 2, end: 5 }],
    caption: "JS overloads are comments; any call shape is allowed.",
  },
  ts: {
    code: `function read(fd: number): Uint8Array;
function read(path: string, encoding: string): string;
function read(
  source: number | string,
  encoding?: string,
): Uint8Array | string {
  if (typeof source === "number") return new Uint8Array();
  return String(source);
}

const a = read(3);
const b = read("notes.txt", "utf8");

// First matching overload wins — number fits the first signature.
const c: string = read(3);
`,
    highlights: [{ start: 14, end: 14 }],
    caption: "Declaration order picks the fd overload; assigning to string fails.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 15,
        messageIncludes: "Uint8Array",
      },
    ],
  },
  insight: [
    "Overloads are tried top-to-bottom; put more specific signatures first.",
    "The implementation signature is not visible to callers — only the overload list is.",
    "Generic overloads are easy to get wrong; prefer unions or separate functions when possible.",
  ],
  quiz: [
    {
      id: "overload-order",
      prompt: "If two overloads both match a call, which is chosen?",
      choices: [
        { id: "a", text: "The most specific by structural subtype depth" },
        { id: "b", text: "The first in declaration order that matches" },
        { id: "c", text: "The implementation signature" },
        { id: "d", text: "A union of both return types always" },
      ],
      answerId: "b",
      explanation:
        "TypeScript walks the overload list in order and stops at the first match.",
    },
  ],
  exercise: {
    prompt:
      "Declare overloads for len(s: string): number and len(arr: unknown[]): number with a shared implementation.",
    starter: `function len(x: string | unknown[]): number {
  return x.length;
}

const n = len("hi");
const m = len([1, 2]);
`,
    assertion: "no-errors",
    hints: ["Add two overload signatures above the implementation."],
    solution: `function len(s: string): number;
function len(arr: unknown[]): number;
function len(x: string | unknown[]): number {
  return x.length;
}

const n = len("hi");
const m = len([1, 2]);
void n;
void m;
`,
  },
};
