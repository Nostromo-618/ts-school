import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "type-widening-and-freshness",
  title: "Widening and freshness",
  tier: "intermediate",
  track: "types",
  order: 20,
  summary:
    "Why the same literal has one type in a const, another in a let, and a third when passed directly to a parameter — and how to control which you get.",
  prerequisites: ["const-assertions", "object-type-literals"],
  keywords: [
    "widening",
    "freshness",
    "literal type",
    "excess property",
    "inference",
  ],
  problem:
    "Extracting an object literal into a variable turns a compile error into silence, or silence into a compile error, with no other change. mode silently becomes a general string.",
  solution:
    "string is not assignable to 'read' | 'write'. let often widens literals to string; const preserves them. Fresh object literals get excess property checks; variables do not. Annotate let when you need a literal union.",
  js: {
    code: `let mode = "read";
setMode(mode);
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "mode silently becomes a general string.",
  },
  ts: {
    code: `declare function setMode(m: "read" | "write"): void;

let mode = "read";
setMode(mode);

const modeConst = "read";
setMode(modeConst);

let widened: string = "read";
setMode(widened);
`,
    highlights: [{ start: 10, end: 10 }],
    caption: "string is not assignable to 'read' | 'write'.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 4,
        messageIncludes: "Argument of type 'string' is not assignable to p",
      },
      {
        code: 2345,
        line: 10,
        messageIncludes: "Argument of type 'string' is not assignable to p",
      },
    ],
  },
  insight: [
    "let often widens literals to string; const preserves them.",
    "Fresh object literals get excess property checks; variables do not.",
    "Annotate let when you need a literal union.",
  ],
  quiz: [
    {
      id: "q1",
      prompt:
        "Why does a `let` string often refuse a literal-parameter API that a `const` literal accepts?",
      choices: [
        { id: "a", text: "let is erased at runtime" },
        {
          id: "b",
          text: "let commonly widens to string; const keeps the literal type",
        },
        { id: "c", text: "const disables excess property checks" },
        { id: "d", text: "let always means `any`" },
      ],
      answerId: "b",
      explanation:
        "Widening turns a fresh literal into string (or number), so call sites that expect a narrow literal union fail until you annotate or use const.",
    },
  ],
};
