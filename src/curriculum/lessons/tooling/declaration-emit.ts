import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "declaration-emit",
  title: "Declaration emit",
  tier: "advanced",
  track: "tooling",
  order: 18,
  summary:
    "How .d.ts files are generated, why 'the inferred type cannot be named' happens, declaration maps, and the isolatedDeclarations shortcut.",
  prerequisites: ["project-references", "declaration-files-intro"],
  keywords: [
    "declaration",
    "d.ts",
    "isolatedDeclarations",
    "declaration map",
    "portability",
  ],
  problem:
    "A type that compiles fine cannot be written into a declaration file, and the error names a file you have never opened.",
  js: {
    code: `// JS has no declaration emit — consumers read the source or nothing.
export function make() {
  return { hidden: true };
}
`,
    highlights: [{ start: 2, end: 4 }],
    caption: "Without .d.ts, the public API is whatever you export in JS.",
  },
  ts: {
    code: `type Hidden = { secret: number };

// Inferred return references Hidden — bad for declaration emit portability.
export function make() {
  const value: Hidden = { secret: 1 };
  return value;
}

// Prefer an exported alias for the public surface:
export type Public = { secret: number };
export function makePublic(): Public {
  return { secret: 1 };
}

const x: string = makePublic();
`,
    highlights: [{ start: 15, end: 15 }],
    caption: "Explicit Public return types keep .d.ts self-contained.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 15,
        messageIncludes: "Public",
      },
    ],
  },
  insight: [
    "declaration: true writes .d.ts; declarationMap helps editors jump to source.",
    "isolatedDeclarations requires enough annotations for emit without typechecking inference.",
    "Export the types you return — do not leak private aliases into public signatures.",
  ],
  quiz: [
    {
      id: "decl-q",
      prompt: "Typical cause of “inferred type cannot be named”?",
      choices: [
        { id: "a", text: "Using string" },
        {
          id: "b",
          text: "Exporting a value whose inferred type references a non-exported type",
        },
        { id: "c", text: "Missing node_modules" },
        { id: "d", text: "Using async" },
      ],
      answerId: "b",
      explanation:
        "The emitter cannot write a .d.ts that names a private type.",
    },
  ],
  exercise: {
    prompt:
      "Export type Point = { x: number; y: number } and function origin(): Point.",
    starter: `function origin() {
  return { x: 0, y: 0 };
}
`,
    assertion: "no-errors",
    hints: ["Export the type and annotate the return."],
    solution: `export type Point = { x: number; y: number };
export function origin(): Point {
  return { x: 0, y: 0 };
}
`,
  },
};
