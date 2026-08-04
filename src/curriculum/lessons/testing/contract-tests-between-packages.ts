import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "contract-tests-between-packages",
  title: "Catching a breaking type change",
  tier: "advanced",
  track: "testing",
  order: 13,
  summary:
    "Type-level contract tests in CI, API-surface snapshots, and turning an accidental breaking change into a failed build rather than a consumer's bug report.",
  prerequisites: ["testing-declaration-files", "ci-gates-for-types"],
  keywords: ["contract test", "api surface", "breaking change", "semver", "ci"],
  problem:
    "Semver says a type change is breaking, and nothing in the release process can tell whether one happened.",
  js: {
    code: `// JS breaking changes are runtime surprises for callers.
function greet(name) {
  return "hi " + name;
}
// Tomorrow: greet({ first }) — callers still pass strings.
`,
    highlights: [{ start: 2, end: 5 }],
    caption: "Without type contracts, breakages arrive as production errors.",
  },
  ts: {
    code: `// Shared public contract:
export type Greeter = (name: string) => string;

const g: Greeter = (name) => \`hi \${name}\`;
const broken: Greeter = (name: number) => \`hi \${name}\`;
void g;
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "Consumer assignments fail when the contract params drift.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 5,
        messageIncludes: "not assignable",
      },
    ],
  },
  insight: [
    "Keep a tiny consumer package or type tests that import the public API in CI.",
    "API Extractor / attw / semver-check tools snapshot the surface.",
    "Treat type-only breaks as major versions when you publish libraries.",
  ],
  quiz: [
    {
      id: "contract-q",
      prompt: "Why run contract tests in CI for a library?",
      choices: [
        { id: "a", text: "To replace unit tests entirely" },
        { id: "b", text: "To fail the build when the public type surface breaks callers" },
        { id: "c", text: "To speed up npm publish" },
        { id: "d", text: "To disable semver" },
      ],
      answerId: "b",
      explanation:
        "Contract tests compile representative consumer code against the published types.",
    },
  ],
  exercise: {
    prompt:
      "Define type Api = { ping(): \"pong\" } and a const api: Api.",
    starter: `type Api = { ping(): "pong" };
`,
    assertion: "no-errors",
    hints: ["const api: Api = { ping: () => \"pong\" }"],
    solution: `type Api = { ping(): "pong" };
const api: Api = {
  ping: () => "pong",
};
void api.ping();
`,
  },
};
