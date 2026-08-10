import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "unique-symbol",
  title: "unique symbol",
  tier: "advanced",
  track: "types",
  order: 23,
  summary:
    "The one place TypeScript gives a value its own identity in the type system, and the foundation of every branding trick that follows.",
  prerequisites: ["primitive-types", "const-assertions"],
  keywords: ["unique symbol", "symbol", "nominal", "identity", "declare const"],
  problem:
    "Structural typing has no notion of identity, so two types meant to be incompatible are interchangeable unless something breaks the tie.",
  js: {
    code: `// JS: Symbol() creates unique runtime keys — but types do not exist.
const a = Symbol("a");
const b = Symbol("a");
const bag = { [a]: 1 };
console.log(bag[b]); // undefined — different symbols
`,
    highlights: [{ start: 2, end: 5 }],
    caption:
      "Runtime symbols are unique; TypeScript can reflect that in types.",
  },
  ts: {
    code: `declare const A: unique symbol;
declare const B: unique symbol;

type TaggedA = { readonly [A]: void };
type TaggedB = { readonly [B]: void };

const x: TaggedA = { [A]: undefined as void };
const y: TaggedB = x;
`,
    highlights: [{ start: 8, end: 8 }],
    caption: "unique symbol brands are nominally distinct.",
    expectedDiagnostics: [
      {
        code: 2741,
        line: 8,
        messageIncludes: "[B]",
      },
    ],
  },
  insight: [
    "Only `unique symbol` (or `readonly` unique symbol properties) creates a truly nominal singleton type for a symbol.",
    "`declare` const x: unique symbol is the usual pattern for brand keys.",
    "Ordinary symbol types are just symbol — interchangeable and useless for branding.",
  ],
  quiz: [
    {
      id: "unique-sym",
      prompt:
        'Why prefer unique symbol over a string brand key like "__brand"?',
      choices: [
        { id: "a", text: "Strings are illegal in intersections" },
        {
          id: "b",
          text: "unique symbol types cannot collide across declarations",
        },
        { id: "c", text: "Symbols serialize to JSON better" },
        { id: "d", text: "unique symbol is required by Node" },
      ],
      answerId: "b",
      explanation:
        "Each unique symbol declaration has its own type identity; string keys can accidentally match.",
    },
  ],
  exercise: {
    prompt:
      "Declare const Brand: unique symbol and type Branded = { `readonly` [Brand]: true }. Create a value.",
    starter: `const Brand = Symbol("brand");
type Branded = { readonly [Brand]: true };
`,
    assertion: "no-errors",
    hints: [
      "Use `declare` const Brand: unique symbol; then a value with [Brand]: true.",
    ],
    solution: `declare const Brand: unique symbol;
type Branded = { readonly [Brand]: true };

const value: Branded = { [Brand]: true };
void value;
`,
  },
};
