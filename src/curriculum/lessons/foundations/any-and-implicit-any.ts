import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "any-and-implicit-any",
  title: "any, and the implicit any leak",
  tier: "beginner",
  track: "foundations",
  order: 8,
  summary:
    "any switches the checker off for everything it touches, and untyped parameters hand it to you without asking. Where it leaks in and how to see it.",
  prerequisites: ["annotations-vs-inference"],
  keywords: ["any", "implicit any", "noImplicitAny", "escape hatch", "unsound"],
  problem:
    "One any at the edge of a module silently disables checking for every value derived from it.",
  js: {
    code: `function handle(body) {
  // Trust the client: body.userId is "whatever".
  return body.userId.toUpperCase();
}

handle({ userId: 42 });
`,
    highlights: [{ start: 3, end: 3 }],
    caption: "No types means no argument about whether userId is a string.",
  },
  ts: {
    code: `// Under strict, an untyped parameter is an error — not a silent any.
function handle(body) {
  return body.userId.toUpperCase();
}

handle({ userId: 42 });
`,
    highlights: [{ start: 2, end: 2 }],
    caption: "TS7006: parameter 'body' implicitly has an 'any' type.",
    expectedDiagnostics: [
      {
        code: 7006,
        line: 2,
        messageIncludes: "any",
      },
    ],
  },
  insight: [
    "Explicit any opts out of checking for that value and everything derived from it.",
    "noImplicitAny (on under strict) forces you to notice untyped parameters instead of inventing any for you.",
    "Prefer unknown at boundaries, then narrow — any is an escape hatch, not a default.",
  ],
  security: {
    title: "any erases the trust boundary",
    body: "Annotating request bodies as any (or leaving them implicit) means authorization IDs, roles, and nested objects are never checked. Attackers supply the shape; any tells TypeScript to look away.",
    severity: "critical",
  },
  quiz: [
    {
      id: "q1",
      prompt: "What does noImplicitAny change?",
      choices: [
        { id: "a", text: "It bans the any keyword entirely" },
        {
          id: "b",
          text: "It errors when TypeScript would otherwise invent an any",
        },
        { id: "c", text: "It enables runtime validation" },
        { id: "d", text: "It only affects .js files" },
      ],
      answerId: "b",
      explanation:
        "You can still write any explicitly; the flag stops implicit anys from slipping in unnoticed.",
    },
  ],
  exercise: {
    prompt:
      "Annotate body as { userId: string } and leave handle({ userId: 42 }) so Check matches the authored solution (that call is the remaining diagnostic).",
    starter: `function handle(body) {
  return body.userId.toUpperCase();
}

handle({ userId: 42 });
`,
    assertion: [
      {
        code: 2322,
        line: 7,
        messageIncludes: "number",
      },
    ],
    hints: ["type Body = { userId: string }; function handle(body: Body)"],
    solution: `type Body = { userId: string };

function handle(body: Body) {
  return body.userId.toUpperCase();
}

handle({ userId: 42 });
`,
  },
};
