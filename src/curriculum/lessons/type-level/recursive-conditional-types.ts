import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "recursive-conditional-types",
  title: "Recursive conditional types",
  tier: "advanced",
  track: "type-level",
  order: 15,
  summary:
    "Conditional types that call themselves: DeepReadonly, DeepPartial, flattening, and the instantiation-depth limit that ends the fun.",
  prerequisites: [
    "recursive-types",
    "distributive-conditional-types",
    "mapped-type-modifiers",
  ],
  keywords: [
    "recursion",
    "DeepPartial",
    "DeepReadonly",
    "depth limit",
    "tail recursion",
  ],
  problem:
    "Type instantiation is excessively deep and possibly infinite is the error where type-level programming stops being free. Look at the left pane: runtime deep-freeze cannot make nested fields `readonly` in types. The language will happily evaluate it; only a later runtime path reveals the damage.",
  solution:
    "DeepReadonly recurses; assignment to a nested field fails. Recursive conditionals are powerful and expensive — each instantiation costs checker work. TypeScript caps instantiation depth; pathological recursion yields `TS2589`. Prefer depth limits, leaf special-cases (Date, Map), and simpler `Partial` when “deep” is not worth it. Treat the TypeScript pane as the worked example of that refusal — diagnostics included — and the takeaways as what should stick after you leave the page.",
  js: {
    code: `// JS: deep-freeze by walking at runtime — no compile-time depth story.
function deepFreeze(obj) {
  Object.freeze(obj);
  for (const v of Object.values(obj)) {
    if (v && typeof v === "object") deepFreeze(v);
  }
  return obj;
}
`,
    highlights: [{ start: 2, end: 7 }],
    caption: "Runtime deep-freeze cannot make nested fields `readonly` in types.",
  },
  ts: {
    code: `type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K];
};

type Config = { db: { host: string } };
type Frozen = DeepReadonly<Config>;

const cfg: Frozen = { db: { host: "x" } };
cfg.db.host = "y";
`,
    highlights: [
      { start: 1, end: 5 },
      { start: 11, end: 11 },
    ],
    caption: "DeepReadonly recurses; assignment to a nested field fails.",
    expectedDiagnostics: [
      {
        code: 2540,
        line: 11,
        messageIncludes: "read-only",
      },
    ],
  },
  insight: [
    "Recursive conditionals are powerful and expensive — each instantiation costs checker work.",
    "TypeScript caps instantiation depth; pathological recursion yields `TS2589`.",
    "Prefer depth limits, leaf special-cases (Date, Map), and simpler `Partial` when “deep” is not worth it.",
  ],
  quiz: [
    {
      id: "rec-depth",
      prompt: "What typically causes “Type instantiation is excessively deep”?",
      choices: [
        { id: "a", text: "Using `any`" },
        {
          id: "b",
          text: "A recursive type that expands without a decreasing measure",
        },
        { id: "c", text: "Missing `strictNullChecks`" },
        { id: "d", text: "Too many imports" },
      ],
      answerId: "b",
      explanation:
        "Unbounded or slowly decreasing recursive expansions hit the instantiation depth limit.",
    },
  ],
  exercise: {
    prompt:
      "Implement DeepPartial<T> so nested objects become optional at every level. Assign a partial nested object without error.",
    starter: `type DeepPartial<T> = T; // TODO

type C = { a: { b: string } };
const x: DeepPartial<C> = { a: {} };
`,
    assertion: "no-errors",
    hints: [
      "Map keys to DeepPartial<T[K]> | `undefined` with ?.",
      "Stop recursion on non-objects if you like; object recursion is enough here.",
    ],
    solution: `type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

type C = { a: { b: string } };
const x: DeepPartial<C> = { a: {} };
void x;
`,
  },
};
