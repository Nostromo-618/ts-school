import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "reading-type-errors",
  title: "Reading a TypeScript error",
  tier: "beginner",
  track: "foundations",
  order: 7,
  summary:
    "How to decode TS2xxx messages: expected vs actual, property paths, and the 'Did you mean…?' hints that save a refactor.",
  prerequisites: ["structural-typing"],
  keywords: ["diagnostics", "error codes", "Did you mean", "assignability"],
  problem:
    "A wall of red text trains people to ignore the checker — learning to read one error well is faster than turning the checker off.",
  js: {
    code: `function fullName(user) {
  return user.firstName + " " + user.lastName;
}

const user = { firstname: "Ada", lastName: "Lovelace" };
fullName(user);
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "A casing typo becomes 'undefined Lovelace' at runtime.",
  },
  ts: {
    code: `type User = { firstName: string; lastName: string };

function fullName(user: User) {
  return user.firstName + " " + user.lastName;
}

const user = { firstname: "Ada", lastName: "Lovelace" };
fullName(user);
`,
    highlights: [{ start: 7, end: 7 }],
    caption: "TS2345 spells out the missing property — firstName vs firstname.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 8,
        messageIncludes: "firstName",
      },
    ],
  },
  insight: [
    "Start at the last line of the message: it names the expression TypeScript rejected.",
    "Work upward: required property, expected type, actual type.",
    "Error codes are searchable; 'Did you mean' hints often expose typos like nam vs name.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Best first step when reading a long assignability error?",
      choices: [
        { id: "a", text: "Add as any to silence it" },
        {
          id: "b",
          text: "Find the expected vs actual types and the flagged expression",
        },
        { id: "c", text: "Delete the tsconfig" },
        { id: "d", text: "Upgrade TypeScript immediately" },
      ],
      answerId: "b",
      explanation:
        "The checker is comparing two types at a specific expression — start there.",
    },
  ],
  exercise: {
    prompt: "Fix the object so fullName type-checks.",
    starter: `type User = { firstName: string; lastName: string };

function fullName(user: User) {
  return user.firstName + " " + user.lastName;
}

const user = { firstname: "Ada", lastName: "Lovelace" };
fullName(user);
`,
    assertion: "no-errors",
    hints: ["Rename firstname → firstName."],
    solution: `type User = { firstName: string; lastName: string };

function fullName(user: User) {
  return user.firstName + " " + user.lastName;
}

const user = { firstName: "Ada", lastName: "Lovelace" };
fullName(user);
`,
  },
};
