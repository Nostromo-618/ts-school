import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "arrays-and-tuples",
  title: "Arrays and tuples",
  tier: "beginner",
  track: "types",
  order: 2,
  summary:
    "T[] for a homogeneous list, [string, number] for a fixed shape, and why the difference matters the moment you destructure.",
  prerequisites: ["primitive-types"],
  keywords: ["array", "tuple", "readonly", "destructuring"],
  problem:
    "An array of anything is an array of nothing in particular, so a list of pairs and a list of strings type-check identically. Destructuring assumes numbers; strings still 'work' until toFixed.",
  solution:
    "A tuple fixes length and element types; string[] will not do. Check the TypeScript example for the concrete refusal, then keep the takeaways as reusable rules. Keep the TypeScript types in view — they are the fix for the failure mode above.",
  js: {
    code: `function pointLabel(pair) {
  const [x, y] = pair;
  return x.toFixed(1) + "," + y.toFixed(1);
}

pointLabel(["10", "20"]);
`,
    highlights: [{ start: 5, end: 5 }],
    caption:
      "Destructuring assumes numbers; strings still 'work' until toFixed.",
  },
  ts: {
    code: `function pointLabel(pair: [number, number]): string {
  const [x, y] = pair;
  return x.toFixed(1) + "," + y.toFixed(1);
}

pointLabel(["10", "20"]);
`,
    highlights: [{ start: 6, end: 6 }],
    caption: "A tuple fixes length and element types; string[] will not do.",
    expectedDiagnostics: [
      { code: 2322, line: 6, messageIncludes: "string" },
      { code: 2322, line: 6, messageIncludes: "string" },
    ],
  },
  insight: [
    "number[] is a list of numbers of `unknown` length; [number, number] is a pair.",
    "After destructuring a tuple, each binding keeps its element type.",
    "Prefer `readonly` [number, number] when the pair should not be mutated or pushed to.",
  ],
  quiz: [
    {
      id: "q1",
      prompt:
        "What does [string, number] guarantee that (string | number)[] does not?",
      choices: [
        { id: "a", text: "Exactly two elements with those types in order" },
        { id: "b", text: "Runtime immutability" },
        { id: "c", text: "That `JSON.parse` will succeed" },
        { id: "d", text: "No holes in the array" },
      ],
      answerId: "a",
      explanation:
        "Tuples encode position: index 0 is string, index 1 is number.",
    },
  ],
  exercise: {
    prompt: "Pass a numeric pair so pointLabel type-checks.",
    starter: `function pointLabel(pair: [number, number]): string {
  const [x, y] = pair;
  return x.toFixed(1) + "," + y.toFixed(1);
}

pointLabel(["10", "20"]);
`,
    assertion: "no-errors",
    hints: ["[10, 20]"],
    solution: `function pointLabel(pair: [number, number]): string {
  const [x, y] = pair;
  return x.toFixed(1) + "," + y.toFixed(1);
}

pointLabel([10, 20]);
`,
  },
};
