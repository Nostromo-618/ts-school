import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "never-returning-functions",
  title: "Functions that never return",
  tier: "intermediate",
  track: "async",
  order: 13,
  summary:
    "`process.exit`, a function that always throws, and assertNever — how `never` lets control-flow analysis see past a call.",
  prerequisites: ["void-and-never", "custom-error-classes"],
  keywords: [
    "never",
    "process.exit",
    "assertNever",
    "control flow",
    "throw helper",
  ],
  problem:
    "Extracting throw new Error(...) into a helper makes the checker believe execution continues, and the code after it becomes reachable.",
  js: {
    code: `function abort() { process.exit(1); }
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "exit looks like a normal call.",
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
    caption:
      "`never` makes abort() an exit for CFA; a `void` throw helper leaves x possibly `null`.",
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
