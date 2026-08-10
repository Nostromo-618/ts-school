import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "tsserver-and-your-editor",
  title: "tsserver and your editor",
  tier: "beginner",
  track: "tooling",
  order: 2,
  summary:
    "The language service is a long-lived `tsc` — select the workspace TypeScript version so squiggles match CI.",
  prerequisites: ["editor-driven-development", "tsc-cli"],
  keywords: ["tsserver", "language service", "workspace TypeScript"],
  problem:
    'Without a project version, every machine invents its own truth. Turning the flag on is painful exactly once; leaving it off means every new file reintroduces the same class of bug. Treat "tsserver and your editor" as a CI gate, not a personal preference.',
  solution:
    "Same checker as CI once the workspace TS version is selected. TypeScript: Select Workspace Version. Restart `tsserver` after `tsconfig` changes if diagnostics look stale. Huge monorepos may need project references so `tsserver` stays responsive. Keep escapes rare — and comment the lie when you need one.",
  js: {
    code: `function pick(arr) {
  return arr[0];
}
`,
    highlights: [{ start: 1, end: 3 }],
    caption: "Without a project version, every machine invents its own truth.",
  },
  ts: {
    code: `function pick(arr: number[]): number {
  return arr[0];
}

const n: string = pick([1, 2, 3]);
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "Same checker as CI once the workspace TS version is selected.",
    expectedDiagnostics: [{ code: 2322, line: 5, messageIncludes: "number" }],
  },
  insight: [
    'In VS Code/Cursor: "TypeScript: Select Workspace Version".',
    "Restart `tsserver` after `tsconfig` changes if diagnostics look stale.",
    "Huge monorepos may need project references so `tsserver` stays responsive.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Why select the workspace TypeScript version?",
      choices: [
        { id: "a", text: "It looks nicer" },
        {
          id: "b",
          text: "Editor diagnostics match the project's pinned compiler",
        },
        { id: "c", text: "It disables types" },
        { id: "d", text: "It installs Node" },
      ],
      answerId: "b",
      explanation: "Version skew is the usual editor/CI disagreement.",
    },
  ],
  exercise: {
    prompt: "Assign pick's result to a number.",
    starter: `function pick(arr: number[]): number {
  return arr[0];
}

const n: string = pick([1, 2, 3]);
`,
    assertion: "no-errors",
    hints: ["const n: number = pick([1, 2, 3]);"],
    solution: `function pick(arr: number[]): number {
  return arr[0];
}

const n: number = pick([1, 2, 3]);
void n;
`,
  },
};
