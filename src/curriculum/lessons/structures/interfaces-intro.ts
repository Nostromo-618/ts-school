import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "interfaces-intro",
  title: "Interfaces",
  tier: "beginner",
  track: "structures",
  order: 1,
  summary:
    "interface names an object shape you can implement and extend — the workhorse type for records in application code.",
  prerequisites: ["object-type-literals"],
  keywords: ["interface", "implements", "object shape"],
  problem:
    "Two modules invent slightly different field names for the same record; nothing forces them to agree.",
  js: {
    code: `function saveUser(user) {
  return user.userId + ":" + user.email;
}

saveUser({ id: "1", email: "a@b.co" });
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "id vs userId — undefined in the database key.",
  },
  ts: {
    code: `interface User {
  userId: string;
  email: string;
}

function saveUser(user: User): string {
  return user.userId + ":" + user.email;
}

saveUser({ id: "1", email: "a@b.co" });
`,
    highlights: [{ start: 10, end: 10 }],
    caption: "The interface is the shared contract.",
    expectedDiagnostics: [{ code: 2353, line: 10, messageIncludes: "id" }],
  },
  insight: [
    "Interfaces describe object shapes and can be extended later.",
    "They are open to declaration merging — useful for ambient libs, surprising in app code.",
    "Use interfaces for object contracts you expect to grow; prefer type for unions and mapped work.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Does an interface exist at runtime?",
      choices: [
        { id: "a", text: "Yes, as a constructor" },
        { id: "b", text: "No — it is erased" },
        { id: "c", text: "Only under strict mode" },
        { id: "d", text: "Only if you use implements" },
      ],
      answerId: "b",
      explanation: "Like other types, interfaces erase completely.",
    },
  ],
  exercise: {
    prompt: "Pass a User-shaped object.",
    starter: `interface User {
  userId: string;
  email: string;
}

function saveUser(user: User): string {
  return user.userId + ":" + user.email;
}

saveUser({ id: "1", email: "a@b.co" });
`,
    assertion: "no-errors",
    hints: ["userId instead of id"],
    solution: `interface User {
  userId: string;
  email: string;
}

function saveUser(user: User): string {
  return user.userId + ":" + user.email;
}

saveUser({ userId: "1", email: "a@b.co" });
`,
  },
};
