import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "erasable-syntax-and-type-stripping",
  title: "Erasable syntax and native type stripping",
  tier: "intermediate",
  track: "foundations",
  order: 15,
  summary:
    "Node can now run .ts files by deleting the types. What that rules out — enums, parameter properties, namespaces — and why erasableSyntaxOnly exists.",
  prerequisites: ["types-are-erased", "tsconfig-essentials"],
  keywords: [
    "type stripping",
    "erasableSyntaxOnly",
    "node",
    "enum",
    "no build",
    "amaro",
  ],
  problem:
    "Some TypeScript syntax emits real JavaScript, so a file using it cannot be run by simply deleting the types.",
  js: {
    code: `// Node type stripping runs without emit
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Enums/namespaces need transform — not erasable.",
  },
  ts: {
    code: `// Erasable syntax: types, annotations, import type.
type Point = { x: number; y: number };
export function length(p: Point): number {
  return Math.hypot(p.x, p.y);
}
const n: number = length({ x: 3, y: 4 });
const bad: string = length({ x: 3, y: 4 });
`,
    highlights: [{ start: 7, end: 7 }],
    caption: "Annotations strip cleanly. length returns number.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 7,
        messageIncludes: "Type 'number' is not assignable to type 'string'",
      },
    ],
  },
  insight: [
    "Type-only syntax can be stripped without a full emit pipeline.",
    "Enums, namespaces, and parameter properties may need transformation.",
    "Prefer erasable forms when targeting Node type stripping.",
  ],
};
