import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "literal-types",
  title: "Literal types",
  tier: "beginner",
  track: "types",
  order: 5,
  summary:
    '"GET" is a type with exactly one value. Unions of literals replace magic strings with something the compiler and the editor both understand.',
  prerequisites: ["union-types"],
  keywords: ["literal", "string literal", "magic string", "const"],
  problem:
    "A typo'd method name — \"POSt\" — is a perfectly good string, so it fails at runtime against a route table rather than at the keystroke. Typos in method verbs are invisible without a closed set.",
  solution:
    "Only the literals in Method are assignable. GET. Unions of literals give you exhaustive-friendly APIs without enums. const assertions and annotated bindings prevent widening back to string.",
  js: {
    code: `function handle(method, path) {
  if (method === "GET") return "read " + path;
  if (method === "POST") return "write " + path;
  throw new Error("unsupported");
}

handle("POSt", "/users");
`,
    highlights: [{ start: 7, end: 7 }],
    caption: "Typos in method verbs are invisible without a closed set.",
  },
  ts: {
    code: `type Method = "GET" | "POST";

function handle(method: Method, path: string): string {
  if (method === "GET") return "read " + path;
  return "write " + path;
}

handle("POSt", "/users");
`,
    highlights: [{ start: 8, end: 8 }],
    caption: "Only the literals in Method are assignable.",
    expectedDiagnostics: [{ code: 2345, line: 8, messageIncludes: "POSt" }],
  },
  insight: [
    'Literal types are types with a single inhabitant — "GET" is not string.',
    "Unions of literals give you exhaustive-friendly APIs without enums.",
    "const assertions and annotated bindings prevent widening back to string.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: 'What is the type "GET" | "POST"?',
      choices: [
        { id: "a", text: "Any string" },
        { id: "b", text: "Only those two string values" },
        { id: "c", text: "A runtime enum object" },
        { id: "d", text: "boolean" },
      ],
      answerId: "b",
      explanation: "Each member is a string literal type.",
    },
  ],
  exercise: {
    prompt: "Call handle with a valid Method.",
    starter: `type Method = "GET" | "POST";

function handle(method: Method, path: string): string {
  if (method === "GET") return "read " + path;
  return "write " + path;
}

handle("POSt", "/users");
`,
    assertion: "no-errors",
    hints: ['"POST"'],
    solution: `type Method = "GET" | "POST";

function handle(method: Method, path: string): string {
  if (method === "GET") return "read " + path;
  return "write " + path;
}

handle("POST", "/users");
`,
  },
};
