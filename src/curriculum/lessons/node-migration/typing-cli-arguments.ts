import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "typing-cli-arguments",
  title: "Command-line arguments",
  tier: "intermediate",
  track: "node-migration",
  order: 13,
  summary:
    "process.argv, node:util parseArgs, and how a typed options object beats an argument parser that returns a record of `any`.",
  prerequisites: ["typing-process-env"],
  keywords: ["argv", "parseArgs", "cli", "commander", "options"],
  problem:
    'Trusting argv[2] without checking it exists. Migration does not change Node\'s runtime — it surfaces the unions and module edges you already had to handle. Fix the seam "Command-line arguments" names before you rename the next hundred files.',
  solution:
    "Parse into CliOptions. A raw argv string is not a number. Parse argv into a dedicated options type early. Prefer parseArgs helpers, then validate business rules. Fail with a usage message when operands are missing. Do not silence the diagnostic without restoring the shape.",
  js: {
    code: `const file = process.argv[2];
doWork(file);
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "Trusting argv[2] without checking it exists.",
  },
  ts: {
    code: `declare const process: { argv: string[] };
type CliOptions = { file: string; verbose: boolean };

export function parseArgs(argv: string[]): CliOptions {
  const file = argv[2];
  if (typeof file !== "string" || file.length === 0) {
    throw new Error("usage: tool <file> [--verbose]");
  }
  return { file, verbose: argv.includes("--verbose") };
}

declare function doWork(opts: CliOptions): void;
doWork(parseArgs(process.argv));

const raw = process.argv[2] as string;
const asNum: number = raw;
`,
    highlights: [{ start: 15, end: 16 }],
    caption: "Parse into CliOptions. A raw argv string is not a number.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 16,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "Parse argv into a dedicated options type early.",
    "Prefer parseArgs helpers, then validate business rules.",
    "Fail with a usage message when operands are missing.",
  ],
  security: {
    title: "CLI args are untrusted paths and flags",
    body: "Validate paths and never pass raw argv into a shell without escaping.",
    severity: "caution",
  },
};
