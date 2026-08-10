import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "interface-vs-type-alias",
  title: "Interface against type alias",
  tier: "beginner",
  track: "structures",
  order: 3,
  summary:
    "When to reach for interface versus type — merging, unions, and a practical rule of thumb for application code.",
  prerequisites: ["interfaces-intro", "type-aliases-intro"],
  keywords: ["interface vs type", "declaration merging", "style"],
  problem:
    "A codebase mixes interface and type for the same kind of shape, so newcomers cannot tell which rules apply. Without a convention, shapes drift between modules. Use type for unions, tuples, and mapped/conditional results.",
  solution:
    "Behavior for object shapes is nearly identical; unions need type. Use type for unions, tuples, and mapped/conditional results. Use interface when you want extends and are modeling an object contract. Avoid declaration merging in app code — it surprises readers; keep ambient merges in .d.ts.",
  js: {
    code: `// Two docs, two styles, one runtime shape — no single source of truth.
function area(box) {
  return box.w * box.h;
}
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Without a convention, shapes drift between modules.",
  },
  ts: {
    code: `interface BoxI {
  w: number;
  h: number;
}

type BoxT = {
  w: number;
  h: number;
};

// Both describe the same shape — pick one style per codebase.
function area(box: BoxI): number {
  return box.w * box.h;
}

area({ w: 2, h: "3" });
`,
    highlights: [{ start: 16, end: 16 }],
    caption:
      "Behavior for object shapes is nearly identical; unions need type.",
    expectedDiagnostics: [{ code: 2322, line: 16, messageIncludes: "string" }],
  },
  insight: [
    "Use type for unions, tuples, and mapped/conditional results.",
    "Use interface when you want extends and are modeling an object contract.",
    "Avoid declaration merging in app code — it surprises readers; keep ambient merges in .d.ts.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "You need string | number. Which do you use?",
      choices: [
        { id: "a", text: "interface" },
        { id: "b", text: "type" },
        { id: "c", text: "enum" },
        { id: "d", text: "namespace" },
      ],
      answerId: "b",
      explanation: "Only type aliases can name arbitrary unions.",
    },
  ],
  exercise: {
    prompt: "Fix the area call to use numbers.",
    starter: `interface BoxI {
  w: number;
  h: number;
}

function area(box: BoxI): number {
  return box.w * box.h;
}

area({ w: 2, h: "3" });
`,
    assertion: "no-errors",
    hints: ["h: 3"],
    solution: `interface BoxI {
  w: number;
  h: number;
}

function area(box: BoxI): number {
  return box.w * box.h;
}

area({ w: 2, h: 3 });
`,
  },
};
