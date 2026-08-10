import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "implements-vs-extends",
  title: "implements against extends",
  tier: "intermediate",
  track: "structures",
  order: 13,
  summary:
    "implements checks a class against a shape without inheriting anything; extends inherits. Structural typing means you often need neither.",
  prerequisites: ["classes-intro", "interfaces-intro"],
  keywords: ["implements", "extends", "inheritance", "structural", "contract"],
  problem:
    "Developers arriving from nominal languages reach for implements to make a class assignable, which it never needed. extends used for everything. Extends inherits implementation; implements only checks shape.",
  solution:
    "implements checks the shape; bark returns string. extends inherits implementation; implements only checks shape. A class can implement multiple interfaces. Failing implements is a compile error on the class body.",
  js: {
    code: `class Dog extends Animal {}
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "extends used for everything.",
  },
  ts: {
    code: `interface CanBark { bark(): string; }
class Animal {
  move(): string {
    return "walk";
  }
}
class Dog extends Animal implements CanBark {
  bark(): string {
    return "woof";
  }
}
const d = new Dog();
const s: string = d.bark();
const bad: number = d.bark();
`,
    highlights: [{ start: 14, end: 14 }],
    caption: "implements checks the shape; bark returns string.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 14,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "extends inherits implementation; implements only checks shape.",
    "A class can implement multiple interfaces.",
    "Failing implements is a compile error on the class body.",
  ],
};
