import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "global-augmentation-for-node",
  title: "Augmenting globals",
  tier: "intermediate",
  track: "node-migration",
  order: 19,
  summary:
    "`declare` global for globalThis, adding a user to Express's Request, and doing it in a .d.ts that does not accidentally become a module.",
  prerequisites: ["declaration-merging", "typing-http-servers"],
  keywords: [
    "declare global",
    "globalThis",
    "Express.Request",
    "d.ts",
    "augmentation",
  ],
  problem:
    "A declaration file with a single import stops being ambient, and every global augmentation in it silently stops applying. Look at the left pane: stashing state on global without declaring it. The language will happily evaluate it; only a later runtime path reveals the damage.",
  solution:
    "`declare` global adds appCache. A Map is not a number. Augment globals from a module file (export {} if needed). Prefer explicit imports over ambient globals for app state. Keep augmentations minimal — they apply everywhere. Hold the dual panes side by side: the left side is the silent failure; the right side is where the checker finally refuses it.",
  js: {
    code: `global.cache = new Map();
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Stashing state on global without declaring it.",
  },
  ts: {
    code: `export {};

declare global {
  // eslint-disable-next-line no-var
  var appCache: Map<string, string> | undefined;
}

appCache = new Map();
const hit: string | undefined = appCache.get("k");
const wrong: number = appCache;
`,
    highlights: [{ start: 10, end: 10 }],
    caption: "`declare` global adds appCache. A Map is not a number.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 10,
        messageIncludes: "Type 'Map<string, string>' is not assignable to",
      },
    ],
  },
  insight: [
    "Augment globals from a module file (export {} if needed).",
    "Prefer explicit imports over ambient globals for app state.",
    "Keep augmentations minimal — they apply everywhere.",
  ],
};
