import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "project-references",
  title: "Project references and monorepos",
  tier: "advanced",
  track: "tooling",
  order: 17,
  summary:
    "Splitting a repository into buildable units, tsc --build, and the difference between referencing a project and importing its source.",
  prerequisites: ["incremental-builds", "package-json-exports-and-types"],
  keywords: [
    "project references",
    "monorepo",
    "composite",
    "tsc --build",
    "workspace",
  ],
  problem:
    "A monorepo where every package sees every other package's source has one enormous compilation unit and no boundaries at all.",
  js: {
    code: `// JS monorepos often import source across packages with no build graph.
// Everything is one pile of files to the bundler.
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "No project graph means no incremental typecheck boundaries.",
  },
  ts: {
    code: `type TsConfig = {
  composite?: boolean;
  references?: { path: string }[];
};

const root: TsConfig = {
  references: [{ path: "./packages/core" }, { path: "./packages/app" }],
};

const core: TsConfig = { composite: true };

// Prefer boolean checks over literal true/false assignments from optional fields.
const isComposite = core.composite === true;
const bad: string = isComposite;
void root;
`,
    highlights: [{ start: 14, end: 14 }],
    caption: "composite marks buildable units in the reference graph.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 14,
        messageIncludes: "boolean",
      },
    ],
  },
  insight: [
    "composite: true + references build a DAG that `tsc -b` can check incrementally.",
    "Prefer depending on emitted declarations of referenced projects, not their raw src across the graph.",
    "Solution-style roots list references without compiling app code themselves.",
  ],
  quiz: [
    {
      id: "pref-q",
      prompt: "What does composite enable?",
      choices: [
        { id: "a", text: "Skipping typecheck forever" },
        { id: "b", text: "Project references / tsc --build participation" },
        { id: "c", text: "Only prettier" },
        { id: "d", text: "DOM libs" },
      ],
      answerId: "b",
      explanation:
        "composite marks a project as a referenceable build unit.",
    },
  ],
  exercise: {
    prompt:
      "Type Ref = { path: string } and a root config with references: Ref[].",
    starter: `type Ref = { path: string };
const root = { references: [{ path: "./pkg" }] };
`,
    assertion: "no-errors",
    hints: ["Annotate const root: { references: Ref[] }"],
    solution: `type Ref = { path: string };
const root: { references: Ref[] } = {
  references: [{ path: "./pkg" }],
};
void root;
`,
  },
};
