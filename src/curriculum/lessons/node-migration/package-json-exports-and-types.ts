import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "package-json-exports-and-types",
  title: "exports, types, and how consumers find them",
  tier: "intermediate",
  track: "node-migration",
  order: 11,
  summary:
    "The exports map, the types condition, subpath exports, and why the order of conditions in that object is load-bearing.",
  prerequisites: ["esm-interop", "installing-types"],
  keywords: [
    "exports",
    "types condition",
    "subpath",
    "package.json",
    "resolution",
  ],
  problem:
    "A package with an exports map and a stale top-level types field resolves fine for the author and to any for everyone else.",
  js: {
    code: `const exportsMap = { ".": "./dist/index.js" };
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "exports with a runtime path only.",
  },
  ts: {
    code: `type ExportEntry = { types?: string; import?: string; require?: string };

const exportsMap: Record<string, ExportEntry> = {
  ".": {
    types: "./dist/index.d.ts",
    import: "./dist/index.js",
    require: "./dist/index.cjs",
  },
};

const main = exportsMap["."];
const typesPath: string | undefined = main.types;
const missing: number = main.types;
`,
    highlights: [{ start: 12, end: 12 }],
    caption: "Author a types condition. Optional types is not a number.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 13,
        messageIncludes: "Type 'string | undefined' is not assignable to t",
      },
    ],
  },
  insight: [
    "Put a types condition in exports so TypeScript resolves declarations reliably.",
    "Dual packages need both import and require entry points.",
    "Prefer exports.types over legacy typesVersions when you can.",
  ],
};
