import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "inferring-type-arguments",
  title: "Where type arguments come from",
  tier: "intermediate",
  track: "functions",
  order: 9,
  summary:
    "Inference reads the arguments you passed. When it guesses well, when it guesses too wide, and when to write the type argument out by hand.",
  prerequisites: ["generic-constraints", "inference-and-widening"],
  keywords: ["inference", "type argument", "explicit", "candidate", "widening"],
  problem:
    "Tuple contents forget their types. Shared helpers amplify the hole: wrong arguments, erased returns, or forgotten type relationships spread to every caller. Callers copy the signature they see — if it lies, the lie spreads.",
  solution:
    "Inferred [number, string]. Second element is not number. TypeScript infers type arguments from call-site values. Multiple parameters can carry different type args. Hover in the editor to confirm inference before annotating. Keep escapes rare — and comment the lie when you need one.",
  js: {
    code: `function pair(a, b) { return [a, b]; }
const p = pair(1, 'x');
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "Tuple contents forget their types.",
  },
  ts: {
    code: `function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}
const p = pair(1, "x");
const a: number = p[0];
const b: string = p[1];
const bad: number = p[1];
`,
    highlights: [{ start: 7, end: 7 }],
    caption: "Inferred [number, string]. Second element is not number.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 7,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "TypeScript infers type arguments from call-site values.",
    "Multiple parameters can carry different type args.",
    "Hover in the editor to confirm inference before annotating.",
  ],
};
