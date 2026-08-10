import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "void-and-never",
  title: "void and never",
  tier: "intermediate",
  track: "types",
  order: 19,
  summary:
    "`void` means the return value is not to be used; `never` means there is no return value at all. Two very different kinds of nothing.",
  prerequisites: ["exhaustiveness-checking"],
  keywords: ["void", "never", "bottom type", "return type", "throw"],
  problem:
    "Throw vs log look the same without return types. The type system is supposed to make that state unrepresentable — if it does not, callers invent ad-hoc checks and still miss a branch. Model the domain so the illegal mix cannot be constructed. Prefer a model where the illegal state cannot be written down.",
  solution:
    "log returns `void` — not a string. `never` means the function does not return normally. `void` means it returns no useful value — callers should not read it. Use `never` for exhaustive checks and fail-fast helpers. The dual panes are the lesson: left fails, right refuses.",
  js: {
    code: `function fail(msg) {
  throw new Error(msg);
}
function log(msg) {
  console.log(msg);
}
`,
    highlights: [{ start: 1, end: 6 }],
    caption: "Throw vs log look the same without return types.",
  },
  ts: {
    code: `function fail(msg: string): never {
  throw new Error(msg);
}

function log(msg: string): void {
  // side effect only
}

declare function handle(x: string | number): string;

function demo(x: string | number): string {
  if (typeof x === "string") return x;
  if (typeof x === "number") return String(x);
  return fail("unreachable");
}

const v: string = log("x");
`,
    highlights: [{ start: 18, end: 18 }],
    caption: "log returns `void` — not a string.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 17,
        messageIncludes: "Type 'void' is not assignable to type 'string'.",
      },
    ],
  },
  insight: [
    "`never` means the function does not return normally.",
    "`void` means it returns no useful value — callers should not read it.",
    "Use `never` for exhaustive checks and fail-fast helpers.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "How do `void` and `never` differ for function return types?",
      choices: [
        { id: "a", text: "They are identical aliases" },
        {
          id: "b",
          text: "`void` means no useful value; `never` means the function does not return normally",
        },
        { id: "c", text: "never is only for async" },
        { id: "d", text: "`void` means the process exits" },
      ],
      answerId: "b",
      explanation:
        "Callers must not read `void` results. `never` is for throw/infinite loops and exhaustiveness helpers.",
    },
  ],
};
