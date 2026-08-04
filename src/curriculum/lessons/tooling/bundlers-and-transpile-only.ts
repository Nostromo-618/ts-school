import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "bundlers-and-transpile-only",
  title: "Who is actually checking your types?",
  tier: "advanced",
  track: "tooling",
  order: 19,
  summary:
    "esbuild, swc, Vite, and Node's type stripping all delete types without reading them. Where the real gate goes in a modern pipeline.",
  prerequisites: [
    "isolatedmodules-and-verbatimmodulesyntax",
    "running-typescript-in-node",
  ],
  keywords: [
    "esbuild",
    "swc",
    "vite",
    "transpile only",
    "type check",
    "pipeline",
  ],
  problem:
    "The build is fast because it never type-checked anything, and the only thing that did was the editor on one developer's machine.",
  js: {
    code: `// Fast bundlers strip TypeScript-looking syntax without proving types.
// A broken call still ships if nothing runs tsc.
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "Transpile-only ≠ typechecked.",
  },
  ts: {
    code: `type PipelineStep = "transpile" | "typecheck" | "test";

const viteDev: PipelineStep[] = ["transpile"];
const ci: PipelineStep[] = ["typecheck", "test", "transpile"];

function hasTypecheck(steps: PipelineStep[]): boolean {
  return steps.includes("typecheck");
}

const ok = hasTypecheck(ci);
const claim: true = hasTypecheck(viteDev);
void ok;
`,
    highlights: [{ start: 11, end: 11 }],
    caption: "Dev transpile pipelines often omit typecheck — CI must not.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 11,
        messageIncludes: "boolean",
      },
    ],
  },
  insight: [
    "Separate “emit JS” from “prove types” — both are required, different tools.",
    "Run tsc --noEmit (or vue-tsc) in CI even when Vite/esbuild build the artifacts.",
    "isolatedModules/verbatimModuleSyntax keep transpile-only tools honest about syntax.",
  ],
  quiz: [
    {
      id: "bundle-q",
      prompt: "Does Vite’s default TS transform typecheck?",
      choices: [
        { id: "a", text: "Yes, fully" },
        { id: "b", text: "No — it transpile/strips; checking is separate" },
        { id: "c", text: "Only in production" },
        { id: "d", text: "Only for .d.ts" },
      ],
      answerId: "b",
      explanation:
        "Bundlers optimize for emit speed; tsc remains the checker.",
    },
  ],
  exercise: {
    prompt:
      "Type Gate = \"typecheck\" | \"lint\" and require both in a CI list.",
    starter: `type Gate = "typecheck" | "lint";
const ci: Gate[] = ["typecheck", "lint"];
`,
    assertion: "no-errors",
    hints: ["Already almost done — keep both gates."],
    solution: `type Gate = "typecheck" | "lint";
const ci: Gate[] = ["typecheck", "lint"];
function required(gates: Gate[]): boolean {
  return gates.includes("typecheck") && gates.includes("lint");
}
void required(ci);
`,
  },
};
