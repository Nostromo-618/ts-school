import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "template-literal-inference",
  title: "Parsing strings in the type system",
  tier: "advanced",
  track: "type-level",
  order: 16,
  summary:
    "`infer inside` a template literal type turns a string into structure: route parameters, query keys, and typed string builders.",
  prerequisites: ["template-literal-types-intro", "infer-keyword"],
  keywords: ["template literal", "infer", "parse", "route params", "string"],
  problem:
    "Parameter names are untyped strings in plain JS routers. A type-level transform that widens or distributes incorrectly will type-check while describing the wrong value. Read the conditional or mapped type the way you would read a function — inputs, outputs, and failure cases. Hover the resulting type; if it widened, the transform is wrong.",
  solution:
    "`infer walks` the template; wrong param names are not assignable. Template literal types + `infer are` a parser: match a prefix, bind a piece, recurse on the rest. Keep grammars small — string parsers explode compile time quickly. Frameworks use this for typed routes; prefer codegen when the string language gets rich. Public APIs first; loosen only where you can name the tradeoff.",
  js: {
    code: `// JS: route params are strings looked up by name — typos are runtime 404s.
function param(path, name) {
  const parts = path.split("/");
  const i = parts.indexOf(":" + name);
  return i >= 0 ? parts[i] : undefined;
}

param("/users/:id", "Id"); // typo, silent miss
`,
    highlights: [{ start: 7, end: 7 }],
    caption: "Parameter names are untyped strings in plain JS routers.",
  },
  ts: {
    code: `type ExtractParams<S extends string> =
  S extends \`\${string}:\${infer P}/\${infer Rest}\`
    ? P | ExtractParams<Rest>
    : S extends \`\${string}:\${infer P}\`
      ? P
      : never;

type Params = ExtractParams<"/users/:id/posts/:postId">;
// "id" | "postId"

const need: Params = "userId";
`,
    highlights: [
      { start: 1, end: 6 },
      { start: 11, end: 11 },
    ],
    caption:
      "`infer walks` the template; wrong param names are not assignable.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 11,
        messageIncludes: "userId",
      },
    ],
  },
  insight: [
    "Template literal types + `infer are` a parser: match a prefix, bind a piece, recurse on the rest.",
    "Keep grammars small — string parsers explode compile time quickly.",
    "Frameworks use this for typed routes; prefer codegen when the string language gets rich.",
  ],
  quiz: [
    {
      id: "tpl-infer",
      prompt:
        'What does `S extends \\`${string}:${`infer` P}\\`` bind in P for "/users/:id"?',
      choices: [
        { id: "a", text: '"/users"' },
        { id: "b", text: '"id"' },
        { id: "c", text: '":id"' },
        { id: "d", text: "the whole string" },
      ],
      answerId: "b",
      explanation:
        'The pattern consumes up through the colon; `infer` P takes the trailing segment "id".',
    },
  ],
  exercise: {
    prompt:
      'Implement StartsWithHello<S> that is true if S starts with "hello", else false (as type booleans).',
    starter: `type StartsWithHello<S extends string> = false; // TODO

type A = StartsWithHello<"hello-world">;
const x: A = false; // should be true once fixed — adjust solution accordingly
`,
    assertion: "no-errors",
    hints: ["S extends `hello${string}` ? true : false"],
    solution: `type StartsWithHello<S extends string> = S extends \`hello\${string}\`
  ? true
  : false;

type A = StartsWithHello<"hello-world">;
const x: A = true;
void x;
`,
  },
};
