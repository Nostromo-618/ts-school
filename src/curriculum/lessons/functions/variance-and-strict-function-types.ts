import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "variance-and-strict-function-types",
  title: "Variance and strictFunctionTypes",
  tier: "advanced",
  track: "functions",
  order: 16,
  summary:
    "`Parameters` are contravariant, returns are covariant — except for methods, which stayed bivariant on purpose. What that trade actually costs you.",
  prerequisites: ["void-returning-callbacks", "assignability-rules"],
  keywords: [
    "variance",
    "covariant",
    "contravariant",
    "bivariance",
    "strictFunctionTypes",
  ],
  problem:
    "JS will call whatever you register; wrong assumptions crash later. Shared helpers amplify the hole: wrong arguments, erased returns, or forgotten type relationships spread to every caller. Callers copy the signature they see — if it lies, the lie spreads.",
  solution:
    "Assigning a narrower-parameter handler is rejected under `strictFunctionTypes`. Return types are covariant: a function returning Dog may stand in for one returning Animal. Parameter types are contravariant for function types when `strictFunctionTypes` is on. Methods stay bivariant for DOM/framework ergonomics — prefer function-typed properties for safety. Let inference work locally; annotate what crosses modules.",
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
    caption:
      "JS will call whatever you register; wrong assumptions crash later.",
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
    caption:
      "Assigning a narrower-parameter handler is rejected under `strictFunctionTypes`.",
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
    "Parameter types are contravariant for function types when `strictFunctionTypes` is on.",
    "Methods stay bivariant for DOM/framework ergonomics — prefer function-typed properties for safety.",
  ],
  quiz: [
    {
      id: "variance-q1",
      prompt:
        "With `strictFunctionTypes`, may Handler<Dog> be assigned to Handler<Animal>?",
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
      "Fix onClick so it accepts the Button event shape (or only uses fields that exist on it). Match the solution text.",
    starter: `type Button = { onClick: (ev: { x: number; y: number }) => void };

const b: Button = {
  onClick: (ev: { x: number; y: number; z: number }) => {
    void ev.z;
  },
};
`,
    assertion: "no-errors",
    hints: [
      "Drop the z requirement — a handler that needs a narrower event is not assignable under contravariance.",
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
