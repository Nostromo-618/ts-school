import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "function-utility-types",
  title: "Utility types for functions",
  tier: "intermediate",
  track: "type-level",
  order: 5,
  summary:
    "`ReturnType`, `Parameters`, `ConstructorParameters`, `ThisParameterType`, `Awaited` — deriving types from a signature you already have.",
  prerequisites: ["utility-types-tour", "function-type-expressions"],
  keywords: ["ReturnType", "Parameters", "Awaited", "signature", "derive"],
  problem:
    "Extracting callback shapes by hand. A type-level transform that widens or distributes incorrectly will type-check while describing the wrong value. Read the conditional or mapped type the way you would read a function — inputs, outputs, and failure cases. Hover the resulting type; if it widened, the transform is wrong.",
  solution:
    "`Parameters<Fn>`[0] is number, not string. `Parameters` and `ReturnType` extract call signatures. `ConstructorParameters` / `InstanceType` do the same for classes. Use them to stay DRY with third-party function types. Prefer the smallest honest type that still rejects the bad input.",
  js: {
    code: `function call(fn, arg) { return fn(arg); }
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Extracting callback shapes by hand.",
  },
  ts: {
    code: `type Fn = (n: number) => string;
type Arg = Parameters<Fn>[0];
type Ret = ReturnType<Fn>;
const a: Arg = 1;
const r: Ret = "x";
const bad: Arg = "1";
`,
    highlights: [{ start: 6, end: 6 }],
    caption: "`Parameters<Fn>`[0] is number, not string.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 6,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "`Parameters` and `ReturnType` extract call signatures.",
    "`ConstructorParameters` / `InstanceType` do the same for classes.",
    "Use them to stay DRY with third-party function types.",
  ],
};
