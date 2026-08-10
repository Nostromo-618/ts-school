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
    "Box erases the wrapped type. Object and class APIs leak through optional fields, mutable shared state, or signatures that do not match how instances are actually used. Tighten the shape so consumers cannot rely on properties you `never` meant to promise. Consumers will depend on whatever the type allows, including accidents.",
  solution:
    "Box<number>.value is number, not string. Generic classes keep element types on the instance. Interfaces can be generic the same way. Infer T from the constructor argument when possible. Prefer the smallest honest type that still rejects the bad input.",
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
