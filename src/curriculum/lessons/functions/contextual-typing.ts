import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "contextual-typing",
  title: "Contextual typing",
  tier: "beginner",
  track: "functions",
  order: 5,
  summary:
    "When the surrounding type tells TypeScript what a callback parameter is — so you can omit the annotation and still stay safe.",
  prerequisites: ["function-type-expressions"],
  keywords: ["contextual typing", "callback inference", "map"],
  problem:
    "You annotate every callback parameter out of fear, then the annotations drift from the array element type after a refactor. Strings have no toFixed — fails only when the line runs.",
  solution:
    "Contextual typing still catches the wrong method. When a function expects (x: T) => U, an unannotated callback parameter becomes T. You usually do not need to restate the parameter type inside .map/.filter callbacks.",
  js: {
    code: `const ids = ["a", "b", "c"];
ids.map((id) => id.toFixed(0));
`,
    highlights: [{ start: 2, end: 2 }],
    caption: "Strings have no toFixed — fails only when the line runs.",
  },
  ts: {
    code: `const ids = ["a", "b", "c"];
// id is contextually typed as string from string[].
ids.map((id) => id.toFixed(0));
`,
    highlights: [{ start: 3, end: 3 }],
    caption: "Contextual typing still catches the wrong method.",
    expectedDiagnostics: [{ code: 2551, line: 3, messageIncludes: "toFixed" }],
  },
  insight: [
    "When a function expects (x: T) => U, an unannotated callback parameter becomes T.",
    "You usually do not need to restate the parameter type inside .map/.filter callbacks.",
    "If inference fails, annotate the parameter — or the empty array as T[].",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "In [1,2].map((n) => ...), what is n's type?",
      choices: [
        { id: "a", text: "`any`" },
        { id: "b", text: "number" },
        { id: "c", text: "`unknown`" },
        { id: "d", text: "string" },
      ],
      answerId: "b",
      explanation: "Contextual typing from number[].",
    },
  ],
  exercise: {
    prompt: "Use a string method appropriate for id.",
    starter: `const ids = ["a", "b", "c"];
ids.map((id) => id.toFixed(0));
`,
    assertion: "no-errors",
    hints: ["id.toUpperCase()"],
    solution: `const ids = ["a", "b", "c"];
ids.map((id) => id.toUpperCase());
`,
  },
};
