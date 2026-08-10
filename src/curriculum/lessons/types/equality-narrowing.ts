import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "equality-narrowing",
  title: "Narrowing by equality",
  tier: "beginner",
  track: "types",
  order: 10,
  summary:
    "===, !==, switch, and the double-equals-`null` idiom all narrow. This is the machinery behind every tagged union you will write later.",
  prerequisites: ["literal-types", "narrowing-with-typeof"],
  keywords: ["equality", "switch", "discriminant", "===", "null"],
  problem:
    "Tagged shapes work only if every caller sets kind correctly. The type system is supposed to make that state unrepresentable — if it does not, callers invent ad-hoc checks and still miss a branch. Model the domain so the illegal mix cannot be constructed. Prefer a model where the illegal state cannot be written down.",
  solution:
    "Equality on kind discriminates the union. switch (shape.kind) does the same, often more readably for many variants. x == `null` narrows out both `null` and `undefined` in one check. Public APIs first; loosen only where you can name the tradeoff.",
  js: {
    code: `function area(shape) {
  if (shape.kind === "circle") return Math.PI * shape.radius ** 2;
  return shape.width * shape.height;
}

area({ kind: "circle", radius: 2 });
`,
    highlights: [{ start: 2, end: 3 }],
    caption: "Tagged shapes work only if every caller sets kind correctly.",
  },
  ts: {
    code: `type Circle = { kind: "circle"; radius: number };
type Rect = { kind: "rect"; width: number; height: number };
type Shape = Circle | Rect;

function area(shape: Shape): number {
  // Without narrowing, radius is not on Shape.
  return Math.PI * shape.radius ** 2;
}
`,
    highlights: [{ start: 7, end: 7 }],
    caption: "Equality on kind discriminates the union.",
    expectedDiagnostics: [{ code: 2339, line: 7, messageIncludes: "radius" }],
  },
  insight: [
    'Comparing a discriminant field (kind === "circle") narrows the whole object.',
    "switch (shape.kind) does the same, often more readably for many variants.",
    "x == `null` narrows out both `null` and `undefined` in one check.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "What makes kind a good discriminant?",
      choices: [
        { id: "a", text: "It is optional on every variant" },
        { id: "b", text: "Each variant has a unique literal type for kind" },
        { id: "c", text: "It is typed as string" },
        { id: "d", text: "It is computed at runtime randomly" },
      ],
      answerId: "b",
      explanation: "Literal uniqueness lets equality eliminate other variants.",
    },
  ],
  exercise: {
    prompt: "Narrow on kind before reading radius or width.",
    starter: `type Circle = { kind: "circle"; radius: number };
type Rect = { kind: "rect"; width: number; height: number };
type Shape = Circle | Rect;

function area(shape: Shape): number {
  return Math.PI * shape.radius ** 2;
}
`,
    assertion: "no-errors",
    hints: ['if (shape.kind === "circle") ... else ...'],
    solution: `type Circle = { kind: "circle"; radius: number };
type Rect = { kind: "rect"; width: number; height: number };
type Shape = Circle | Rect;

function area(shape: Shape): number {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
  }
  return shape.width * shape.height;
}
`,
  },
};
