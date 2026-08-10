import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "namespaces-and-legacy-code",
  title: "Namespaces, and the code that still uses them",
  tier: "intermediate",
  track: "structures",
  order: 20,
  summary:
    "`declare` namespace is everywhere in older type definitions. How to read it, how to consume it, and why not to write new ones.",
  prerequisites: ["declaration-merging", "esm-imports-and-exports"],
  keywords: ["namespace", "module", "legacy", "declare", "DefinitelyTyped"],
  problem:
    "Half of DefinitelyTyped predates ES modules, so consuming it means understanding a module system you would never choose.",
  js: {
    code: `var App = App || {};
App.util = {};
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "Iife/global namespaces in old scripts.",
  },
  ts: {
    code: `namespace Legacy {
  export function greet(name: string): string {
    return "hi " + name;
  }
}
const s: string = Legacy.greet("Ada");
const bad: number = Legacy.greet("Ada");
`,
    highlights: [{ start: 7, end: 7 }],
    caption: "Prefer ES modules; namespaces still type. greet returns string.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 7,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "Namespaces are legacy — use ES modules for new code.",
    "They still appear in older DefinitelyTyped patterns.",
    "Migrate outward-in: leave namespace wrappers until the end.",
  ],
};
