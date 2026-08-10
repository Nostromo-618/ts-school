import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "generic-async-wrappers",
  title: "Wrappers that keep the signature",
  tier: "advanced",
  track: "async",
  order: 14,
  summary:
    "Write `withRetry` / `withTimeout` so variadic generics preserve the wrapped function's parameters and return type.",
  prerequisites: ["variadic-tuple-types", "abortsignal-and-cancellation"],
  keywords: [
    "retry",
    "timeout",
    "wrapper",
    "decorator",
    "variadic tuple",
    "generic",
  ],
  problem:
    "A retry helper is typed as `(...args: any[]) => any`. Every function you wrap becomes untyped at the call site — parameters, return promise, and generics all erased. One utility then undoes careful signatures across the codebase. Untyped wrappers are the failure mode; the runtime retry logic can be fine while the types are not.",
  solution:
    "Capture parameters and return type with variadic generics (`A extends any[]`, `R`) so the wrapped async signature survives. Inference should let callers keep autocomplete and checking as if they called the original function. The dual panes exist to contrast erasure with preservation — keep that contrast sharp. Start with one wrapper done right before adding timeout, span, and logging variants.",
  js: {
    code: `// JS: wrap and hope.
function withRetry(fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch {
      return await fn(...args);
    }
  };
}
`,
    highlights: [{ start: 2, end: 10 }],
    caption:
      "An `(...args: any[]) => any` wrapper erases every wrapped signature.",
  },
  ts: {
    code: `function withRetry<A extends unknown[], R>(
  fn: (...args: A) => Promise<R>,
): (...args: A) => Promise<R> {
  return async (...args: A) => {
    try {
      return await fn(...args);
    } catch {
      return await fn(...args);
    }
  };
}

async function loadUser(id: string): Promise<{ id: string }> {
  return { id };
}

const load = withRetry(loadUser);
const user = await load("u1");
const bad: number = user.id;
`,
    highlights: [{ start: 19, end: 19 }],
    caption:
      "Variadic type parameters keep the wrapped async signature intact.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 19,
        messageIncludes: "string",
      },
    ],
  },
  insight: [
    "Capture parameters as a tuple type A extends `unknown`[] and the Promise result as R.",
    "Avoid `any` in wrapper signatures — that is how types leak out of a whole call graph.",
    "The same pattern types withTimeout / withSpan / withLogging.",
  ],
  quiz: [
    {
      id: "wrap-q",
      prompt:
        "Why use A extends `unknown`[] instead of `any`[] for wrapper args?",
      choices: [
        { id: "a", text: "`any`[] is a syntax error" },
        { id: "b", text: "Tuple inference preserves each parameter’s type" },
        { id: "c", text: "`unknown`[] is shorter" },
        { id: "d", text: "Promise requires `unknown`[]" },
      ],
      answerId: "b",
      explanation:
        "A generic tuple type keeps positional types; `any`[] collapses them.",
    },
  ],
  exercise: {
    prompt:
      "Write withLog that wraps (...args: A) => `Promise<R>` and returns the same signature, calling fn once.",
    starter: `function withLog(fn: Function) {
  return fn;
}
`,
    assertion: "no-errors",
    hints: [
      "Generic A extends `unknown`[], R; return async (...args: A) => fn(...args).",
    ],
    solution: `function withLog<A extends unknown[], R>(
  fn: (...args: A) => Promise<R>,
): (...args: A) => Promise<R> {
  return async (...args: A) => fn(...args);
}

async function add(a: number, b: number) {
  return a + b;
}
const logged = withLog(add);
void logged(1, 2);
`,
  },
};
