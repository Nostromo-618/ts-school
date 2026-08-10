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
    'CommonJS `require("./config")` forgives missing extensions; ESM under `nodenext` does not. Teams flip `"type": "module"` and suddenly relative imports fail at runtime while TypeScript still looks fine if the specifier types are sloppy.',
  solution:
    "Under ESM / `nodenext`, relative imports need an explicit `.js` extension even from `.ts` sources — model that rule in types so extensionless paths fail early. Replace `require` / `module.exports` with `import` / `export` and `node:` builtins. Derive paths from `import.meta.url` instead of `__dirname`.",
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
