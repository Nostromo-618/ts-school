import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "type-only-vs-value-imports",
  title: "Type imports and what ends up in the bundle",
  tier: "intermediate",
  track: "tooling",
  order: 14,
  summary:
    "import type, inline type specifiers, side-effect imports, and importsNotUsedAsValues' successor — controlling exactly what survives compilation.",
  prerequisites: ["isolatedmodules-and-verbatimmodulesyntax"],
  keywords: ["import type", "side effect", "elision", "bundle", "tree shaking"],
  problem:
    "An import used only as a type is usually erased, and the one time it is not, a server module ends up in a client bundle.",
  js: {
    code: `import { User } from './user';
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Importing a type as if it were a runtime value.",
  },
  ts: {
    code: `type User = { id: string };
declare function load(): User;

import type { User as UserType } from "./types";
const u: User = load();
const bad: number = u.id;
`,
    highlights: [{ start: 6, end: 6 }],
    caption: "import type is erased. User.id is string.",
    expectedDiagnostics: [
      {
        code: 2307,
        line: 4,
        messageIncludes: "Cannot find module './types' or its correspondin",
      },
      {
        code: 2322,
        line: 6,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "import type / export type erase at emit.",
    "Mixing type and value from one module is fine with inline type modifiers.",
    "`verbatimModuleSyntax` makes mistakes loud.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Why prefer `import type` for type-only symbols?",
      choices: [
        { id: "a", text: "It loads the module twice" },
        {
          id: "b",
          text: "Those imports erase at emit and avoid accidental runtime deps",
        },
        { id: "c", text: "It disables type checking" },
        { id: "d", text: "It is required for every import in TS 7" },
      ],
      answerId: "b",
      explanation:
        "Type-only imports are erased. `verbatimModuleSyntax` makes mixing type/value mistakes loud.",
    },
  ],
};
