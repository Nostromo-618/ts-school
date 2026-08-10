import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "promise-types",
  title: "Promise<T>",
  tier: "beginner",
  track: "async",
  order: 1,
  summary:
    "A `Promise` carries a value type — `Promise<User>` is not `Promise<any>`, and mixing them loses safety at `await`.",
  prerequisites: ["typing-parameters-and-returns", "union-types"],
  keywords: ["Promise", "async", "generics", "then"],
  problem:
    'A lookup sometimes resolves to a user and sometimes to `null`, but every caller still reaches for `.email` as if a user is guaranteed. In JavaScript that becomes a runtime crash on the miss path — `null.email` — with no complaint at the call site. The failure mode is not "promises are hard"; it is that the resolved value\'s real shape never appeared in the type of the function you awaited.',
  solution:
    "Annotate the function as `Promise<User | null>` so the checker forces callers to narrow after `await` or `.then`. The TypeScript pane refuses `.email` on a value that might be `null` — that refusal is the contract. Prefer an honest union over a lying `Promise<User>` that secretly returns `null`, and never paper over the generic with `Promise<any>`. When you own the API, put the absence in the type; when you consume it, treat `null` before you touch fields.",
  js: {
    code: `function findUser(id) {
  return Promise.resolve(id === "x" ? null : { id, email: "a@b.co" });
}

findUser("x").then((u) => u.email);
`,
    highlights: [{ start: 5, end: 5 }],
    caption:
      "`null.email` awaits you in production when the miss path is ignored.",
  },
  ts: {
    code: `type User = { id: string; email: string };

function findUser(id: string): Promise<User | null> {
  return Promise.resolve(id === "x" ? null : { id, email: "a@b.co" });
}

findUser("x").then((u) => u.email);
`,
    highlights: [{ start: 7, end: 7 }],
    caption: "`Promise<User | null>` forces a narrow before `.email`.",
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
