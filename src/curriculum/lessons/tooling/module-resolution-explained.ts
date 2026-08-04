import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "module-resolution-explained",
  title: "How an import is resolved",
  tier: "intermediate",
  track: "tooling",
  order: 13,
  summary:
    "node16, nodenext, and bundler; baseUrl and paths; why the resolution mode changes what an import even means.",
  prerequisites: ["package-json-exports-and-types", "tsc-cli"],
  keywords: [
    "moduleResolution",
    "nodenext",
    "bundler",
    "paths",
    "baseUrl",
    "resolution",
  ],
  problem:
    "Cannot find module for a package that is definitely installed is nearly always a resolution-mode mismatch, not a missing dependency.",
  js: {
    code: `require('./util');
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Extensionless requires everywhere.",
  },
  ts: {
    code: `// Bundler resolution (this sandbox) vs nodenext differs on extensions.
type Mode = "bundler" | "nodenext";
declare function resolve(mode: Mode, spec: string): string;
const a = resolve("bundler", "./util");
const b = resolve("nodenext", "./util.js");
const bad = resolve("nodenext", "./util");
`,
    highlights: [{ start: 6, end: 6 }],
    caption:
      "Illustrative API: nodenext wants ./util.js. Literal mismatch errors.",
    expectedDiagnostics: [],
  },
  insight: [
    "moduleResolution bundler vs nodenext change legal specifiers.",
    "Match resolution to your runtime (Node vs bundler).",
    "Do not mix modes across packages carelessly.",
  ],
};
