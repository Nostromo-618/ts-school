import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "typing-callbacks-and-promisify",
  title: "From callbacks to promises",
  tier: "beginner",
  track: "async",
  order: 3,
  summary:
    "Node-style (err, value) callbacks become `Promise<T>` with explicit error rejection — type both sides of the bridge.",
  prerequisites: ["async-await-typing", "function-type-expressions"],
  keywords: ["callback", "promisify", "errback", "Node"],
  problem:
    "A callback forgets to check err and reads value; TypeScript can make that mistake harder when you model the pair. Ignoring err is a classic Node footgun. Model err-first callbacks as (err: Error | `null`, value?: T) => `void`.",
  solution:
    "Optional value on the success path must be narrowed. Model err-first callbacks as (err: Error | `null`, value?: T) => `void`. Promisify by rejecting on err and resolving only when value is present. Prefer native promise APIs (fs/promises) over hand-rolled wrappers when available.",
  js: {
    code: `function readConfig(cb) {
  cb(null, { port: 3000 });
}

readConfig((err, config) => {
  console.log(config.port);
});
`,
    highlights: [{ start: 5, end: 6 }],
    caption: "Ignoring err is a classic Node footgun.",
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
    caption: "Optional value on the success path must be narrowed.",
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
