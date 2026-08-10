import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "typing-fs-and-path",
  title: "fs and path",
  tier: "intermediate",
  track: "node-migration",
  order: 14,
  summary:
    "The three fs APIs, the overloads that switch between Buffer and string, and typed path handling that survives Windows.",
  prerequisites: ["node-builtin-modules", "function-overloads"],
  keywords: ["fs", "fs/promises", "path", "Buffer", "encoding", "overload"],
  problem:
    'readFileSync without encoding — binary treated like text later. Migration does not change Node\'s runtime — it surfaces the unions and module edges you already had to handle. Fix the seam "fs and path" names before you rename the next hundred files.',
  solution:
    "Overloads distinguish string vs binary. Bytes are not a string. Pass utf8 when you want string; otherwise you get binary data. Normalize user paths before joining with trusted roots. fs/promises follows the same string-vs-buffer split. Do not silence the diagnostic without restoring the shape.",
  js: {
    code: `const data = fs.readFileSync(userPath);
handle(data.toString());
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "readFileSync without encoding — binary treated like text later.",
  },
  ts: {
    code: `type Fs = {
  readFileSync(path: string, encoding: "utf8"): string;
  readFileSync(path: string): Uint8Array;
};
type PathApi = { resolve(...parts: string[]): string; normalize(p: string): string };
declare const fs: Fs;
declare const path: PathApi;

export function readUtf8(rel: string): string {
  return fs.readFileSync(path.resolve(path.normalize(rel)), "utf8");
}

const bytes = fs.readFileSync("/tmp/x");
const asString: string = bytes;
`,
    highlights: [{ start: 14, end: 15 }],
    caption: "Overloads distinguish string vs binary. Bytes are not a string.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 14,
        messageIncludes: "Type 'Uint8Array<ArrayBufferLike>' is not assign",
      },
    ],
  },
  insight: [
    "Pass utf8 when you want string; otherwise you get binary data.",
    "Normalize user paths before joining with trusted roots.",
    "fs/promises follows the same string-vs-buffer split.",
  ],
  security: {
    title: "Path traversal is a classic fs bug",
    body: "Resolve user-supplied paths and ensure the result stays under an allowed root before reading or writing.",
    severity: "critical",
  },
  exercise: {
    prompt:
      'Pass "utf8" to readFileSync so asString is a string. Match the solution text.',
    starter: `type Fs = {
  readFileSync(path: string, encoding: "utf8"): string;
  readFileSync(path: string): Uint8Array;
};
declare const fs: Fs;

const asString: string = fs.readFileSync("/tmp/x");
`,
    assertion: "no-errors",
    hints: ['fs.readFileSync("/tmp/x", "utf8")'],
    solution: `type Fs = {
  readFileSync(path: string, encoding: "utf8"): string;
  readFileSync(path: string): Uint8Array;
};
declare const fs: Fs;

const asString: string = fs.readFileSync("/tmp/x", "utf8");
void asString;
`,
  },
};
