import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "publishing-types",
  title: "Publishing a typed package",
  tier: "advanced",
  track: "node-migration",
  order: 21,
  summary:
    "Declaration emit, declaration maps, the types condition per export, and checking the result with a tool rather than hope.",
  prerequisites: ["dual-package-hazard", "declaration-emit"],
  keywords: [
    "publishing",
    "declaration",
    "arethetypeswrong",
    "d.ts",
    "public api",
  ],
  problem:
    "A package's types are only correct in the configuration its author used, and consumers find out at install time.",
  js: {
    code: `// JS packages ship .js — types are optional afterthoughts.
// "types" in package.json may point at missing or wrong files.
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "Without verified .d.ts, consumers guess the API.",
  },
  ts: {
    code: `// Public API should use portable, named types — not inferred internals.
type Internal = { secret: string };
export type PublicUser = { id: string; name: string };

export function toPublic(u: Internal): PublicUser {
  return { id: "1", name: u.secret };
}

// Shipping a function whose return type cannot be named breaks declaration emit.
const cache = new Map<string, PublicUser>();
export function cached(id: string) {
  return cache.get(id);
}

const u = cached("1");
const n: number = u;
`,
    highlights: [{ start: 15, end: 15 }],
    caption: "Public returns should be explicit; optional Map values are | undefined.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 16,
        messageIncludes: "undefined",
      },
    ],
  },
  insight: [
    "Emit declaration files and verify them with arethetypeswrong / publint.",
    "Prefer explicit return types on exports so .d.ts does not reference private names.",
    "Align package.json exports types conditions with the JS entrypoints you ship.",
  ],
  security: {
    title: "Declaration soundness is an API contract",
    body: "Lying .d.ts files cause consumers to trust shapes that do not exist at runtime — including security-sensitive fields. Treat incorrect publish types as a contract breach.",
    severity: "caution",
  },
  quiz: [
    {
      id: "pub-q",
      prompt: "Why annotate exported return types explicitly?",
      choices: [
        { id: "a", text: "Runtime speed" },
        { id: "b", text: "Declaration emit may fail if inferred types cannot be named" },
        { id: "c", text: "ESLint requires it always" },
        { id: "d", text: "Node ignores .d.ts otherwise" },
      ],
      answerId: "b",
      explanation:
        "Inferred types that reference private types produce “cannot be named” on emit.",
    },
  ],
  exercise: {
    prompt:
      "Export function add(a: number, b: number): number with an explicit return type.",
    starter: `export function add(a: number, b: number) {
  return a + b;
}
`,
    assertion: "no-errors",
    hints: ["Add : number after the parameter list."],
    solution: `export function add(a: number, b: number): number {
  return a + b;
}
`,
  },
};
