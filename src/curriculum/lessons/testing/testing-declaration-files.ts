import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "testing-declaration-files",
  title: "Testing a package's public types",
  tier: "advanced",
  track: "testing",
  order: 12,
  summary:
    "Checking the emitted .d.ts rather than the source: resolution under each module mode, and what consumers actually see.",
  prerequisites: ["publishing-types", "type-level-tests"],
  keywords: ["d.ts", "public api", "arethetypeswrong", "resolution", "package"],
  problem:
    "The types you tested are the source's; the types you shipped are the emitted ones, and they are not always the same. Look at the left pane: without .d.ts, consumers only have runtime discovery. Without a typechecker there is nothing to refuse that misuse while you type — only later, on a live path.",
  solution:
    "Tests against the public `declare` surface catch return-type drift. Run type tests against packed output or emitted .d.ts, not only src/. arethetypeswrong checks export maps across module resolutions. Breakages in declaration emit (cannot be named) show up here first. Treat the TypeScript pane as the worked example of that refusal — diagnostics included — and the takeaways as what should stick after you leave the page.",
  js: {
    code: `// JS: there is no declaration file to test — the .js is the API.
export function api() {
  return 1;
}
`,
    highlights: [{ start: 2, end: 4 }],
    caption: "Without .d.ts, consumers only have runtime discovery.",
  },
  ts: {
    code: `// Consumer view of an emitted declaration surface:
export declare function api(): number;

const n: string = api();
`,
    highlights: [{ start: 4, end: 4 }],
    caption:
      "Tests against the public `declare` surface catch return-type drift.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 4,
        messageIncludes: "number",
      },
    ],
  },
  insight: [
    "Run type tests against packed output or emitted .d.ts, not only src/",
    "arethetypeswrong checks export maps across module resolutions.",
    "Breakages in declaration emit (cannot be named) show up here first.",
  ],
  security: {
    title: "Published types are a trust surface",
    body: "Consumers trust .d.ts for security-sensitive APIs. Testing only source lets unsafe emit drift ship unnoticed.",
    severity: "info",
  },
  quiz: [
    {
      id: "dts-test",
      prompt: "What should consumer type tests import?",
      choices: [
        { id: "a", text: "Internal src/**/*`.ts` always" },
        {
          id: "b",
          text: "The package’s published entry / emitted declarations",
        },
        { id: "c", text: "node:fs" },
        { id: "d", text: "Any ambient global" },
      ],
      answerId: "b",
      explanation:
        "You need to see what npm packs, not what the monorepo source allows.",
    },
  ],
  exercise: {
    prompt:
      "export `declare` function version(): string and assign the result to a string.",
    starter: `export declare function version(): string;
`,
    assertion: "no-errors",
    hints: ["const v: string = version();"],
    solution: `export declare function version(): string;
const v: string = version();
void v;
`,
  },
};
