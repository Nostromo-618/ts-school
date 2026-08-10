import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "in-operator-narrowing",
  title: "Narrowing with in",
  tier: "intermediate",
  track: "types",
  order: 14,
  summary:
    "'id' in value narrows a union by property presence — useful when you do not own the shapes and cannot add a tag.",
  prerequisites: ["discriminated-unions"],
  keywords: ["in operator", "narrowing", "property presence", "duck typing"],
  problem:
    "Third-party union types rarely come with a discriminant, so branching on them needs a different proof.",
  js: {
    code: `function label(pet) {
  if ("bark" in pet) return pet.bark();
  return pet.meow();
}
`,
    highlights: [{ start: 2, end: 3 }],
    caption: "Runtime key check without types.",
  },
  ts: {
    code: `type Dog = { bark(): string };
type Cat = { meow(): string };

function label(pet: Dog | Cat): string {
  if ("bark" in pet) return pet.bark();
  // Else branch is Cat — bark is gone.
  return pet.bark();
}
`,
    highlights: [{ start: 7, end: 7 }],
    caption:
      "`in` narrows the true branch to Dog; the else is Cat, so bark() errors.",
    expectedDiagnostics: [
      {
        code: 2339,
        line: 7,
        messageIncludes: "bark",
      },
    ],
  },
  insight: [
    "`in` narrows unions when members have distinct keys.",
    "It still follows the prototype chain — pair with untrusted-object lessons.",
    "Prefer discriminated unions when you control the data model.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: 'When is `"bark" in animal` a good narrowing tool?',
      choices: [
        { id: "a", text: "Always, even on untrusted JSON" },
        {
          id: "b",
          text: "When union members have distinct keys the checker can use",
        },
        { id: "c", text: "Only inside async functions" },
        { id: "d", text: "It never narrows — it only returns boolean" },
      ],
      answerId: "b",
      explanation:
        "`in` helps when variants expose different properties. Prefer discriminants for data you model, and be careful with prototype-chain surprises on untrusted objects.",
    },
  ],
};
