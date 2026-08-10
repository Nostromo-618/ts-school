import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "primitive-types",
  title: "The primitives, and their impostors",
  tier: "beginner",
  track: "types",
  order: 1,
  summary:
    "string, number, boolean, `null`, `undefined`, symbol, `bigint` — and why `String` with a capital S is a different type that will bite you.",
  prerequisites: ["annotations-vs-inference"],
  keywords: ["string", "number", "boolean", "bigint", "String object"],
  problem:
    "Primitives mix silently; the bug is often string vs number. The type system is supposed to make that state unrepresentable — if it does not, callers invent ad-hoc checks and still miss a branch. Model the domain so the illegal mix cannot be constructed. Prefer a model where the illegal state cannot be written down.",
  solution:
    'Name the primitive you mean — `string`, `number`, `boolean`, `bigint`, `symbol`, `null`, `undefined` — instead of hoping a value "looks right." The TypeScript pane catches assigning the wrong primitive at the call site. Prefer precise primitives on public APIs; reach for unions only when more than one is truly allowed.',
  js: {
    code: `function addDays(start, days) {
  return start + days * 86400000;
}

// Query params are strings; "7" + math becomes concatenation chaos.
addDays(Date.now(), "7");
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "Primitives mix silently; the bug is often string vs number.",
  },
  ts: {
    code: `function addDays(start: number, days: number): number {
  return start + days * 86400000;
}

addDays(Date.now(), "7");
`,
    highlights: [{ start: 5, end: 5 }],
    caption: 'number is not `String`, and it is not the string "7".',
    expectedDiagnostics: [{ code: 2345, line: 5, messageIncludes: "string" }],
  },
  insight: [
    "Prefer lowercase primitives: string, number, boolean — not `String`, Number, Boolean wrappers.",
    "`bigint` is a separate type; you cannot mix it with number without an explicit conversion.",
    "At HTTP boundaries, parse strings into the primitive you mean before calling domain functions.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Which annotation is almost always wrong for text data?",
      choices: [
        { id: "a", text: "string" },
        { id: "b", text: "`String`" },
        { id: "c", text: '"ok"' },
        { id: "d", text: "`template`" },
      ],
      answerId: "b",
      explanation:
        "`String` refers to the object wrapper type; everyday text is string.",
    },
  ],
  exercise: {
    prompt: "Parse the days argument before calling addDays.",
    starter: `function addDays(start: number, days: number): number {
  return start + days * 86400000;
}

addDays(Date.now(), "7");
`,
    assertion: "no-errors",
    hints: ['Number("7") or parseInt'],
    solution: `function addDays(start: number, days: number): number {
  return start + days * 86400000;
}

addDays(Date.now(), Number("7"));
`,
  },
};
