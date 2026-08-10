import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "parameter-properties",
  title: "Parameter properties",
  tier: "intermediate",
  track: "structures",
  order: 15,
  summary:
    "constructor(private readonly db: Db) declares and assigns in one place — and emits real JavaScript, so it cannot be type-stripped.",
  prerequisites: [
    "class-member-visibility",
    "erasable-syntax-and-type-stripping",
  ],
  keywords: [
    "parameter property",
    "constructor",
    "shorthand",
    "erasable",
    "di",
  ],
  problem:
    "The most convenient class syntax in TypeScript is one of the few that Node's native type stripping refuses to run.",
  js: {
    code: `class User {
  constructor(name) { this.name = name; }
}
`,
    highlights: [{ start: 1, end: 3 }],
    caption: "Manual field assignment in constructors.",
  },
  ts: {
    code: `class User {
  constructor(readonly name: string) {}
}
const u = new User("Ada");
const n: string = u.name;
const bad: number = u.name;
`,
    highlights: [{ start: 6, end: 6 }],
    caption: "Parameter properties declare and assign. name is string.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 6,
        messageIncludes: "Type 'string' is not assignable to type 'number'",
      },
    ],
  },
  insight: [
    "readonly/public/private on ctor params create fields.",
    "Keep them for simple data holders; prefer explicit fields when logic grows.",
    "erasableSyntaxOnly may restrict some parameter property forms.",
  ],
};
