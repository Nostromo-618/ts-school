import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "typing-child-process-and-buffers",
  title: "Child processes, Buffers, and binary data",
  tier: "intermediate",
  track: "node-migration",
  order: 18,
  summary:
    "spawn against exec, stdio typing, Buffer against Uint8Array, and encodings that the types describe more precisely than most code uses.",
  prerequisites: ["typing-streams"],
  keywords: [
    "child_process",
    "spawn",
    "Buffer",
    "Uint8Array",
    "stdio",
    "encoding",
  ],
  problem:
    'Shelling out with concatenated user input. Migration does not change Node\'s runtime — it surfaces the unions and module edges you already had to handle. Fix the seam "Child processes, Buffers, and binary data" names before you rename the next hundred files.',
  solution:
    "Prefer execFile with an args array. Without encoding, the result is not a string. Use execFile/spawn with an args array to avoid shell injection. encoding utf8 selects the string overload. Bound timeout and maxBuffer for untrusted workloads. Public APIs first; loosen only where you can name the tradeoff.",
  js: {
    code: `const { stdout } = execSync("ls " + userInput);
parse(stdout);
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "Shelling out with concatenated user input.",
  },
  ts: {
    code: `type ExecResult = { stdout: Uint8Array; stderr: Uint8Array };
declare function execFileSync(
  file: string,
  args: string[],
  opts: { encoding: "utf8" },
): string;
declare function execFileSync(file: string, args: string[]): ExecResult;

export function listDir(dir: string): string {
  return execFileSync("ls", ["-la", dir], { encoding: "utf8" });
}

const binary = execFileSync("ls", ["-la"]);
const asString: string = binary;
`,
    highlights: [{ start: 13, end: 14 }],
    caption:
      "Prefer execFile with an args array. Without encoding, the result is not a string.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 14,
        messageIncludes: "Type 'ExecResult' is not assignable to type 'str",
      },
    ],
  },
  insight: [
    "Use execFile/spawn with an args array to avoid shell injection.",
    "encoding utf8 selects the string overload.",
    "Bound timeout and maxBuffer for untrusted workloads.",
  ],
  security: {
    title: "Shell injection via child_process",
    body: "Never build a shell command string from user input. Use execFile/spawn with discrete arguments.",
    severity: "critical",
  },
};
