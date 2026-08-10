import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "narrowing-untrusted-objects",
  title: "Inspecting an object you did not create",
  tier: "intermediate",
  track: "runtime-boundary",
  order: 12,
  summary:
    "in, `Object.hasOwn`, and prototype-chain surprises. Why __proto__ and constructor deserve special handling before you touch anything else.",
  prerequisites: ["user-defined-type-guards", "in-operator-narrowing"],
  keywords: [
    "prototype pollution",
    "hasOwn",
    "in operator",
    "__proto__",
    "untrusted",
  ],
  problem:
    "'toString' in payload is true for every object ever created, which makes the obvious presence check useless as a validator.",
  js: {
    code: `function looksLikeConfig(payload) {
  // True for {}, and for anything that inherits Object.prototype.
  if ("toString" in payload && "name" in payload) {
    return payload.name;
  }
  return null;
}

looksLikeConfig({ name: "ok" });
looksLikeConfig(JSON.parse('{"__proto__":{"admin":true},"name":"x"}'));
`,
    highlights: [{ start: 3, end: 5 }],
    caption:
      "`in` walks the prototype chain — inherited keys look like own data.",
  },
  ts: {
    code: `type Config = { name: string };

function readName(payload: object): string | null {
  // Object.hasOwn ignores the prototype chain.
  if (Object.hasOwn(payload, "name")) {
    const name = (payload as { name: unknown }).name;
    return typeof name === "string" ? name : null;
  }
  return null;
}

declare const raw: object;
const name = readName(raw);

// \`in\` still sees inherited keys — do not treat it as ownership:
function badGuard(payload: object): payload is Config {
  return "toString" in payload && "name" in payload;
}

const forged = {} as object;
if (badGuard(forged)) {
  const n: number = forged.name;
}
`,
    highlights: [
      { start: 5, end: 5 },
      { start: 22, end: 22 },
    ],
    caption:
      "Prefer `Object.hasOwn` for untrusted keys. The deliberate assign shows a bad `in`-based guard still leaves a string, not a number.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 22,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "`key in obj` is true for inherited properties — useless as an allowlist for JSON payloads.",
    "`Object.hasOwn(obj, key)` (or `Object.prototype`.hasOwnProperty.call) checks own keys only.",
    "Reject `__proto__`, `constructor`, and `prototype` keys before merging untrusted objects into config.",
  ],
  security: {
    title: "Prototype pollution rides on careless key checks",
    body: "Attackers send `__proto__` or nested merge payloads so inherited properties change application behaviour. Never use `in` alone to validate untrusted objects, and `never` merge raw JSON into `Object.prototype`-backed maps without key filtering.",
    severity: "critical",
  },
  quiz: [
    {
      id: "nuo-1",
      prompt: 'Why is `"toString" in payload` a bad validator check?',
      choices: [
        { id: "a", text: "toString is deprecated." },
        {
          id: "b",
          text: "It is true for ordinary objects via the prototype chain.",
        },
        { id: "c", text: "TypeScript forbids the in operator." },
      ],
      answerId: "b",
      explanation:
        "Almost every object inherits `Object.prototype`.toString, so the check `never` fails for normal objects.",
    },
  ],
};
