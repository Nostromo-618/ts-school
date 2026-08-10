import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "type-level-performance",
  title: "The cost of clever types",
  tier: "advanced",
  track: "type-level",
  order: 20,
  summary:
    "Instantiation counts, caching, and why one recursive helper can add seconds to every build in the repository that imports it.",
  prerequisites: [
    "recursive-conditional-types",
    "type-level-assertions-and-equality",
  ],
  keywords: [
    "performance",
    "instantiation",
    "trace",
    "compile time",
    "recursion",
  ],
  problem:
    "A clever type in a shared package makes the editor lag in every consumer, and the cost is invisible where it was written.",
  js: {
    code: `// JS analogy: a recursive utility with no memoization.
function deepKeys(obj, path = "") {
  return Object.keys(obj).flatMap((k) => {
    const p = path ? path + "." + k : k;
    const v = obj[k];
    return v && typeof v === "object" ? deepKeys(v, p) : [p];
  });
}
// Fine for small objects; catastrophic for huge trees — types have the same shape.
`,
    highlights: [{ start: 2, end: 8 }],
    caption: "Unchecked recursion is expensive in values and in types.",
  },
  ts: {
    code: `// Illustrative: a deep key walker — prefer simpler exported APIs.
type DeepKeys<T> = T extends object
  ? {
      [K in keyof T & string]:
        | K
        | \`\${K}.\${DeepKeys<T[K]>}\`;
    }[keyof T & string]
  : never;

type Huge = { a: { b: { c: { d: { e: string } } } } };
type Keys = DeepKeys<Huge>;

// Accidental blow-up: assigning a wrong key still type-checks the whole tree.
const k: Keys = "a.b.x";
`,
    highlights: [
      { start: 2, end: 8 },
      { start: 14, end: 14 },
    ],
    caption: "Deep key unions grow fast; bad keys still cost expansion.",
    expectedDiagnostics: [
      {
        code: 2820,
        line: 14,
        messageIncludes: "a.b.x",
      },
    ],
  },
  insight: [
    "Every conditional/mapped expansion is work; shared packages multiply that work by consumer count.",
    "Prefer interfaces for object shapes when possible — they cache better than complex aliases.",
    "Profile with --generateTrace / --extendedDiagnostics before “optimizing” by guesswork.",
  ],
  quiz: [
    {
      id: "perf-shared",
      prompt:
        "Why is a heavy type in a shared package worse than the same type in an app-local file?",
      choices: [
        { id: "a", text: "Shared packages cannot use generics" },
        { id: "b", text: "Every importer pays the instantiation cost" },
        { id: "c", text: "pnpm duplicates the type" },
        { id: "d", text: "Editors ignore app-local types" },
      ],
      answerId: "b",
      explanation:
        "Each project that imports the helper re-instantiates it across its call sites.",
    },
  ],
  exercise: {
    prompt:
      "Replace a deep recursive Keys helper usage with a simple `keyof` for a flat config type. Export type FlatKeys = `keyof` Config.",
    starter: `type Config = { host: string; port: number };
type FlatKeys = string; // TODO: keyof Config

const k: FlatKeys = "nope";
`,
    assertion: "no-errors",
    hints: ["type FlatKeys = `keyof` Config; use a valid key in the const."],
    solution: `type Config = { host: string; port: number };
type FlatKeys = keyof Config;

const k: FlatKeys = "host";
void k;
`,
  },
};
