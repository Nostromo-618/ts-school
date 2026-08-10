import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "inference-and-widening",
  title: "Inference and widening",
  tier: "beginner",
  track: "foundations",
  order: 5,
  summary:
    "How let widens a string literal to string, how const keeps the literal, and when that difference breaks an API that wanted a specific status.",
  prerequisites: ["annotations-vs-inference"],
  keywords: ["widening", "literal types", "const", "let", "fresh literals"],
  problem:
    'A status that started as "ready" silently becomes `any` string, so typos like "redy" compile until something else breaks.',
  js: {
    code: `function setStatus(status) {
  return status;
}

let status = "ready";
status = "redy"; // typo — still a string
setStatus(status);
`,
    highlights: [{ start: 6, end: 6 }],
    caption: "JavaScript has no notion of 'only these strings'.",
  },
  ts: {
    code: `type Status = "ready" | "done";

function setStatus(s: Status) {
  return s;
}

let status = "ready"; // inferred as string, not "ready"
status = "pending";
setStatus(status);
`,
    highlights: [{ start: 8, end: 8 }],
    caption: "let widens the literal; Status no longer accepts the binding.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 9,
        messageIncludes: "string",
      },
    ],
  },
  insight: [
    'const status = "ready" infers the literal type "ready"; let status = "ready" usually widens to string.',
    "Use a type annotation (let status: Status) or `as const` when the set of values matters.",
    "Widening is why stringly-typed enums feel fine in JS and then fail under TypeScript.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: 'What is the usual inferred type of `let status = "ready"`?',
      choices: [
        { id: "a", text: '"ready"' },
        { id: "b", text: "string" },
        { id: "c", text: "Status" },
        { id: "d", text: "`any`" },
      ],
      answerId: "b",
      explanation:
        "Mutable bindings widen literal initializers to the primitive so you can assign other strings later.",
    },
  ],
  exercise: {
    prompt:
      "Annotate status as Status so setStatus accepts it (and fix the bad assignment).",
    starter: `type Status = "ready" | "done";

function setStatus(s: Status) {
  return s;
}

let status = "ready";
status = "pending";
setStatus(status);
`,
    assertion: "no-errors",
    hints: ['let status: Status = "ready"; then assign "done".'],
    solution: `type Status = "ready" | "done";

function setStatus(s: Status) {
  return s;
}

let status: Status = "ready";
status = "done";
setStatus(status);
`,
  },
};
