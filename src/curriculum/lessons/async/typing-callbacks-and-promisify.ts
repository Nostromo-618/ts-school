import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "typing-callbacks-and-promisify",
  title: "From callbacks to promises",
  tier: "beginner",
  track: "async",
  order: 3,
  summary:
    "Promisify Node-style callbacks without collapsing error and value into `any` — generics must track both channels.",
  prerequisites: ["async-await-typing", "function-type-expressions"],
  keywords: ["callback", "promisify", "errback", "Node"],
  problem:
    "A hand-rolled promisify types the callback as `(err, value) => void` with `any`, so the promise resolves to `any` and error handling is unchecked. Callers regain the worst of callbacks: no autocomplete, no rejection typing, and easy swaps of error and value. The failure mode is a wrapper that hides the callback style without recovering its information.",
  solution:
    "Parameterize error and value types so `promisify` returns `Promise<T>` and rejects with a known error shape. Prefer `util.promisify` with correct `@types` when available; when you write your own, keep the err-first convention in the type. The TypeScript pane should show a concrete resolved type, not `any`. Treat the callback boundary as a runtime contract you encode once.",
  js: {
    code: `function readConfig(cb) {
  cb(null, { port: 3000 });
}

readConfig((err, config) => {
  console.log(config.port);
});
`,
    highlights: [{ start: 5, end: 6 }],
    caption:
      "Callback APIs bury errors in arguments — easy to ignore, hard to type.",
  },
  ts: {
    code: `type Config = { port: number };
type NodeCb<T> = (err: Error | null, value?: T) => void;

function readConfig(cb: NodeCb<Config>): void {
  cb(null, { port: 3000 });
}

function readConfigAsync(): Promise<Config> {
  return new Promise((resolve, reject) => {
    readConfig((err, value) => {
      if (err || !value) reject(err ?? new Error("missing"));
      else resolve(value);
    });
  });
}

// Forgetting that value may be undefined:
readConfig((err, value) => {
  const port: number = value.port;
  void err;
  void port;
});
`,
    highlights: [{ start: 20, end: 20 }],
    caption: "A typed promisify recovers `Promise<T>` instead of `any`.",
    expectedDiagnostics: [{ code: 18048, line: 19, messageIncludes: "value" }],
  },
  insight: [
    "Model err-first callbacks as (err: Error | `null`, value?: T) => `void`.",
    "Promisify by rejecting on err and resolving only when value is present.",
    "Prefer native promise APIs (fs/promises) over hand-rolled wrappers when available.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "In a Node callback, what should you do first?",
      choices: [
        { id: "a", text: "Use value immediately" },
        { id: "b", text: "Check err (and value) before use" },
        { id: "c", text: "Ignore err if value looks fine" },
        { id: "d", text: "Cast value as `any`" },
      ],
      answerId: "b",
      explanation: "err and value are a discriminated pair by convention.",
    },
  ],
  exercise: {
    prompt: "Narrow value before reading .port.",
    starter: `type Config = { port: number };
type NodeCb<T> = (err: Error | null, value?: T) => void;

function readConfig(cb: NodeCb<Config>): void {
  cb(null, { port: 3000 });
}

readConfig((err, value) => {
  const port: number = value.port;
  void err;
  void port;
});
`,
    assertion: "no-errors",
    hints: ["if (err || !value) return; then use value.port"],
    solution: `type Config = { port: number };
type NodeCb<T> = (err: Error | null, value?: T) => void;

function readConfig(cb: NodeCb<Config>): void {
  cb(null, { port: 3000 });
}

readConfig((err, value) => {
  if (err || !value) return;
  const port: number = value.port;
  void port;
});
`,
  },
};
