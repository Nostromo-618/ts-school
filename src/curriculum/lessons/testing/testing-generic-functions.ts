import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "testing-generic-functions",
  title: "Testing generic code",
  tier: "intermediate",
  track: "testing",
  order: 7,
  summary:
    "A generic function is not one function. Choosing the instantiations worth testing, and testing the constraint as well as the behaviour.",
  prerequisites: ["generic-constraints", "typing-your-test-files"],
  keywords: ["generic", "instantiation", "constraint", "coverage", "test"],
  problem:
    "Testing a generic helper with one type argument tests one instantiation and tells you nothing about the rest. Look at the left pane: only runtime equality checked. Edit-time tools are silent, so the mistake travels with the deploy until a concrete input detonates it.",
  solution:
    "Type-level Equal `asserts` inference. false is not true. Test generics at the type level as well as runtime. Helpers like Expect/Equal catch inference regressions. Keep type tests in `.ts` files checked by `tsc`. That is the whole move: make the broken path unrepresentable (or at least loudly illegal) before it reaches production.",
  js: {
    code: `expect(identity(1)).toBe(1);
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Only runtime equality checked.",
  },
  ts: {
    code: `function identity<T>(x: T): T {
  return x;
}
const n: number = identity(1);
const s: string = identity("a");
// Compile-time assertion pattern:
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
  ? true
  : false;
type Ok = Equal<ReturnType<typeof identity<number>>, number>;
const ok: Ok = true;
const bad: Ok = false;
`,
    highlights: [{ start: 12, end: 12 }],
    caption: "Type-level Equal `asserts` inference. false is not true.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 12,
        messageIncludes: "Type 'false' is not assignable to type 'true'.",
      },
    ],
  },
  insight: [
    "Test generics at the type level as well as runtime.",
    "Helpers like Expect/Equal catch inference regressions.",
    "Keep type tests in `.ts` files checked by `tsc`.",
  ],
};
