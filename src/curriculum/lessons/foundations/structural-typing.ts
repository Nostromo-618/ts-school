import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "structural-typing",
  title: "Structural typing: shape, not name",
  tier: "beginner",
  track: "foundations",
  order: 6,
  summary:
    "TypeScript compares shapes, not class or interface names — why an object with the right fields is accepted, and when excess properties still get rejected.",
  prerequisites: ["inference-and-widening"],
  keywords: ["structural", "duck typing", "excess property", "compatibility"],
  problem:
    "Shape compatibility is informal in JS; secrets hitch a ride easily. This is the everyday mistake that makes TypeScript feel optional until a rename or a `null` slips through. Learn the refusal here; every later track assumes you trust it. Trust the squiggle; it is cheaper than the incident.",
  solution:
    "Fresh object literals get excess-property checks; named variables do not. Compatibility is structural: if the required fields exist with compatible types, the name of the type rarely matters. Object literals passed directly are checked for `unknown` properties — a footgun-prevention feature, not a second type system. Assign the literal to a variable first if you intentionally need extra fields (or use a wider type). Prefer the smallest honest type that still rejects the bad input.",
  js: {
    code: `function printUser(user) {
  return user.id + ":" + user.name;
}

// Any object with id/name works — including ones with surprises.
printUser({ id: "1", name: "Ada", passwordHash: "…" });
`,
    highlights: [{ start: 5, end: 5 }],
    caption:
      "Shape compatibility is informal in JS; secrets hitch a ride easily.",
  },
  ts: {
    code: `type User = { id: string; name: string };

function printUser(user: User) {
  return user.id + ":" + user.name;
}

const admin = { id: "1", name: "Ada", role: "admin" };
printUser(admin); // OK: structural — extra fields on a variable are fine

printUser({ id: "2", name: "Bob", role: "admin" }); // excess-property check
`,
    highlights: [{ start: 10, end: 10 }],
    caption:
      "Fresh object literals get excess-property checks; named variables do not.",
    expectedDiagnostics: [
      {
        code: 2353,
        line: 10,
        messageIncludes: "role",
      },
    ],
  },
  insight: [
    "Compatibility is structural: if the required fields exist with compatible types, the name of the type rarely matters.",
    "Object literals passed directly are checked for `unknown` properties — a footgun-prevention feature, not a second type system.",
    "Assign the literal to a variable first if you intentionally need extra fields (or use a wider type).",
  ],
  security: {
    title: "Extra fields can be sensitive",
    body: "Structural typing means a User-shaped value may still carry passwordHash or tokens. Do not spread untrusted objects into logs or responses just because they satisfied User.",
    severity: "caution",
  },
  quiz: [
    {
      id: "q1",
      prompt:
        "Why does printUser(admin) succeed while the inline object fails?",
      choices: [
        { id: "a", text: "Variables are `never` type-checked" },
        {
          id: "b",
          text: "Fresh literals get excess-property checks; variables are compared structurally",
        },
        { id: "c", text: "role is a reserved word" },
        { id: "d", text: "admin is typed as `any`" },
      ],
      answerId: "b",
      explanation:
        "Excess property checking applies to fresh object literals assigned to a target type.",
    },
  ],
  exercise: {
    prompt:
      "Make the failing call compile without removing role — use a variable.",
    starter: `type User = { id: string; name: string };

function printUser(user: User) {
  return user.id + ":" + user.name;
}

printUser({ id: "2", name: "Bob", role: "admin" });
`,
    assertion: "no-errors",
    hints: ["const bob = { ... }; printUser(bob);"],
    solution: `type User = { id: string; name: string };

function printUser(user: User) {
  return user.id + ":" + user.name;
}

const bob = { id: "2", name: "Bob", role: "admin" };
printUser(bob);
`,
  },
};
