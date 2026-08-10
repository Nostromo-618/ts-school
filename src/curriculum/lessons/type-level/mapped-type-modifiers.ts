import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "mapped-type-modifiers",
  title: "Modifiers on mapped types",
  tier: "advanced",
  track: "type-level",
  order: 12,
  summary:
    "+? and -? , +`readonly` and -`readonly`. Adding optionality is easy; removing it is the trick behind `Required` and every Mutable helper.",
  prerequisites: ["mapped-types-intro", "optional-and-readonly-properties"],
  keywords: [
    "mapped type",
    "modifier",
    "Required",
    "Mutable",
    "readonly",
    "optional",
  ],
  problem:
    "Re-requiring fields is a pile of `null` checks with no shared type. A type-level transform that widens or distributes incorrectly will type-check while describing the wrong value. Read the conditional or mapped type the way you would read a function — inputs, outputs, and failure cases.",
  solution:
    "strips optionality; -`readonly` strips `readonly`. Prefix modifiers with + or -; + is the default when you write ? or `readonly` alone. `Required<T>` is homomorphic mapped type with -?; `Partial` uses +?. Homomorphic mapped types (K in `keyof` T) preserve property modifiers you do not touch — until you explicitly add or remove them. Make the impossible state unrepresentable, then move on.",
  js: {
    code: `// JS: "required again" means runtime checks scattered everywhere.
function requireConfig(partial) {
  if (partial.host == null) throw new Error("host required");
  if (partial.port == null) throw new Error("port required");
  return partial;
}
`,
    highlights: [{ start: 2, end: 5 }],
    caption:
      "Re-requiring fields is a pile of `null` checks with no shared type.",
  },
  ts: {
    code: `type Partialish<T> = { [K in keyof T]?: T[K] };
type Requiredish<T> = { [K in keyof T]-?: T[K] };
type Mutable<T> = { -readonly [K in keyof T]: T[K] };

type Config = { readonly host: string; port?: number };
type Ready = Requiredish<Partialish<Config>>;
type Editable = Mutable<Config>;

const ready: Ready = { host: "localhost" };
// port is required again after Requiredish
`,
    highlights: [
      { start: 2, end: 2 },
      { start: 9, end: 10 },
    ],
    caption: "-? strips optionality; -`readonly` strips `readonly`.",
    expectedDiagnostics: [
      {
        code: 2741,
        line: 9,
        messageIncludes: "port",
      },
    ],
  },
  insight: [
    "Prefix modifiers with + or -; + is the default when you write ? or `readonly` alone.",
    "`Required<T>` is homomorphic mapped type with -?; `Partial` uses +?.",
    "Homomorphic mapped types (K in `keyof` T) preserve property modifiers you do not touch — until you explicitly add or remove them.",
  ],
  quiz: [
    {
      id: "mod-required",
      prompt: "What does `-?` mean in `{ [K in keyof T]-?: T[K] }`?",
      choices: [
        { id: "a", text: "Make each property optional" },
        { id: "b", text: "Remove optionality from each property" },
        { id: "c", text: "Remove the property entirely" },
        { id: "d", text: "Make each property `readonly`" },
      ],
      answerId: "b",
      explanation:
        "The - operator removes the ? modifier, so optional keys become required.",
    },
  ],
  exercise: {
    prompt:
      "Implement MutableProps<T> that removes `readonly` from every property. The assignment of a `readonly` Config to MutableProps should then allow mutation typing-wise (no error on the object literal assignment shown).",
    starter: `type MutableProps<T> = T; // TODO

type Config = { readonly host: string };
const c: MutableProps<Config> = { host: "x" };
c.host = "y";
`,
    assertion: "no-errors",
    hints: ["Use -`readonly` in a mapped type over `keyof` T."],
    solution: `type MutableProps<T> = { -readonly [K in keyof T]: T[K] };

type Config = { readonly host: string };
const c: MutableProps<Config> = { host: "x" };
c.host = "y";
`,
  },
};
