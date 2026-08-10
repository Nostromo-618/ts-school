import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "typing-process-env",
  title: "process.env is not a config object",
  tier: "intermediate",
  track: "node-migration",
  order: 12,
  summary:
    "Every variable is string | `undefined`. Parsing environment into a validated config object once, at startup, instead of reading it forty times.",
  prerequisites: ["schema-validation-libraries", "node-builtin-modules"],
  keywords: ["process.env", "config", "environment", "validation", "12 factor"],
  problem:
    "`process.env.FOO` is `string | undefined`, but code treats it as a definite string — or worse, calls `Number` on it and ships `NaN`. Env typing is the first boundary most services get wrong.",
  solution:
    "Read env once into a validated config object. Narrow or default each variable; fail fast on missing required keys. Do not sprinkle `process.env` reads through the app. Types describe the config you validated — they do not load `.env` for you.",
  js: {
    code: `const port = process.env.PORT;
listen(port);
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "Passing `process.env`.PORT straight into listen.",
  },
  ts: {
    code: `declare const process: { env: Record<string, string | undefined> };

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === "") {
    throw new Error("Missing env " + name);
  }
  return value;
}

function parsePort(raw: string): number {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > 65535) {
    throw new Error("invalid PORT");
  }
  return n;
}

export const port = parsePort(requireEnv("PORT"));
const bad: number = process.env.PORT;
`,
    highlights: [{ start: 20, end: 20 }],
    caption:
      "Require and parse. Env values are string | `undefined`, not number.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 20,
        messageIncludes: "Type 'string | undefined' is not assignable to t",
      },
    ],
  },
  insight: [
    "Env values are string | `undefined` until you parse them.",
    "Build a typed config object at startup.",
    "Treat empty string as missing.",
  ],
  security: {
    title: "Env vars are operator-controlled input",
    body: "Validate formats before use so a bad deploy fails startup. Never log secret values.",
    severity: "caution",
  },
  exercise: {
    prompt:
      "Write parseBoolEnv(raw: string): boolean for true/false/1/0 (case-insensitive).",
    starter: `export function parseBoolEnv(raw: string): boolean {
  throw new Error("TODO");
}
`,
    assertion: "no-errors",
    solution: `export function parseBoolEnv(raw: string): boolean {
  const v = raw.trim().toLowerCase();
  if (v === "true" || v === "1") return true;
  if (v === "false" || v === "0") return false;
  throw new Error("invalid boolean env: " + raw);
}
`,
  },
};
