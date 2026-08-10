import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "exactoptionalpropertytypes",
  title: "exactOptionalPropertyTypes",
  tier: "intermediate",
  track: "tooling",
  order: 10,
  summary:
    "Distinguishes an absent property from one explicitly set to `undefined`. Correct, occasionally infuriating, and worth understanding before you enable it.",
  prerequisites: ["optional-and-readonly-properties", "the-strictness-ladder"],
  keywords: [
    "exactOptionalPropertyTypes",
    "optional",
    "undefined",
    "absent",
    "patch",
  ],
  problem:
    '`undefined` written into optional fields casually. Turning the flag on is painful exactly once; leaving it off means every new file reintroduces the same class of bug. Treat "exactOptionalPropertyTypes" as a CI gate, not a personal preference.',
  solution:
    "Options.timeout?: number is not number | `undefined` for fresh calls under `exactOptionalPropertyTypes` — modeled here as a mismatch. `exactOptionalPropertyTypes` distinguishes missing from `undefined`. Useful for APIs where `undefined` means something different. Enable carefully — it is not part of `strict`. Make the impossible state unrepresentable, then move on.",
  js: {
    code: `const opts = { timeout: undefined };
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "`undefined` written into optional fields casually.",
  },
  ts: {
    code: `// Model exact optional: optional prop cannot be explicitly undefined
type Options = { timeout?: number };
type ExactOptions = { timeout?: number } & { timeout?: number };

function start(opts: { timeout: number | undefined }): void {}
const loose: Options = {};
start(loose);
`,
    highlights: [{ start: 8, end: 8 }],
    caption:
      "Options.timeout?: number is not number | `undefined` for fresh calls under `exactOptionalPropertyTypes` — modeled here as a mismatch.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 7,
        messageIncludes: "Argument of type 'Options' is not assignable to",
      },
    ],
  },
  insight: [
    "`exactOptionalPropertyTypes` distinguishes missing from `undefined`.",
    "Useful for APIs where `undefined` means something different.",
    "Enable carefully — it is not part of `strict`.",
  ],
};
