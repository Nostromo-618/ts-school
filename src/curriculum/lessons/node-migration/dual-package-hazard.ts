import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "dual-package-hazard",
  title: "The dual-package hazard",
  tier: "advanced",
  track: "node-migration",
  order: 20,
  summary:
    "Shipping CommonJS and ESM builds means two copies of your module and two copies of its types. What breaks, and the conditions that avoid it.",
  prerequisites: ["package-json-exports-and-types"],
  keywords: ["dual package", "conditional exports", "cjs", "esm", "instanceof"],
  problem:
    "Two copies of the same class mean `instanceof` fails between them, and TypeScript may treat the types as unrelated even when the source looks identical. Duplicate module instances break identity checks — a classic dual-package hazard when CJS and ESM graphs both load 'the same' library.",
  solution:
    "Branded or duplicated copies are not interchangeable. Prefer a single module format for libraries when you can; dual publishing needs careful `exports`. Do not trust `instanceof` or singletons across duplicated copies. `@arethetypeswrong` and Node's dual-package docs spell out the hazard conditions — verify before you publish.",
  js: {
    code: `// JS dual packages: two evaluations of the same class file.
// instanceof across CJS/ESM copies returns false for "the same" class.
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "Duplicate module instances break identity checks.",
  },
  ts: {
    code: `declare const copyA: unique symbol;
declare const copyB: unique symbol;

type TokenA = { value: string; readonly [copyA]: void };
type TokenB = { value: string; readonly [copyB]: void };

function acceptA(t: TokenA) {
  void t.value;
}

const fromB: TokenB = { value: "x", [copyB]: undefined as void };
acceptA(fromB);
`,
    highlights: [{ start: 12, end: 12 }],
    caption:
      "Branded copies are not interchangeable — like dual package instances.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 12,
        messageIncludes: "TokenA",
      },
    ],
  },
  insight: [
    "Prefer a single module format for libraries when possible; dual publishing needs careful exports.",
    "`instanceof` and singletons are unsafe across duplicated copies.",
    "@arethetypeswrong and Node’s dual-package docs describe the hazard conditions.",
  ],
  security: {
    title: "Identity checks across copies",
    body: "Security checks that use `instanceof` Error/Token across package boundaries can fail open or closed incorrectly when two copies exist. Prefer duck-typing with brands or shared symbols from one package.",
    severity: "caution",
  },
  quiz: [
    {
      id: "dual-q",
      prompt: "Classic dual-package runtime symptom?",
      choices: [
        { id: "a", text: "`tsc` runs faster" },
        { id: "b", text: "`instanceof` fails between CJS and ESM copies" },
        { id: "c", text: "`JSON.parse` throws" },
        { id: "d", text: "pnpm cannot install" },
      ],
      answerId: "b",
      explanation: "Two evaluations mean two constructor identities.",
    },
  ],
  exercise: {
    prompt:
      "Define a single Token class and a function accept(t: Token) used from one module graph only.",
    starter: `class Token {
  constructor(public value: string) {}
}
function accept(t: Token) {
  void t;
}
`,
    assertion: "no-errors",
    hints: ["Construct Token and pass it to accept."],
    solution: `class Token {
  constructor(public value: string) {}
}
function accept(t: Token) {
  void t.value;
}
accept(new Token("x"));
`,
  },
};
