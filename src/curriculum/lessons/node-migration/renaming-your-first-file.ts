import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "renaming-your-first-file",
  title: "Renaming your first file",
  tier: "beginner",
  track: "node-migration",
  order: 7,
  summary:
    "Move one `.js` module to `.ts`, fix the new errors, update imports/extensions, and leave the rest of the tree alone.",
  prerequisites: ["allowjs-and-checkjs", "running-typescript-in-node"],
  keywords: ["rename", ".ts", "incremental", "imports"],
  problem:
    "Renaming a leaf file reveals that callers passed the wrong shapes all along — and that is the point.",
  js: {
    code: `// users.js
export function age(user) {
  return user.yrs;
}
`,
    highlights: [{ start: 3, end: 3 }],
    caption: "yrs vs years — hidden until the file is checked.",
  },
  ts: {
    code: `type User = { years: number };

export function age(user: User): number {
  return user.yrs;
}
`,
    highlights: [{ start: 4, end: 4 }],
    caption: "The first rename teaches more than a week of planning.",
    expectedDiagnostics: [{ code: 2339, line: 4, messageIncludes: "yrs" }],
  },
  insight: [
    "Rename leaves first (utils), then move inward toward HTTP entrypoints.",
    "Fix import paths/extensions according to your module setting (nodenext cares).",
    "One file green is progress — do not batch-rename hundreds at once.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Why rename one file at a time?",
      choices: [
        { id: "a", text: "TypeScript only allows one `.ts` file" },
        {
          id: "b",
          text: "Errors stay reviewable and the service keeps shipping",
        },
        { id: "c", text: "Git cannot rename many files" },
        { id: "d", text: "Node rejects multiple TypeScript files" },
      ],
      answerId: "b",
      explanation: "Incremental renames keep CI and reviews sane.",
    },
  ],
  exercise: {
    prompt: "Read user.years.",
    starter: `type User = { years: number };

export function age(user: User): number {
  return user.yrs;
}
`,
    assertion: "no-errors",
    hints: ["user.years"],
    solution: `type User = { years: number };

export function age(user: User): number {
  return user.years;
}
`,
  },
};
