import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "abortsignal-and-cancellation",
  title: "AbortSignal and cancellation",
  tier: "intermediate",
  track: "async",
  order: 12,
  summary:
    "Thread an `AbortSignal` through async work so cancellation is a parameter — not a hope — and type the abort reason carefully.",
  prerequisites: ["async-await-typing", "typing-parameters-and-returns"],
  keywords: [
    "AbortSignal",
    "AbortController",
    "cancellation",
    "timeout",
    "signal",
  ],
  problem:
    "A user navigates away (or a timeout fires) and the in-flight `fetch` keeps running, updating state for a view that no longer exists. The API accepted no signal, so there was no type-level pressure to plumb cancellation. Wasted work is the mild outcome; writing to unmounted UI or racing the next request is the sharp one.",
  solution:
    "Accept an `AbortSignal` (from `AbortController`) and pass it into APIs that support it — `fetch`, timers you build, your own helpers. Treat abort as a distinct failure (`AbortError`) from domain errors so retries and logging stay sane. Cancel on timeout and on navigation away. The TypeScript pane shows `load` returning `string` once the signal is part of the signature — cancellation is input, not a second return channel.",
  js: {
    code: `await fetch(url);
`,
    highlights: [{ start: 1, end: 1 }],
    caption:
      "No cancellation plumbing — the request outlives the caller's interest.",
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
    caption:
      "Thread `AbortSignal` through; `load` still returns `string`, not a number.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 20,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "Pass `AbortSignal` into APIs that support it.",
    "AbortError should be handled distinctly from other failures.",
    "Cancel on timeout and on navigation away.",
  ],
};
