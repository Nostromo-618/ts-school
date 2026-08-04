import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "variance-and-strict-function-types",
  title: "Variance and strictFunctionTypes",
  tier: "advanced",
  track: "functions",
  order: 16,
  summary:
    "Parameters are contravariant, returns are covariant — except for methods, which stayed bivariant on purpose. What that trade actually costs you.",
  prerequisites: ["void-returning-callbacks", "assignability-rules"],
  keywords: [
    "variance",
    "covariant",
    "contravariant",
    "bivariance",
    "strictFunctionTypes",
  ],
  problem:
    "A handler that accepts a narrower event than it was registered for is accepted by the checker and crashes at runtime.",
  js: {
    code: `// JS: any callback is fine — until the event shape differs.
function on(handler) {
  handler({ type: "click", x: 1, y: 2 });
}

on((e) => {
  // Assumes a narrower shape than the emitter provides.
  console.log(e.key.toUpperCase());
});
`,
    highlights: [{ start: 6, end: 9 }],
    caption: "JS will call whatever you register; wrong assumptions crash later.",
  },
  ts: {
    code: `type Animal = { tag: "animal" };
type Dog = Animal & { bark(): void };

// Under strictFunctionTypes, parameter positions are checked contravariantly
// for function types (not methods).
type Handler<E> = (event: E) => void;

let animalHandler: Handler<Animal> = (a) => {
  void a.tag;
};

const dogHandler: Handler<Dog> = (d) => {
  d.bark();
};

// Unsafe: dogHandler expects bark(); animalHandler may pass a plain Animal.
animalHandler = dogHandler;

animalHandler({ tag: "animal" });
`,
    highlights: [{ start: 14, end: 16 }],
    caption: "Assigning a narrower-parameter handler is rejected under strictFunctionTypes.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 17,
        messageIncludes: "not assignable",
      },
    ],
  },
  insight: [
    "Return types are covariant: a function returning Dog may stand in for one returning Animal.",
    "Parameter types are contravariant for function types when strictFunctionTypes is on.",
    "Methods stay bivariant for DOM/framework ergonomics — prefer function-typed properties for safety.",
  ],
  quiz: [
    {
      id: "variance-q1",
      prompt: "With strictFunctionTypes, may Handler<Dog> be assigned to Handler<Animal>?",
      choices: [
        { id: "a", text: "Yes — Dog is an Animal" },
        { id: "b", text: "No — the handler might call Dog-only members" },
        { id: "c", text: "Only for async handlers" },
        { id: "d", text: "Only inside classes" },
      ],
      answerId: "b",
      explanation:
        "A Handler<Dog> may use bark(); an Animal argument would not have it — contravariance blocks the assignment.",
    },
  ],
  exercise: {
    prompt:
      "Type a function property onClick: (ev: { x: number }) => void on a Button type, and assign a handler that only reads x.",
    starter: `type Button = { onClick: (ev: { x: number; y: number }) => void };

const b: Button = {
  onClick: (ev) => {
    void ev.x;
  },
};
`,
    assertion: "no-errors",
    hints: [
      "A handler accepting a wider event (or only using a subset) is fine when parameters are contravariant — reading x from {x,y} is OK.",
    ],
    solution: `type Button = { onClick: (ev: { x: number; y: number }) => void };

const b: Button = {
  onClick: (ev) => {
    void ev.x;
  },
};
void b;
`,
  },
};
