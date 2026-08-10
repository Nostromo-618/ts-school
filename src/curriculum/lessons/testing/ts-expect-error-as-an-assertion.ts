import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "ts-expect-error-as-an-assertion",
  title: "Asserting that code does not compile",
  tier: "advanced",
  track: "testing",
  order: 11,
  summary:
    "@ts-expect-error fails when the error disappears, which makes it the only built-in way to test that an invalid call is still rejected.",
  prerequisites: ["suppressions", "type-level-tests"],
  keywords: [
    "ts-expect-error",
    "negative test",
    "compile error",
    "assertion",
    "api",
  ],
  problem:
    "Nothing stops a type from getting looser, so the invalid usage your API deliberately rejects starts compiling and no test notices. Look at the left pane: negative type tests have no JS equivalent. Without a typechecker there is nothing to refuse that misuse while you type — only later, on a live path.",
  solution:
    "@ts-expect-error documents intentional failures; returns stay number. @ts-expect-error is better than @ts-ignore for tests — unused expect-errors fail. Put negative tests next to the API so loosenings break CI. Do not use expect-error to silence real bugs in production code paths. Hold the dual panes side by side: the left side is the silent failure; the right side is where the checker finally refuses it.",
  js: {
    code: `// JS cannot assert “this call is illegal” — everything is legal.
function takeNumber(n) {
  return n + 1;
}
takeNumber("nope");
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "Negative type tests have no JS equivalent.",
  },
  ts: {
    code: `function takeNumber(n: number): number {
  return n + 1;
}

// Negative test: this line must stay an error.
// @ts-expect-error string is not a number
takeNumber("nope");

// If the API loosens to accept string, @ts-expect-error becomes unused (TS2578).
const ok = takeNumber(1);
const bad: string = ok;
`,
    highlights: [{ start: 12, end: 12 }],
    caption:
      "@ts-expect-error documents intentional failures; returns stay number.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 11,
        messageIncludes: "number",
      },
    ],
  },
  insight: [
    "@ts-expect-error is better than @ts-ignore for tests — unused expect-errors fail.",
    "Put negative tests next to the API so loosenings break CI.",
    "Do not use expect-error to silence real bugs in production code paths.",
  ],
  security: {
    title: "Do not expect-error production trust checks",
    body: "Using @ts-expect-error (or @ts-ignore) on request handlers, crypto, or permission checks turns a compile-time alarm into silent acceptance. Reserve negative directives for tests that assert an API stays narrow.",
    severity: "caution",
  },
  quiz: [
    {
      id: "expect-err",
      prompt: "What happens if @ts-expect-error sits on a line with no error?",
      choices: [
        { id: "a", text: "Nothing" },
        { id: "b", text: "TypeScript reports that the directive is unused" },
        { id: "c", text: "The file is skipped" },
        { id: "d", text: "Runtime throws" },
      ],
      answerId: "b",
      explanation:
        "Unused @ts-expect-error is itself an error — that is the assertion.",
    },
  ],
  exercise: {
    prompt:
      "Write onlyNumber(n: number) and a @ts-expect-error call with a string, plus a valid call.",
    starter: `function onlyNumber(n: number) {
  return n;
}
`,
    assertion: "no-errors",
    hints: ['Add // @ts-expect-error before onlyNumber("x"); and a good call.'],
    solution: `function onlyNumber(n: number): number {
  return n;
}

// @ts-expect-error string should be rejected
onlyNumber("x");

void onlyNumber(1);
`,
  },
};
