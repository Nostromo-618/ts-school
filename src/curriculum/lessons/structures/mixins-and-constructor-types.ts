import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "mixins-and-constructor-types",
  title: "Mixins",
  tier: "advanced",
  track: "structures",
  order: 22,
  summary:
    "Functions that take a class and return a subclass, typed with constructor signatures — composition where single inheritance runs out.",
  prerequisites: [
    "static-members-and-static-blocks",
    "generic-classes-and-interfaces",
  ],
  keywords: [
    "mixin",
    "constructor type",
    "abstract construct signature",
    "composition",
  ],
  problem:
    "Two orthogonal behaviours both want to be a base class, and JavaScript gives you one prototype chain. JS mixins work; typing the constructor parameter is the hard part.",
  solution:
    "Mixin constructors use `any`[] rest; instance fields compose. Aim for a shape where the bad state is unrepresentable — or at least loudly illegal before it runs.",
  js: {
    code: `// JS: mixins are functions that extend a class.
function Timestamped(Base) {
  return class extends Base {
    createdAt = Date.now();
  };
}
class Entity {}
const TEntity = Timestamped(Entity);
`,
    highlights: [{ start: 2, end: 8 }],
    caption:
      "JS mixins work; typing the constructor parameter is the hard part.",
  },
  ts: {
    code: `type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    createdAt = Date.now();
  };
}

class Entity {
  id = 1;
}

const TimedEntity = Timestamped(Entity);
const e = new TimedEntity();
const created: number = e.createdAt;
const wrong: string = e.createdAt;
void created;
`,
    highlights: [{ start: 16, end: 16 }],
    caption: "Mixin constructors use `any`[] rest; instance fields compose.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 16,
        messageIncludes: "number",
      },
    ],
  },
  insight: [
    "Mixin constructors need `new (...args: any[]) => T` — `never`[] trips `TS2545`.",
    "The returned class expression intersects the base instance type with new fields.",
    "Prefer composition (has-a) when mixin lattices get hard to follow.",
  ],
  quiz: [
    {
      id: "mixin-ctor",
      prompt: "What does `TBase extends Constructor` constrain?",
      choices: [
        { id: "a", text: "TBase must be a string" },
        { id: "b", text: "TBase must be constructable with new" },
        { id: "c", text: "TBase must be abstract" },
        { id: "d", text: "TBase must be a primitive" },
      ],
      answerId: "b",
      explanation:
        "Constructor means a value that can be invoked with new to produce an instance.",
    },
  ],
  exercise: {
    prompt:
      'Write Tagged<TBase extends Constructor>(Base: TBase) adding tag = "x", and construct one from class A {}.',
    starter: `type Constructor<T = {}> = new (...args: any[]) => T;

function Tagged(Base: Constructor) {
  return class extends Base {
    tag = "x";
  };
}
`,
    assertion: "no-errors",
    hints: ["Add the generic TBase extends Constructor and class A."],
    solution: `type Constructor<T = {}> = new (...args: any[]) => T;

function Tagged<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    tag = "x";
  };
}

class A {}
const B = Tagged(A);
const b = new B();
void b.tag;
`,
  },
};
