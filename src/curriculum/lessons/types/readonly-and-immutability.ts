import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "readonly-and-immutability",
  title: "readonly, and how far it goes",
  tier: "intermediate",
  track: "types",
  order: 18,
  summary:
    "`readonly` properties, ReadonlyArray, and the honest limits: it is a compile-time promise about one level, not a frozen object.",
  prerequisites: ["const-assertions", "arrays-and-tuples"],
  keywords: [
    "readonly",
    "ReadonlyArray",
    "immutability",
    "shallow",
    "Object.freeze",
  ],
  problem:
    "Passing an array to a helper and getting it back sorted in place is a bug the type system will happily allow.",
  js: {
    code: `function add(list, item) {
  list.push(item);
  return list;
}
`,
    highlights: [{ start: 2, end: 3 }],
    caption: "Mutating the caller's array.",
  },
  ts: {
    code: `function add(list: readonly string[], item: string): string[] {
  return [...list, item];
}

const xs: readonly string[] = ["a"];
xs.push("b");
`,
    highlights: [{ start: 6, end: 6 }],
    caption: "push does not exist on `readonly` string[].",
    expectedDiagnostics: [
      {
        code: 2339,
        line: 6,
        messageIncludes: "Property 'push' does not exist on type 'readonly",
      },
    ],
  },
  insight: [
    "`readonly` arrays forbid mutating methods like push.",
    "Return a new array instead of mutating shared state.",
    "`Readonly`<T> / `readonly` props document intent at API boundaries.",
  ],
  quiz: [
    {
      id: "q1",
      prompt:
        "What does marking an array as `readonly` prevent at the type level?",
      choices: [
        { id: "a", text: "Reading length" },
        {
          id: "b",
          text: "Mutating methods like push/splice on that reference",
        },
        { id: "c", text: "`JSON.stringify`" },
        { id: "d", text: "Importing the array from another module" },
      ],
      answerId: "b",
      explanation:
        "`Readonly` arrays expose readers but not mutators, pushing you toward returning new arrays instead of shared mutation.",
    },
  ],
};
