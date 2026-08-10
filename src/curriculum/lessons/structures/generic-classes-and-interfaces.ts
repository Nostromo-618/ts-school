import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "generic-classes-and-interfaces",
  title: "Generic classes and interfaces",
  tier: "intermediate",
  track: "structures",
  order: 18,
  summary:
    "Type parameters on a container: repositories, caches, and queues that remember what they hold.",
  prerequisites: ["generics-intro", "classes-intro"],
  keywords: [
    "generic class",
    "container",
    "repository",
    "cache",
    "type parameter",
  ],
  problem:
    "A cache typed with `any` is a cache that returns `any`, and every read site loses its type. Look at the left pane: box erases the wrapped type. The language will happily evaluate it; only a later runtime path reveals the damage.",
  solution:
    "Box<number>.value is number, not string. Generic classes keep element types on the instance. Interfaces can be generic the same way. Infer T from the constructor argument when possible. Treat the TypeScript pane as the worked example of that refusal — diagnostics included — and the takeaways as what should stick after you leave the page.",
  js: {
    code: `class Box { constructor(value) { this.value = value; } }
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Box erases the wrapped type.",
  },
  ts: {
    code: `class Box<T> {
  constructor(public value: T) {}
}
const b = new Box(1);
const n: number = b.value;
const bad: string = b.value;
`,
    highlights: [{ start: 6, end: 6 }],
    caption: "Box<number>.value is number, not string.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 6,
        messageIncludes: "Type 'number' is not assignable to type 'string'",
      },
    ],
  },
  insight: [
    "Generic classes keep element types on the instance.",
    "Interfaces can be generic the same way.",
    "Infer T from the constructor argument when possible.",
  ],
};
