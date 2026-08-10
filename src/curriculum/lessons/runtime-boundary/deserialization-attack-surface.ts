import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "deserialization-attack-surface",
  title: "Deserialization as an attack surface",
  tier: "advanced",
  track: "runtime-boundary",
  order: 16,
  summary:
    "Prototype pollution, `JSON.parse` revivers, `structuredClone`, and merge helpers — the places where parsing untrusted data changes your program rather than describing it.",
  prerequisites: ["narrowing-untrusted-objects"],
  keywords: [
    "prototype pollution",
    "reviver",
    "structuredClone",
    "merge",
    "security",
  ],
  problem:
    "Merging untrusted keys can pollute `Object.prototype`. Types erase at runtime, so a boundary annotation without a check is a claim, not a proof. Parse or validate before you trust fields — especially for JSON, HTTP, and env. Validate before field access — annotations are not runtime checks.",
  solution:
    "Allowlists + skipped proto keys; name is still string | `undefined`. Never deep-merge untrusted objects onto prototypes or shared config. Allowlist keys; reject __proto__, prototype, and constructor. Types describe intent after a safe parse — they do not make merge safe. Public APIs first; loosen only where you can name the tradeoff.",
  js: {
    code: `// JS: recursive merge trusts keys like __proto__.
function merge(target, source) {
  for (const key of Object.keys(source)) {
    target[key] = source[key];
  }
  return target;
}
merge({}, JSON.parse('{"__proto__":{"polluted":true}}'));
`,
    highlights: [{ start: 2, end: 8 }],
    caption: "Merging untrusted keys can pollute `Object.prototype`.",
  },
  ts: {
    code: `type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

function parseJson(text: string): Json {
  return JSON.parse(text) as Json;
}

const SAFE = new Set(["name", "email"]);

function pickSafe(input: { [k: string]: Json }): { name?: string } {
  const out: { name?: string } = {};
  for (const key of Object.keys(input)) {
    if (!SAFE.has(key)) continue;
    if (key === "__proto__" || key === "constructor") continue;
    const v = input[key];
    if (typeof v === "string") out.name = v;
  }
  return out;
}

const raw = parseJson('{"name":"Ada"}');
if (typeof raw === "object" && raw && !Array.isArray(raw)) {
  const user = pickSafe(raw);
  const n: number = user.name;
  void n;
}
`,
    highlights: [{ start: 24, end: 24 }],
    caption:
      "Allowlists + skipped proto keys; name is still string | `undefined`.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 23,
        messageIncludes: "number",
      },
    ],
  },
  insight: [
    "Never deep-merge untrusted objects onto prototypes or shared config.",
    "Allowlist keys; reject __proto__, prototype, and constructor.",
    "Types describe intent after a safe parse — they do not make merge safe.",
  ],
  security: {
    title: "Prototype pollution",
    body: "Recursive assignment of attacker-controlled keys can alter `Object.prototype` and bypass authorization checks that look like ordinary property reads. Treat merge/reviver paths as critical.",
    severity: "critical",
  },
  quiz: [
    {
      id: "proto-q",
      prompt: "Safest approach when accepting JSON objects?",
      choices: [
        { id: "a", text: "Deep-merge onto a shared defaults object" },
        {
          id: "b",
          text: "Allowlist known keys and ignore prototype-sensitive names",
        },
        { id: "c", text: "`JSON.parse` and cast to `any`" },
        { id: "d", text: "Use eval" },
      ],
      answerId: "b",
      explanation:
        "Allowlists avoid unexpected keys including prototype pollution vectors.",
    },
  ],
  exercise: {
    prompt:
      "Write function isPlainObject(x: `unknown`): x is `Record<string, unknown>` using `typeof` and prototype checks.",
    starter: `function isPlainObject(x: unknown): x is Record<string, unknown> {
  return false;
}
`,
    assertion: "no-errors",
    hints: ['`typeof` x === "object" && x !== `null` && !`Array.isArray`(x)'],
    solution: `function isPlainObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

void isPlainObject({ a: 1 });
`,
  },
};
