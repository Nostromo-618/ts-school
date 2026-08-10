import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "abstract-classes",
  title: "Abstract classes and members",
  tier: "intermediate",
  track: "structures",
  order: 14,
  summary:
    "A base that cannot be instantiated and members a subclass must supply — the one inheritance feature that carries real checking weight.",
  prerequisites: ["implements-vs-extends"],
  keywords: [
    "abstract",
    "base class",
    "template method",
    "subclass",
    "override",
  ],
  problem:
    "A base class with a method that throws 'not implemented' pushes a compile-time contract into a runtime failure.",
  js: {
    code: `class Animal { speak() {} }
new Animal();
`,
    highlights: [{ start: 1, end: 2 }],
    caption: "Base class constructed directly.",
  },
  ts: {
    code: `abstract class Animal {
  abstract speak(): string;
}
class Dog extends Animal {
  speak(): string {
    return "woof";
  }
}
const d: Animal = new Dog();
const bad = new Animal();
`,
    highlights: [{ start: 10, end: 10 }],
    caption: "abstract classes cannot be instantiated.",
    expectedDiagnostics: [
      {
        code: 2511,
        line: 10,
        messageIncludes: "Cannot create an instance of an abstract class.",
      },
    ],
  },
  insight: [
    "abstract forces subclasses to implement members.",
    "Prefer interfaces when you only need a shape.",
    "Use abstract classes when you share implementation.",
  ],
};
