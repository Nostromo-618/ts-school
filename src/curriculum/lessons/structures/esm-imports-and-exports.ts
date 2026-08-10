import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "esm-imports-and-exports",
  title: "Modules, imports, and type-only imports",
  tier: "beginner",
  track: "structures",
  order: 9,
  summary:
    "export/import in TypeScript modules, and import type so type-only dependencies stay erasable under `isolatedModules`.",
  prerequisites: ["classes-intro", "tsconfig-essentials"],
  keywords: ["esm", "import type", "export", "modules"],
  problem:
    "A value import of a type-only symbol breaks emit under `isolatedModules` / `verbatimModuleSyntax`. Look at the left pane: module format mismatches fail at runtime, not design time. The language will happily evaluate it; only a later runtime path reveals the damage.",
  solution:
    "Real projects resolve this via relative ESM paths + types. Prefer named ESM exports over default for tree-shaking clarity. import type { User } makes the import type-only — erased, safe with `isolatedModules`. Keep runtime values and types distinguished when `verbatimModuleSyntax` is on. Once the types name the contract, the same edit that would have shipped quietly becomes a red squiggle at the call site instead.",
  js: {
    code: `// CJS leaking into an ESM package — runtime ERR_REQUIRE_ESM.
const { User } = require("./user");
module.exports.make = () => new User();
`,
    highlights: [{ start: 2, end: 3 }],
    caption: "Module format mismatches fail at runtime, not design time.",
  },
  ts: {
    code: `// In this single-file sandbox there is no "./user" module.
import { User } from "./user";

export function label(u: User): string {
  return u.name;
}
`,
    highlights: [{ start: 2, end: 2 }],
    caption: "Real projects resolve this via relative ESM paths + types.",
    expectedDiagnostics: [{ code: 2307, line: 2, messageIncludes: "./user" }],
  },
  insight: [
    "Prefer named ESM exports over default for tree-shaking clarity.",
    "import type { User } makes the import type-only — erased, safe with `isolatedModules`.",
    "Keep runtime values and types distinguished when `verbatimModuleSyntax` is on.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "When should you write import type?",
      choices: [
        { id: "a", text: "For every import" },
        { id: "b", text: "When the symbol is used only in type positions" },
        { id: "c", text: "Only for default exports" },
        { id: "d", text: "Never — TypeScript always erases imports" },
      ],
      answerId: "b",
      explanation:
        "Value imports must remain for runtime; type-only imports should not.",
    },
  ],
  exercise: {
    prompt: "Inline a User type so the file has no external import.",
    starter: `import { User } from "./user";

export function label(u: User): string {
  return u.name;
}
`,
    assertion: "no-errors",
    hints: ["type User = { name: string }"],
    solution: `type User = { name: string };

export function label(u: User): string {
  return u.name;
}
`,
  },
};
