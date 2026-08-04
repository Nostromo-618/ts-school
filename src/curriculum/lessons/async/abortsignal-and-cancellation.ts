import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "abortsignal-and-cancellation",
  title: "AbortSignal and cancellation",
  tier: "intermediate",
  track: "async",
  order: 12,
  summary:
    "Threading a signal through an async call chain, typing the abort reason, and why cancellation is a parameter rather than a return value.",
  prerequisites: ["async-await-typing", "typing-parameters-and-returns"],
  keywords: [
    "AbortSignal",
    "AbortController",
    "cancellation",
    "timeout",
    "signal",
  ],
  problem:
    "A request that the caller no longer wants keeps running, and there is no type-level pressure to accept a signal.",
  js: {
    code: `await fetch(url);
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "No cancellation plumbing.",
  },
  ts: {
    code: `// Ambient stand-ins — DOM AbortSignal is not in the es2022 lib set.
interface AbortSignal {
  readonly aborted: boolean;
}
declare class AbortController {
  readonly signal: AbortSignal;
  abort(reason?: unknown): void;
}

type FetchInit = { signal?: AbortSignal };
declare function fetchText(url: string, init?: FetchInit): Promise<string>;

export async function load(
  url: string,
  signal: AbortSignal,
): Promise<string> {
  return fetchText(url, { signal });
}

const bad: number = await load("/", new AbortController().signal);
`,
    highlights: [{ start: 22, end: 22 }],
    caption: "Thread AbortSignal through. load returns string, not number.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 20,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "Pass AbortSignal into APIs that support it.",
    "AbortError should be handled distinctly from other failures.",
    "Cancel on timeout and on navigation away.",
  ],
};
