import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "deliberate-unsoundness",
  title: "Where TypeScript is unsound on purpose",
  tier: "advanced",
  track: "foundations",
  order: 17,
  summary:
    "Method parameter bivariance, array covariance, assertions, and any. Each hole is a deliberate trade for usability — knowing which is which is the point.",
  prerequisites: ["structural-typing", "type-space-vs-value-space"],
  keywords: ["soundness", "bivariance", "covariance", "assertion", "trade-off"],
  problem:
    "A type-checked program can still throw a TypeError, and believing otherwise is how the checked parts stop being reviewed.",
  js: {
    code: `// JS is unsound by default — types do not exist.
const dogs = [{ bark() {} }];
const animals = dogs;
animals.push({ meow() {} }); // corrupts the "dog" array
dogs[1].bark();
`,
    highlights: [{ start: 2, end: 5 }],
    caption: "Array aliasing is the classic covariance hole — JS has it raw.",
  },
  ts: {
    code: `type Animal = { tag: "animal" };
type Dog = Animal & { bark(): void };

// Arrays are covariant in TypeScript (soundness hole for usability).
const dogs: Dog[] = [{ tag: "animal", bark() {} }];
const animals: Animal[] = dogs;
animals.push({ tag: "animal" });
dogs[1].bark();

// Assertions are another deliberate escape hatch:
const x = "hi" as unknown as number;
const y: string = x;
`,
    highlights: [{ start: 12, end: 12 }],
    caption: "Double assertions bypass the checker — know when you opted out.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 12,
        messageIncludes: "number",
      },
    ],
  },
  insight: [
    "Soundness holes are documented trade-offs, not bugs — treat them as places needing human review.",
    "Prefer readonly T[] / ReadonlyArray when covariance would hurt.",
    "any and assertions are explicit unsoundness; keep them at boundaries with comments.",
  ],
  security: {
    title: "Unchecked casts at trust boundaries",
    body: "as unknown as T is a complete bypass. At security boundaries, prefer parsers that return branded types over assertions that invent safety.",
    severity: "caution",
  },
  quiz: [
    {
      id: "unsound-q",
      prompt: "Why are method parameters bivariant by default?",
      choices: [
        { id: "a", text: "It is required by ECMAScript" },
        {
          id: "b",
          text: "DOM/framework patterns broke under full contravariance",
        },
        { id: "c", text: "Methods cannot have parameters" },
        { id: "d", text: "Bivariance only applies to private fields" },
      ],
      answerId: "b",
      explanation:
        "Full contravariance on methods was too breaking for existing patterns; function types got the strict rule instead.",
    },
  ],
  exercise: {
    prompt:
      "Type a readonly animal list as ReadonlyArray<Animal> and show a Dog array assignable to it without push.",
    starter: `type Animal = { tag: "animal" };
type Dog = Animal & { bark(): void };
const dogs: Dog[] = [{ tag: "animal", bark() {} }];
`,
    assertion: "no-errors",
    hints: ["const animals: ReadonlyArray<Animal> = dogs;"],
    solution: `type Animal = { tag: "animal" };
type Dog = Animal & { bark(): void };
const dogs: Dog[] = [{ tag: "animal", bark() {} }];
const animals: ReadonlyArray<Animal> = dogs;
void animals[0];
`,
  },
};
