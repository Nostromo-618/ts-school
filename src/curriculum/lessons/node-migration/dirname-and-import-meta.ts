import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "dirname-and-import-meta",
  title: "__dirname is gone",
  tier: "intermediate",
  track: "node-migration",
  order: 10,
  summary:
    "import.meta.url, import.meta.dirname, and fileURLToPath — replacing the CommonJS path globals without breaking either module system.",
  prerequisites: ["commonjs-to-esm"],
  keywords: ["__dirname", "import.meta", "fileURLToPath", "path", "esm"],
  problem:
    "Every file-reading helper in a Node codebase uses __dirname, and it does not exist in an ES module.",
  js: {
    code: `const configPath = path.join(__dirname, "config.json");
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "__dirname in a CJS file.",
  },
  ts: {
    code: `type PathApi = { join(...parts: string[]): string };
declare const path: PathApi;
declare function moduleDir(): string;

export const dirname = moduleDir();
export const configPath = path.join(dirname, "config.json");

declare const __dirname: undefined;
const broken: string = __dirname;
`,
    highlights: [{ start: 8, end: 8 }],
    caption:
      "ESM uses a helper from import.meta.url. __dirname typed as undefined is not a string.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 9,
        messageIncludes: "Type 'undefined' is not assignable to type 'stri",
      },
    ],
  },
  insight: [
    "In ESM, build directory paths from import.meta.url via fileURLToPath.",
    "__dirname and __filename are CJS-only bindings.",
    "Keep a small helper so every file does not re-implement the URL dance.",
  ],
};
