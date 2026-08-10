import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "variadic-tuple-types",
  title: "Variadic tuple types",
  tier: "advanced",
  track: "type-level",
  order: 17,
  summary:
    "[...T, U] and spreads in tuple positions — how typed compose, curry, and `Promise.all` keep every element's type in order.",
  prerequisites: ["rest-parameters", "infer-keyword"],
  keywords: ["variadic tuple", "spread", "tuple", "compose", "Promise.all"],
  problem:
    "A function that appends an argument to another function's parameter list cannot be typed without tuple manipulation.",
  js: {
    code: `// JS: wrap a function and lose parameter types.
function withLogger(fn) {
  return (...args) => {
    console.log("call", args);
    return fn(...args);
  };
}

const add = (a, b) => a + b;
const logged = withLogger(add); // (...args: any[]) => any vibe
`,
    highlights: [{ start: 2, end: 7 }],
    caption: "Wrappers without tuple types erase the wrapped signature.",
  },
  ts: {
    code: `type AppendArg<F extends (...args: never[]) => unknown, A> =
  F extends (...args: infer P) => infer R
    ? (...args: [...P, A]) => R
    : never;

function greet(name: string) {
  return \`hi \${name}\`;
}

type GreetWithExclaim = AppendArg<typeof greet, boolean>;
const g: GreetWithExclaim = (name, loud) =>
  loud ? \`\${greet(name)}!\` : greet(name);

// Wrong second arg type — boolean was appended to the tuple
const bad: GreetWithExclaim = (name: string, loud: string) =>
  greet(name) + loud;
`,
    highlights: [
      { start: 1, end: 4 },
      { start: 15, end: 16 },
    ],
    caption: "Variadic [...P, A] extends the parameter tuple.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 15,
        messageIncludes: "not assignable",
      },
    ],
  },
  insight: [
    "Variadic tuple types let you spread one tuple type into another: [...A, ...B].",
    "They power typed `Promise.all`, middleware, and curry without any[].",
    "`infer` P on a rest parameter yields a tuple type you can manipulate.",
  ],
  quiz: [
    {
      id: "var-spread",
      prompt: "What is the type of `[...[string, number], boolean]`?",
      choices: [
        { id: "a", text: "(string | number | boolean)[]" },
        { id: "b", text: "[string, number, boolean]" },
        { id: "c", text: "[string[], number[], boolean]" },
        { id: "d", text: "`never`" },
      ],
      answerId: "b",
      explanation:
        "Spreading tuple types concatenates fixed positions in order.",
    },
  ],
  exercise: {
    prompt:
      "Implement Cons<H, T extends `unknown`[]> = [H, ...T]. Show a value of Cons<string, [number]>.",
    starter: `type Cons<H, T extends unknown[]> = unknown; // TODO

const c: Cons<string, [number]> = ["a", 1];
`,
    assertion: "no-errors",
    hints: ["type Cons<H, T extends `unknown`[]> = [H, ...T]"],
    solution: `type Cons<H, T extends unknown[]> = [H, ...T];

const c: Cons<string, [number]> = ["a", 1];
void c;
`,
  },
};
