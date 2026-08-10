import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "optional-and-default-parameters",
  title: "Optional and default parameters",
  tier: "beginner",
  track: "functions",
  order: 2,
  summary:
    'name?: string versus name = "guest" — how each shows up in the type, and why optional parameters must come last.',
  prerequisites: ["typing-parameters-and-returns", "null-and-undefined"],
  keywords: ["optional parameter", "default parameter", "?", "undefined"],
  problem:
    'Calling `greet()` with no arguments quietly builds `"hello UNDEFINED` — `name` was `undefined`, and `toUpperCase` only fails when someone finally passes nothing in production. Optional parameters without types look like convenience; they are actually a missing contract about what may be omitted.',
  solution:
    'Make required inputs required in the type: `greet(name: string, excited?: boolean)` rejects a bare `greet()` at compile time. Put optional parameters after required ones; `name?: string` means `string | undefined`, while `name = "guest"` supplies a runtime default and still types the parameter as `string` for callers who omit it. Prefer a default when you have a real fallback; prefer `?` when absence itself is meaningful and must be handled.',
  js: {
    code: `function greet(name, excited) {
  const base = "hello " + name.toUpperCase();
  return excited ? base + "!" : base;
}

greet();
`,
    highlights: [{ start: 6, end: 6 }],
    caption: "Missing args become `undefined` with no warning.",
  },
  ts: {
    code: `function greet(name: string, excited?: boolean): string {
  const base = "hello " + name.toUpperCase();
  return excited ? base + "!" : base;
}

greet();
`,
    highlights: [{ start: 6, end: 6 }],
    caption: "name is required; omitting it is a type error.",
    expectedDiagnostics: [
      { code: 2554, line: 6, messageIncludes: "arguments" },
    ],
  },
  insight: [
    "Optional parameters are T | `undefined` and must follow required ones.",
    'Defaults (name = "guest") make the parameter optional for callers and defined inside the body.',
    "Prefer defaults when you have a sensible fallback; prefer ? when absence is meaningful.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: 'Inside greet(name = "guest"), what is `typeof` name?',
      choices: [
        { id: "a", text: "string | `undefined`" },
        { id: "b", text: "string" },
        { id: "c", text: "`any`" },
        { id: "d", text: "`never`" },
      ],
      answerId: "b",
      explanation: "Defaults apply before the body runs, so name is string.",
    },
  ],
  exercise: {
    prompt: "Give name a default so greet() is valid.",
    starter: `function greet(name: string, excited?: boolean): string {
  const base = "hello " + name.toUpperCase();
  return excited ? base + "!" : base;
}

greet();
`,
    assertion: "no-errors",
    hints: ['name = "friend"'],
    solution: `function greet(name = "friend", excited?: boolean): string {
  const base = "hello " + name.toUpperCase();
  return excited ? base + "!" : base;
}

greet();
`,
  },
};
