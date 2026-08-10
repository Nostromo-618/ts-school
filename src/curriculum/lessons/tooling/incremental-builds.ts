import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "incremental-builds",
  title: "Incremental builds",
  tier: "intermediate",
  track: "tooling",
  order: 16,
  summary:
    "incremental, tsbuildinfo, composite, and why the second build is fast — plus the cache invalidations that make it slow again.",
  prerequisites: ["tsc-cli", "module-resolution-explained"],
  keywords: ["incremental", "tsbuildinfo", "composite", "cache", "build"],
  problem:
    'No composite/incremental cache. Turning the flag on is painful exactly once; leaving it off means every new file reintroduces the same class of bug. Treat "Incremental builds" as a CI gate, not a personal preference.',
  solution:
    "incremental mode reports cacheHits as number. incremental and tsBuildInfoFile speed rebuilds. composite + project references scale monorepos. CI can still warm caches carefully. Public APIs first; loosen only where you can name the tradeoff.",
  js: {
    code: `// tsc runs cold every CI job
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "No composite/incremental cache.",
  },
  ts: {
    code: `type BuildMode = "full" | "incremental";
declare function compile(mode: BuildMode): { cacheHits: number };
const r = compile("incremental");
const hits: number = r.cacheHits;
const bad: string = r.cacheHits;
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "incremental mode reports cacheHits as number.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 5,
        messageIncludes: "Type 'number' is not assignable to type 'string'",
      },
    ],
  },
  insight: [
    "incremental and tsBuildInfoFile speed rebuilds.",
    "composite + project references scale monorepos.",
    "CI can still warm caches carefully.",
  ],
};
