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
    "A stale tsbuildinfo makes `tsc` report success on code it did not check, which is worse than being slow. Look at the left pane: no composite/incremental cache. The language will happily evaluate it; only a later runtime path reveals the damage.",
  solution:
    "incremental mode reports cacheHits as number. incremental and tsBuildInfoFile speed rebuilds. composite + project references scale monorepos. CI can still warm caches carefully. Once the types name the contract, the same edit that would have shipped quietly becomes a red squiggle at the call site instead.",
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
