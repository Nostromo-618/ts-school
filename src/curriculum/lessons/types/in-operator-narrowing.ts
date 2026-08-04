import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "in-operator-narrowing",
  title: "Narrowing with in",
  tier: "intermediate",
  track: "types",
  order: 14,
  summary:
    "'id' in value narrows a union by property presence â useful when you do not own the shapes and cannot add a tag.",
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
  return pet.meow();
}

const weird = { bark: 1, meow: () => "x" };
const s: string = label(weird);
`,
    highlights: [{ start: 10, end: 11 }],
    caption:
      "`in` narrows Dog | Cat. A value with both keys may still not match either callable shape.",
    expectedDiagnostics: [],
  },
  insight: [
    "`in` narrows unions when members have distinct keys.",
    "It still follows the prototype chain — pair with untrusted-object lessons.",
    "Prefer discriminated unions when you control the data model.",
  ],
};
