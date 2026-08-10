import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "const-type-parameters",
  title: "const type parameters",
  tier: "advanced",
  track: "functions",
  order: 19,
  summary:
    "<const T> makes a call site behave as though the caller wrote `as const` — the way a library preserves literal types without asking its users to.",
  prerequisites: ["const-assertions", "generic-inference-internals"],
  keywords: [
    "const type parameter",
    "as const",
    "literal",
    "inference",
    "api design",
  ],
  problem:
    "Without literal inference, route names widen immediately. Shared helpers amplify the hole: wrong arguments, erased returns, or forgotten type relationships spread to every caller. Callers copy the signature they see — if it lies, the lie spreads.",
  solution:
    "<const T> preserves literal tuple types from the call site. const type parameters apply a const assertion to the inferred argument type. Library authors use them so callers need not write `as const` at every call. Combine with `readonly` arrays/tuples when you want immutable literal tables. The dual panes are the lesson: left fails, right refuses.",
  js: {
    code: `// JS: route tables are plain arrays of strings.
function routes(names) {
  return names;
}
const r = routes(["home", "about"]); // just strings
`,
    highlights: [{ start: 4, end: 4 }],
    caption: "Without literal inference, route names widen immediately.",
  },
  ts: {
    code: `function routes<const T extends readonly string[]>(names: T): T {
  return names;
}

const r = routes(["home", "about"]);
// r is readonly ["home", "about"]

type First = (typeof r)[0];
const ok: First = "home";
const bad: First = "settings";
`,
    highlights: [{ start: 10, end: 10 }],
    caption: "<const T> preserves literal tuple types from the call site.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 10,
        messageIncludes: "settings",
      },
    ],
  },
  insight: [
    "const type parameters apply a const assertion to the inferred argument type.",
    "Library authors use them so callers need not write `as const` at every call.",
    "Combine with `readonly` arrays/tuples when you want immutable literal tables.",
  ],
  quiz: [
    {
      id: "const-param",
      prompt: "What does `<const T>` change about inference?",
      choices: [
        { id: "a", text: "It freezes the runtime value" },
        {
          id: "b",
          text: "It infers the argument as a const-like literal type",
        },
        { id: "c", text: "It requires T to be a class" },
        { id: "d", text: "It disables generics" },
      ],
      answerId: "b",
      explanation:
        "The call site is treated like `as const` for inference purposes.",
    },
  ],
  exercise: {
    prompt:
      "Write keys<const T extends `Record<string, unknown>>`(obj: T): (`keyof` T)[] that returns `Object.keys` cast appropriately, and call it on { a: 1 }.",
    starter: `function keys(obj) {
  return Object.keys(obj);
}

const k = keys({ a: 1 });
`,
    assertion: "no-errors",
    hints: [
      "Use <const T extends `Record<string, unknown>>` and return (`keyof` T)[].",
    ],
    solution: `function keys<const T extends Record<string, unknown>>(
  obj: T,
): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

const k = keys({ a: 1 });
void k;
`,
  },
};
