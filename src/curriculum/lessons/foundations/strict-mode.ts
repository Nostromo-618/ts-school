import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "strict-mode",
  title: "What strict actually turns on",
  tier: "beginner",
  track: "foundations",
  order: 9,
  summary:
    "`strict` is eight flags in a trench coat. What each one rejects, and why turning them on individually is the practical route for an existing codebase.",
  prerequisites: ["any-and-implicit-any"],
  keywords: ["strict", "strictNullChecks", "noImplicitAny", "flags", "config"],
  problem:
    "Without `strict`, TypeScript agrees that `undefined` is a perfectly good string, which removes most of the reason to adopt it.",
  js: {
    code: `function label(user) {
  // user might be missing; .name still "works" until it doesn't.
  return user.name.toUpperCase();
}

label(undefined);
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "Optional values and missing arguments are everyday Node bugs.",
  },
  ts: {
    code: `type User = { name: string };

function label(user: User) {
  return user.name.toUpperCase();
}

// Under strictNullChecks (part of strict), undefined is not a User.
label(undefined);
`,
    highlights: [{ start: 8, end: 8 }],
    caption: "`strictNullChecks` turns 'maybe missing' into a compile error.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 8,
        messageIncludes: "undefined",
      },
    ],
  },
  insight: [
    "`strict` enables a bundle: `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, and more.",
    "For a brownfield Node app, turn flags on one at a time — start with `noImplicitAny` and `strictNullChecks`.",
    "A codebase that compiles only with `strict: false` is barely typed; prefer fixing errors over disabling the flag.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Which `strict` flag rejects `undefined` where a User is required?",
      choices: [
        { id: "a", text: "`noUnusedLocals`" },
        { id: "b", text: "`strictNullChecks`" },
        { id: "c", text: "`skipLibCheck`" },
        { id: "d", text: "`allowJs`" },
      ],
      answerId: "b",
      explanation:
        "`strictNullChecks` makes `null` and `undefined` distinct from other types.",
    },
  ],
  exercise: {
    prompt: "Accept an optional user and return a fallback when missing.",
    starter: `type User = { name: string };

function label(user: User) {
  return user.name.toUpperCase();
}

label(undefined);
`,
    assertion: "no-errors",
    hints: ['user: User | `undefined`, then user?.name ?? "guest"'],
    solution: `type User = { name: string };

function label(user: User | undefined) {
  return (user?.name ?? "guest").toUpperCase();
}

label(undefined);
`,
  },
};
