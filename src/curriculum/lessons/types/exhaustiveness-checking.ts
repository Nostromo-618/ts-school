import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "exhaustiveness-checking",
  title: "Exhaustiveness checking",
  tier: "intermediate",
  track: "types",
  order: 13,
  summary:
    "Assign the narrowed value to never in the default branch and the compiler tells you the day someone adds a variant you did not handle.",
  prerequisites: ["discriminated-unions"],
  keywords: ["never", "exhaustive", "switch", "assertNever", "default case"],
  problem:
    "Adding a case to a union is a one-line change; finding the nine switch statements that needed updating is not.",
  js: {
    code: `function area(shape) {
  if (shape.kind === "circle") return Math.PI * shape.r ** 2;
  if (shape.kind === "square") return shape.size ** 2;
}
`,
    highlights: [{ start: 1, end: 4 }],
    caption: "Missing triangle case returns undefined.",
  },
  ts: {
    code: `type Shape =
  | { kind: "circle"; r: number }
  | { kind: "square"; size: number }
  | { kind: "triangle"; base: number; height: number };

function assertNever(x: never): never {
  throw new Error("unexpected");
}

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.r ** 2;
    case "square":
      return shape.size ** 2;
    default:
      return assertNever(shape);
  }
}
`,
    highlights: [{ start: 18, end: 18 }],
    caption: "default: assertNever(shape) errors until triangle is handled.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 17,
        messageIncludes: 'Argument of type \'{ kind: "triangle"; base: numb',
      },
    ],
  },
  insight: [
    "assertNever(shape) in the default branch forces new variants to be handled.",
    "Without it, forgetting a case returns undefined silently in JS.",
    "Prefer switch over if-chains for tagged unions.",
  ],
};
