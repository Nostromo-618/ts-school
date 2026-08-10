import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "commonjs-to-esm",
  title: "CommonJS to ESM",
  tier: "intermediate",
  track: "node-migration",
  order: 8,
  summary:
    'module: nodenext, "type": "module", mandatory file extensions in relative imports, and what happens to require along the way.',
  prerequisites: ["esm-imports-and-exports", "renaming-your-first-file"],
  keywords: ["commonjs", "esm", "nodenext", "type module", "extensions"],
  problem:
    "`ERR_MODULE_NOT_FOUND` for a file that plainly exists is usually the ESM extension rule — and the error message almost never says so. CommonJS `require` forgives bare relative paths; ESM does not. Migrations stall on this one surprise more than on type errors.",
  solution:
    "Under ESM / `nodenext`, relative imports need an explicit `.js` extension (even from `.ts` sources). Replace `require` / `module.exports` with `import` / `export` and `node:` builtins. Derive directory paths from `import.meta.url` instead of `__dirname`. Fix the resolution story first; the types will follow the real module graph.",
  js: {
    code: `const readConfig = require("./config");
module.exports = { readConfig };
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "CJS require without extensions — Node forgives you.",
  },
  ts: {
    code: `type ConfigLoader = () => unknown;
declare function loadConfig(specifier: string): ConfigLoader;

export const readConfig = loadConfig("./config.js");

// Extensionless relative path is the nodenext footgun:
const badSpecifier: "./config.js" = "./config";
`,
    highlights: [{ start: 6, end: 6 }],
    caption:
      'Model nodenext extension rules with literal types. Extensionless path is not "./config.js".',
    expectedDiagnostics: [
      {
        code: 2322,
        line: 7,
        messageIncludes: "Type '\"./config\"' is not assignable to type '\"./",
      },
    ],
  },
  insight: [
    "Under ESM / nodenext, relative imports need an explicit `.js` extension (even from `.ts` sources).",
    "Replace require/module.exports with import/export and node: builtins.",
    "Derive paths from `import.meta`.url instead of __dirname.",
  ],
  quiz: [
    {
      id: "cjs-1",
      prompt: 'Why does import "./config" fail under Node ESM?',
      choices: [
        { id: "a", text: "TypeScript deletes the file." },
        {
          id: "b",
          text: "ESM relative imports require an explicit file extension.",
        },
        { id: "c", text: "config must be a JSON module." },
      ],
      answerId: "b",
      explanation:
        "Node ESM does not guess extensions the way CJS require did.",
    },
  ],
};
