import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "strictfunctiontypes",
  title: "strictFunctionTypes",
  tier: "intermediate",
  track: "tooling",
  order: 7,
  summary:
    "Contravariant parameter checking for function-typed properties, the method exemption it deliberately keeps, and what that means for your callbacks.",
  prerequisites: ["the-strictness-ladder", "void-returning-callbacks"],
  keywords: [
    "strictFunctionTypes",
    "variance",
    "contravariance",
    "callback",
    "method",
  ],
  problem:
    'Assuming a Dog handler can accept `any` Animal. Turning the flag on is painful exactly once; leaving it off means every new file reintroduces the same class of bug. Treat "strictFunctionTypes" as a CI gate, not a personal preference.',
  solution:
    "Under `strictFunctionTypes`, parameter positions are checked contravariantly. Function parameters are checked more strictly under this flag. A Dog=>`void` is not an Animal=>`void`. This prevents barking on plain Animals. Let inference work locally; annotate what crosses modules.",
  js: {
    code: `const handler = (dog) => dog.bark();
acceptAnimal(handler);
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "Assuming a Dog handler can accept `any` Animal.",
  },
  ts: {
    code: `type Animal = { eat(): void };
type Dog = Animal & { bark(): void };
type AnimalHandler = (a: Animal) => void;

const handler = (dog: Dog) => {
  dog.bark();
};
const ok: AnimalHandler = handler;
`,
    highlights: [{ start: 8, end: 8 }],
    caption:
      "Under `strictFunctionTypes`, parameter positions are checked contravariantly.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 8,
        messageIncludes: "Type '(dog: Dog) => void' is not assignable to t",
      },
    ],
  },
  insight: [
    "Function parameters are checked more strictly under this flag.",
    "A Dog=>`void` is not an Animal=>`void`.",
    "This prevents barking on plain Animals.",
  ],
};
