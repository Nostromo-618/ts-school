import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "editor-driven-development",
  title: "The editor is the compiler",
  tier: "beginner",
  track: "foundations",
  order: 12,
  summary:
    "`tsserver` powers red squiggles, completions, and rename — treat the editor as the same checker CI runs, not a separate opinion.",
  prerequisites: ["declaration-files-intro"],
  keywords: ["tsserver", "IDE", "completions", "refactor", "language service"],
  problem:
    "Fighting the editor — ignoring squiggles, overusing suppressions — turns TypeScript into a CI-only tax. The feedback loop only works if you read diagnostics while you type.",
  solution:
    "Treat the language service as part of the workflow: jump to definitions, inspect inferred types, fix errors before commit. Configure the workspace TypeScript version so the editor matches CI. Speed comes from trust in the squiggle, not from silencing it.",
  js: {
    code: `function renameField(row) {
  return { user_id: row.userId };
}

// Rename userId → accountId in one file; callers elsewhere still use userId.
renameField({ userId: "u_1" });
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "Without a project-wide checker, renames are search-and-hope.",
  },
  ts: {
    code: `type Row = { accountId: string };

function renameField(row: Row) {
  return { user_id: row.accountId };
}

// Same mistake the language service highlights as you type.
renameField({ userId: "u_1" });
`,
    highlights: [{ start: 8, end: 8 }],
    caption: "The editor error is `tsc`'s error — fix it before you push.",
    expectedDiagnostics: [
      {
        code: 2353,
        line: 8,
        messageIncludes: "userId",
      },
    ],
  },
  insight: [
    "Your editor speaks to `tsserver` using the same TypeScript version and `tsconfig` as CI when configured correctly.",
    "Prefer workspace TypeScript over a global install so local and CI stay aligned (this repo dual-installs `typescript@7` for tooling and `typescript-strada@6.0.3` for `createProgram`).",
    "Use rename symbol and find references — they are type-aware, unlike text search.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Why can the editor and CI disagree?",
      choices: [
        {
          id: "a",
          text: "Different TypeScript versions or different `tsconfig` roots",
        },
        { id: "b", text: "Editors `never` type-check" },
        { id: "c", text: "CI ignores `strict` mode always" },
        { id: "d", text: "JavaScript files cannot be checked" },
      ],
      answerId: "a",
      explanation:
        "Mismatched compiler versions or opening a file outside the project are the usual causes.",
    },
  ],
  exercise: {
    prompt: "Fix the call to use `accountId`.",
    starter: `type Row = { accountId: string };

function renameField(row: Row) {
  return { user_id: row.accountId };
}

renameField({ userId: "u_1" });
`,
    assertion: "no-errors",
    hints: ['{ accountId: "u_1" }'],
    solution: `type Row = { accountId: string };

function renameField(row: Row) {
  return { user_id: row.accountId };
}

renameField({ accountId: "u_1" });
`,
  },
};
