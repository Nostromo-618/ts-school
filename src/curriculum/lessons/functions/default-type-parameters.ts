import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "default-type-parameters",
  title: "Default type parameters",
  tier: "intermediate",
  track: "functions",
  order: 10,
  summary:
    "T = `unknown` gives a generic a sensible zero value, which is how a library stays usable without every call site spelling out its types.",
  prerequisites: ["generic-constraints"],
  keywords: [
    "default type parameter",
    "generic default",
    "api design",
    "unknown",
  ],
  problem:
    "Adding a type parameter to a published type is a breaking change unless it has a default. Look at the left pane: box with no default element type. Edit-time tools are silent, so the mistake travels with the deploy until a concrete input detonates it.",
  solution:
    "Default T=string when unargued. a.value is string, not number. Default type parameters kick in when inference cannot. Useful for option bags and empty collections. Document defaults — callers may not notice them. Treat the TypeScript pane as the worked example of that refusal — diagnostics included — and the takeaways as what should stick after you leave the page.",
  js: {
    code: `function box(value) { return { value }; }
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Box with no default element type.",
  },
  ts: {
    code: `function box<T = string>(value: T): { value: T } {
  return { value };
}
const a = box("hi");
const b = box(1);
const c = box();
const bad: number = a.value;
`,
    highlights: [{ start: 6, end: 7 }],
    caption: "Default T=string when unargued. a.value is string, not number.",
    expectedDiagnostics: [
      {
        code: 2554,
        line: 6,
        messageIncludes: "Expected 1 arguments, but got 0.",
      },
      {
        code: 2322,
        line: 7,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "Default type parameters kick in when inference cannot.",
    "Useful for option bags and empty collections.",
    "Document defaults — callers may not notice them.",
  ],
};
