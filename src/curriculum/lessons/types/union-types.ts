import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "union-types",
  title: "Union types",
  tier: "beginner",
  track: "types",
  order: 4,
  summary:
    "A | B means one of these, not both. What you may do with a union before you have narrowed it, and why that restriction is the point.",
  prerequisites: ["object-type-literals"],
  keywords: ["union", "|", "narrowing", "nullable"],
  problem:
    "`null` is a valid return; calling .name is not. The type system is supposed to make that state unrepresentable — if it does not, callers invent ad-hoc checks and still miss a branch. Model the domain so the illegal mix cannot be constructed. Prefer a model where the illegal state cannot be written down.",
  solution:
    "You must narrow User | `null` before reading name. A union is a value that could be `any` of the members — only common operations are allowed until you narrow. User | `null` is the honest return type for 'maybe found'. Narrow with equality checks, `typeof`, or predicates — do not assert the danger away. Do not silence the diagnostic without restoring the shape.",
  js: {
    code: `function findUser(id) {
  if (id === "missing") return null;
  return { id, name: "Ada" };
}

const user = findUser("missing");
user.name.toUpperCase();
`,
    highlights: [{ start: 7, end: 7 }],
    caption: "`null` is a valid return; calling .name is not.",
  },
  ts: {
    code: `type User = { id: string; name: string };

function findUser(id: string): User | null {
  if (id === "missing") return null;
  return { id, name: "Ada" };
}

const user = findUser("missing");
user.name.toUpperCase();
`,
    highlights: [{ start: 9, end: 9 }],
    caption: "You must narrow User | `null` before reading name.",
    expectedDiagnostics: [{ code: 18047, line: 9, messageIncludes: "null" }],
  },
  insight: [
    "A union is a value that could be any of the members — only common operations are allowed until you narrow.",
    "User | `null` is the honest return type for 'maybe found'.",
    "Narrow with equality checks, `typeof`, or predicates — do not assert the danger away.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Before narrowing, what can you safely do with User | `null`?",
      choices: [
        { id: "a", text: "Read .name" },
        { id: "b", text: "Compare to `null` / use optional chaining" },
        { id: "c", text: "Call `any` User method" },
        { id: "d", text: "Index it like an array" },
      ],
      answerId: "b",
      explanation: "Operations must be valid for every member of the union.",
    },
  ],
  exercise: {
    prompt: "Narrow before reading name.",
    starter: `type User = { id: string; name: string };

function findUser(id: string): User | null {
  if (id === "missing") return null;
  return { id, name: "Ada" };
}

const user = findUser("missing");
user.name.toUpperCase();
`,
    assertion: "no-errors",
    hints: ["if (user) { ... } or user?.name"],
    solution: `type User = { id: string; name: string };

function findUser(id: string): User | null {
  if (id === "missing") return null;
  return { id, name: "Ada" };
}

const user = findUser("missing");
const label = user ? user.name.toUpperCase() : "missing";
void label;
`,
  },
};
