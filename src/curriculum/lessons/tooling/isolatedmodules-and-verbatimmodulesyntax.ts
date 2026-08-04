import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "isolatedmodules-and-verbatimmodulesyntax",
  title: "isolatedModules and verbatimModuleSyntax",
  tier: "intermediate",
  track: "tooling",
  order: 12,
  summary:
    "What single-file transpilers cannot know, why import type exists, and how these flags keep tsc and esbuild agreeing.",
  prerequisites: ["esm-imports-and-exports", "running-typescript-in-node"],
  keywords: [
    "isolatedModules",
    "verbatimModuleSyntax",
    "import type",
    "transpile",
    "esbuild",
  ],
  problem:
    "A re-exported type compiles under tsc and produces a runtime import of something that does not exist under esbuild.",
  js: {
    code: `export { type User } from './user';
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Type and value imports look the same.",
  },
  ts: {
    code: `type User = { id: string };
// Under verbatimModuleSyntax, type-only re-exports need type modifier.
export type { User };
import { User as ValueUser } from "./user";
`,
    highlights: [{ start: 4, end: 4 }],
    caption:
      "Cannot resolve ./user — illustrates why type-only imports must be marked for isolated transpile.",
    expectedDiagnostics: [
      {
        code: 2307,
        line: 4,
        messageIncludes: "Cannot find module './user' or its corresponding",
      },
    ],
  },
  insight: [
    "isolatedModules assumes each file is transpiled alone.",
    "verbatimModuleSyntax forces type/value import honesty.",
    "Prefer import type for types-only bindings.",
  ],
};
