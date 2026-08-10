import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "promise-types",
  title: "Promise<T>",
  tier: "beginner",
  track: "async",
  order: 1,
  summary:
    "A Promise carries a value type — `Promise<User>` is not `Promise<any>`, and mixing them loses safety at await.",
  prerequisites: ["typing-parameters-and-returns", "union-types"],
  keywords: ["Promise", "async", "generics", "then"],
  problem:
    "A function returns a Promise that sometimes resolves to a user and sometimes to `null`, but callers always await .email. `null`.email awaits you in production. Annotate `Promise<T>` on functions that return promises so callers see T.",
  solution:
    "The Promise type includes `null` — narrow after await/then. Annotate `Promise<T>` on functions that return promises so callers see T. `Promise<User | null>` is honest; `Promise<User>` with silent `null` is not. Avoid `Promise<any>` — it undoes the generic.",
  js: {
    code: `function findUser(id) {
  return Promise.resolve(id === "x" ? null : { id, email: "a@b.co" });
}

findUser("x").then((u) => u.email);
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "`null`.email awaits you in production.",
  },
  ts: {
    code: `type User = { id: string; email: string };

function findUser(id: string): Promise<User | null> {
  return Promise.resolve(id === "x" ? null : { id, email: "a@b.co" });
}

findUser("x").then((u) => u.email);
`,
    highlights: [{ start: 7, end: 7 }],
    caption: "The Promise type includes `null` — narrow after await/then.",
    expectedDiagnostics: [{ code: 18047, line: 7, messageIncludes: "null" }],
  },
  insight: [
    "Annotate `Promise<T>` on functions that return promises so callers see T.",
    "`Promise<User | null>` is honest; `Promise<User>` with silent `null` is not.",
    "Avoid `Promise<any>` — it undoes the generic.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "What is the type of await findUser(...) here?",
      choices: [
        { id: "a", text: "User" },
        { id: "b", text: "User | `null`" },
        { id: "c", text: "`Promise<User>`" },
        { id: "d", text: "`any`" },
      ],
      answerId: "b",
      explanation: "Await unwraps Promise, leaving User | `null`.",
    },
  ],
  exercise: {
    prompt: "Narrow u before reading email.",
    starter: `type User = { id: string; email: string };

function findUser(id: string): Promise<User | null> {
  return Promise.resolve(id === "x" ? null : { id, email: "a@b.co" });
}

findUser("x").then((u) => u.email);
`,
    assertion: "no-errors",
    hints: ["u?.email or if (u) ..."],
    solution: `type User = { id: string; email: string };

function findUser(id: string): Promise<User | null> {
  return Promise.resolve(id === "x" ? null : { id, email: "a@b.co" });
}

findUser("x").then((u) => u?.email ?? "");
`,
  },
};
