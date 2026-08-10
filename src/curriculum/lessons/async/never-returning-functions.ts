import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "never-returning-functions",
  title: "Functions that never return",
  tier: "intermediate",
  track: "async",
  order: 13,
  summary:
    "`never`-returning helpers (`process.exit`, always-throw, `assertNever`) tell control-flow analysis that execution stops.",
  prerequisites: ["void-and-never", "custom-error-classes"],
  keywords: [
    "never",
    "process.exit",
    "assertNever",
    "control flow",
    "throw helper",
  ],
  problem:
    "You extract `throw new Error(...)` into `abort()` typed as returning `void`. After the call, TypeScript still thinks execution continues, so a value that should be narrowed stays possibly `null` and later code is wrongly reachable. The same trap hits `process.exit` wrappers. Looking like a normal call is the fragile pattern when the function never returns.",
  solution:
    "Annotate abort/exit helpers as returning `never` so control-flow analysis treats the call as a hard stop. The TypeScript pane shows how `never` unlocks narrowing that a `void` throw helper leaves broken. Mark `process.exit` wrappers as `never` too. Do not use `never` for functions that sometimes return — that lies to CFA and hides real bugs.",
  js: {
    code: `function abort() { process.exit(1); }
`,
    highlights: [{ start: 1, end: 1 }],
    caption:
      "A throw/exit helper that looks ordinary leaves later code wrongly reachable.",
  },
  ts: {
    code: `declare function exit(code: number): never;

function abort(): never {
  exit(1);
}

function withNever(x: string | null): string {
  if (x === null) abort();
  return x;
}

function fail(): void {
  throw new Error("boom");
}

function withVoid(x: string | null): string {
  if (x === null) fail();
  return x;
}
`,
    highlights: [{ start: 18, end: 18 }],
    caption: "`never` makes `abort()` a hard stop for control-flow analysis.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 18,
        messageIncludes: "null",
      },
    ],
  },
  insight: [
    "`never` helps control-flow analysis after abort/throw.",
    "Mark `process.exit` wrappers as `never`.",
    "Do not use `never` for functions that sometimes return.",
  ],
};
