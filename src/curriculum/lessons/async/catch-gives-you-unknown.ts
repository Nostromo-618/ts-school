import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "catch-gives-you-unknown",
  title: "catch gives you unknown",
  tier: "intermediate",
  track: "async",
  order: 5,
  summary:
    "JavaScript lets you throw anything, so under `useUnknownInCatchVariables` a caught value is `unknown` until you narrow it.",
  prerequisites: ["unknown-vs-any", "async-await-typing"],
  keywords: [
    "catch",
    "unknown",
    "useUnknownInCatchVariables",
    "error",
    "throw",
  ],
  problem:
    "A catch block reads `e.message` as if every throw were an `Error`. Something upstream threw a string (or a plain object), and the handler crashes with a second TypeError while trying to log the first failure. The original bug is gone; now you are debugging the logger. Assuming the catch binding is always `Error` is the fragile pattern.",
  solution:
    "With `useUnknownInCatchVariables` (part of modern `strict` setups), `e` is `unknown` — the TypeScript pane blocks `.message` until you prove the shape. Narrow with `instanceof Error` (or a type guard) before reading fields; otherwise stringify deliberately. Do not silence this with `catch (e: any)` — that restores the crash. Treat catch as an untrusted boundary the same way you treat `JSON.parse`.",
  js: {
    code: `try { await run(); } catch (e) { log(e.message); }
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Reading `.message` assumes every throw is an `Error`.",
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
      "Under `useUnknownInCatchVariables`, `e` is `unknown` — no `.message` yet.",
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
