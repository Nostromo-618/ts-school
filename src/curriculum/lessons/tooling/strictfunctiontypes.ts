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
    "The flag is on, the check still does not apply to methods, and nothing explains why one of your two handlers is checked. Look at the left pane: assuming a Dog handler can accept `any` Animal. Edit-time tools are silent, so the mistake travels with the deploy until a concrete input detonates it.",
  solution:
    "Under `strictFunctionTypes`, parameter positions are checked contravariantly. Function parameters are checked more strictly under this flag. A Dog=>`void` is not an Animal=>`void`. This prevents barking on plain Animals. Treat the TypeScript pane as the worked example of that refusal — diagnostics included — and the takeaways as what should stick after you leave the page.",
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
