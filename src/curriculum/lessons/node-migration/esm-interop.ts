import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "esm-interop",
  title: "Interop between the two module systems",
  tier: "intermediate",
  track: "node-migration",
  order: 9,
  summary:
    "`esModuleInterop`, default imports of CommonJS packages, createRequire, and why import x from 'cjs-pkg' sometimes gives you the namespace.",
  prerequisites: ["commonjs-to-esm"],
  keywords: [
    "esModuleInterop",
    "default import",
    "createRequire",
    "interop",
    "namespace",
  ],
  problem:
    "The same import statement resolves to the module or to its default export depending on flags set three configs away. Look at the left pane: require a CJS helper and call it directly. Without a typechecker there is nothing to refuse that misuse while you type — only later, on a live path.",
  solution:
    "Normalize default-vs-namespace interop. pad returns string, not number. CJS packages may need `esModuleInterop` or import = require depending on export style. Runtime shape can be module or module.default — normalize once at the boundary. Check emitted JS when bundlers and `tsc` disagree about interop. That is the whole move: make the broken path unrepresentable (or at least loudly illegal) before it reaches production.",
  js: {
    code: `const legacy = require("legacy-lib");
legacy.pad("x", 3);
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "require a CJS helper and call it directly.",
  },
  ts: {
    code: `type Legacy = { pad(s: string, n: number): string };
type Interop<T> = T | { default: T };
declare const imported: Interop<Legacy>;

function asLegacy(mod: Interop<Legacy>): Legacy {
  return "default" in mod ? mod.default : mod;
}

const api = asLegacy(imported);
const ok: string = api.pad("x", 3);
const bad: number = api.pad("x", 3);
`,
    highlights: [{ start: 10, end: 10 }],
    caption:
      "Normalize default-vs-namespace interop. pad returns string, not number.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 11,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "CJS packages may need `esModuleInterop` or import = require depending on export style.",
    "Runtime shape can be module or module.default — normalize once at the boundary.",
    "Check emitted JS when bundlers and `tsc` disagree about interop.",
  ],
};
