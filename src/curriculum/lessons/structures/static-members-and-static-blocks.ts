import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "static-members-and-static-blocks",
  title: "Static members",
  tier: "intermediate",
  track: "structures",
  order: 17,
  summary:
    "Statics, static blocks, and the type of the class itself — which is what you need when a function takes a class rather than an instance.",
  prerequisites: ["classes-intro", "call-and-construct-signatures"],
  keywords: ["static", "static block", "class type", "typeof class", "factory"],
  problem:
    "`typeof` MyClass and MyClass are different types, and the error message uses both words without distinguishing them. Look at the left pane: static mutable state with no types. Edit-time tools are silent, so the mistake travels with the deploy until a concrete input detonates it.",
  solution:
    "Static bump returns number. Static blocks initialize per class evaluation. Private static fields keep counters encapsulated. Prefer modules for singletons when inheritance is not required. Once the types name the contract, the same edit that would have shipped quietly becomes a red squiggle at the call site instead.",
  js: {
    code: `class Counter { static n = 0; static bump() { Counter.n++; } }
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Static mutable state with no types.",
  },
  ts: {
    code: `class Counter {
  static #n = 0;
  static {
    Counter.#n = 0;
  }
  static bump(): number {
    Counter.#n += 1;
    return Counter.#n;
  }
}
const n: number = Counter.bump();
const bad: string = Counter.bump();
`,
    highlights: [{ start: 12, end: 12 }],
    caption: "Static bump returns number.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 12,
        messageIncludes: "Type 'number' is not assignable to type 'string'",
      },
    ],
  },
  insight: [
    "Static blocks initialize per class evaluation.",
    "Private static fields keep counters encapsulated.",
    "Prefer modules for singletons when inheritance is not required.",
  ],
};
