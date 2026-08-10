import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "noimplicitoverride-and-classfields",
  title: "noImplicitOverride and useDefineForClassFields",
  tier: "intermediate",
  track: "tooling",
  order: 11,
  summary:
    "Two class-shaped flags: one makes overriding explicit, the other changes what a field declaration actually emits.",
  prerequisites: ["abstract-classes", "the-strictness-ladder"],
  keywords: [
    "noImplicitOverride",
    "useDefineForClassFields",
    "override",
    "class fields",
    "emit",
  ],
  problem:
    'Overrides with no marker. Turning the flag on is painful exactly once; leaving it off means every new file reintroduces the same class of bug. Treat "noImplicitOverride and useDefineForClassFields" as a CI gate, not a personal preference.',
  solution:
    "override documents intent. speak returns string. noImplicitOverride requires the override keyword. It catches renames on the base class. Use with useDefineForClassFields awareness. Public APIs first; loosen only where you can name the tradeoff.",
  js: {
    code: `class Dog extends Animal { speak() { return 'woof'; } }
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Overrides with no marker.",
  },
  ts: {
    code: `class Animal {
  speak(): string {
    return "...";
  }
}
class Dog extends Animal {
  speak(): string {
    return "woof";
  }
}
// Illustrated requirement: mark overrides explicitly in real configs
class Cat extends Animal {
  override speak(): string {
    return "meow";
  }
}
const s: string = new Dog().speak();
const bad: number = new Dog().speak();
`,
    highlights: [{ start: 18, end: 18 }],
    caption: "override documents intent. speak returns string.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 18,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "noImplicitOverride requires the override keyword.",
    "It catches renames on the base class.",
    "Use with useDefineForClassFields awareness.",
  ],
};
