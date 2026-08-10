import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "eslint-with-typescript",
  title: "ESLint and TypeScript together",
  tier: "beginner",
  track: "tooling",
  order: 3,
  summary:
    "typescript-eslint rules catch what types allow but style forbids — like floating promises and unsafe `any`.",
  prerequisites: ["tsc-cli", "any-and-implicit-any"],
  keywords: ["eslint", "typescript-eslint", "lint", "floating promises"],
  problem:
    "`tsc` is green but someone left an awaited promise floating and an eslint-disable for no-explicit-`any` on every file. Look at the left pane: unhandled rejection risk — lint can require await/`void`. Edit-time tools are silent, so the mistake travels with the deploy until a concrete input detonates it.",
  solution:
    "Types alone do not enforce that you await; lint complements `tsc`. Let `tsc` own type correctness; let typescript-eslint own footguns like floating promises. Prefer @typescript-eslint/no-explicit-`any` with disciplined exceptions. Do not disable entire rule sets to silence one file — fix or narrow the disable. Hold the dual panes side by side: the left side is the silent failure; the right side is where the checker finally refuses it.",
  js: {
    code: `async function save(row) {
  await dbWrite(row);
}

function dbWrite(row) {
  return Promise.resolve(row);
}

save({ id: 1 }); // fire-and-forget in a route handler
`,
    highlights: [{ start: 9, end: 9 }],
    caption: "Unhandled rejection risk — lint can require await/`void`.",
  },
  ts: {
    code: `async function save(row: { id: number }): Promise<void> {
  await Promise.resolve(row);
}

// Typed — but still a floating promise if the caller ignores it.
export const ignored: void = save({ id: 1 });
`,
    highlights: [{ start: 6, end: 6 }],
    caption: "Types alone do not enforce that you await; lint complements `tsc`.",
    expectedDiagnostics: [{ code: 2322, line: 6, messageIncludes: "Promise" }],
  },
  insight: [
    "Let `tsc` own type correctness; let typescript-eslint own footguns like floating promises.",
    "Prefer @typescript-eslint/no-explicit-`any` with disciplined exceptions.",
    "Do not disable entire rule sets to silence one file — fix or narrow the disable.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "What does ESLint add on top of `tsc`?",
      choices: [
        { id: "a", text: "A second type system that replaces `tsc`" },
        {
          id: "b",
          text: "Stylistic and safety rules types alone cannot express",
        },
        { id: "c", text: "Runtime validation" },
        { id: "d", text: "npm install" },
      ],
      answerId: "b",
      explanation: "Lint and types are complementary gates.",
    },
  ],
  exercise: {
    prompt: "Await save or type the result as `Promise<void>`.",
    starter: `async function save(row: { id: number }): Promise<void> {
  await Promise.resolve(row);
}

export const ignored: void = save({ id: 1 });
`,
    assertion: "no-errors",
    hints: ["export const ignored: `Promise<void>` = save({ id: 1 });"],
    solution: `async function save(row: { id: number }): Promise<void> {
  await Promise.resolve(row);
}

export const ignored: Promise<void> = save({ id: 1 });
`,
  },
};
