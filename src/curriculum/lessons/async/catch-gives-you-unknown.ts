import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "catch-gives-you-unknown",
  title: "catch gives you unknown",
  tier: "intermediate",
  track: "async",
  order: 5,
  summary:
    "JavaScript lets you throw anything, so a caught value is `unknown` under useUnknownInCatchVariables. What to do with it before assuming it is an Error.",
  prerequisites: ["unknown-vs-any", "async-await-typing"],
  keywords: [
    "catch",
    "unknown",
    "useUnknownInCatchVariables",
    "error",
    "throw",
  ],
  problem:
    "err.message on a caught value crashes with a different error whenever something threw a string. Assuming catch binding is Error. Catch bindings are `unknown` in modern TS configs.",
  solution:
    "Under useUnknownInCatchVariables / `strict`, e is `unknown` — no .message. catch bindings are `unknown` in modern TS configs. Narrow with `instanceof` Error before reading message. Never type catch as `any` to silence this.",
  js: {
    code: `try { await run(); } catch (e) { log(e.message); }
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Assuming catch binding is Error.",
  },
  ts: {
    code: `declare function run(): Promise<void>;
declare function log(msg: string): void;

export async function main(): Promise<void> {
  try {
    await run();
  } catch (e) {
    log(e.message);
  }
}
`,
    highlights: [{ start: 8, end: 8 }],
    caption:
      "Under useUnknownInCatchVariables / `strict`, e is `unknown` — no .message.",
    expectedDiagnostics: [
      {
        code: 18046,
        line: 8,
        messageIncludes: "'e' is of type 'unknown'.",
      },
    ],
  },
  insight: [
    "catch bindings are `unknown` in modern TS configs.",
    "Narrow with `instanceof` Error before reading message.",
    "Never type catch as `any` to silence this.",
  ],
  security: {
    title: "Error messages can leak internals",
    body: "Log carefully; do not return raw exception strings to clients.",
    severity: "info",
  },
  exercise: {
    prompt:
      "Narrow e with `instanceof` Error before reading .message (else `String`(e)). Match the solution text.",
    starter: `declare function run(): Promise<void>;
declare function log(msg: string): void;

export async function main(): Promise<void> {
  try {
    await run();
  } catch (e) {
    log(e.message);
  }
}
`,
    assertion: "no-errors",
    hints: ["if (e `instanceof` Error) log(e.message); else log(`String`(e));"],
    solution: `declare function run(): Promise<void>;
declare function log(msg: string): void;

export async function main(): Promise<void> {
  try {
    await run();
  } catch (e) {
    if (e instanceof Error) log(e.message);
    else log(String(e));
  }
}
`,
  },
};
