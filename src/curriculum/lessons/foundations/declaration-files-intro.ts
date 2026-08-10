import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "declaration-files-intro",
  title: "Where types come from: .d.ts files",
  tier: "beginner",
  track: "foundations",
  order: 11,
  summary:
    "Declaration files describe JavaScript that already exists — ambient modules, @types packages, and why a missing .d.ts feels like the library is untyped.",
  prerequisites: ["tsconfig-essentials"],
  keywords: [".d.ts", "ambient", "@types", "DefinitelyTyped", "declare"],
  problem:
    "You install a popular npm package, import it, and TypeScript says the module has no types — even though the package works fine at runtime.",
  js: {
    code: `// Runtime works; editors know nothing about slugify's API.
const slugify = require("slugify");
slugify("Hello World", { lower: true });
`,
    highlights: [{ start: 2, end: 3 }],
    caption: "JavaScript packages often ship without type information.",
  },
  ts: {
    code: `// No @types in this sandbox — the import cannot be resolved.
import slugify from "slugify";

export const path = slugify("Hello World", { lower: true });
`,
    highlights: [{ start: 2, end: 2 }],
    caption: "`TS2307` until the package ships types or you add @types/slugify.",
    expectedDiagnostics: [
      {
        code: 2307,
        line: 2,
        messageIncludes: "slugify",
      },
    ],
  },
  insight: [
    ".d.ts files are TypeScript's description of existing JavaScript — they emit nothing.",
    "Prefer packages with bundled types; otherwise install @types/name from DefinitelyTyped.",
    "You can `declare` a minimal ambient module locally when upstream types are missing.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "What does a .d.ts file contribute at runtime?",
      choices: [
        {
          id: "a",
          text: "Nothing — declarations are erased / not emitted as JS",
        },
        { id: "b", text: "A runtime validator" },
        { id: "c", text: "A Node native addon" },
        { id: "d", text: "Automatic npm install of the package" },
      ],
      answerId: "a",
      explanation:
        "Declaration files exist only for the type checker and editor.",
    },
  ],
  exercise: {
    prompt:
      "Replace the unresolved import with a local ambient function declaration.",
    starter: `import slugify from "slugify";

export const path = slugify("Hello World");
`,
    assertion: "no-errors",
    hints: [
      "Remove the import; `declare` function slugify(input: string): string;",
    ],
    solution: `declare function slugify(
  input: string,
  options?: { lower?: boolean },
): string;

export const path = slugify("Hello World");
`,
  },
};
