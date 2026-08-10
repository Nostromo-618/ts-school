import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "type-aliases-intro",
  title: "Type aliases",
  tier: "beginner",
  track: "structures",
  order: 2,
  summary:
    "type Name = ... gives `any` type a reusable name — objects, unions, tuples, and function types alike.",
  prerequisites: ["interfaces-intro", "union-types"],
  keywords: ["type alias", "type", "union alias"],
  problem:
    "Without a shared alias, shape drift is invisible. Object and class APIs leak through optional fields, mutable shared state, or signatures that do not match how instances are actually used. Tighten the shape so consumers cannot rely on properties you `never` meant to promise. Consumers will depend on whatever the type allows, including accidents.",
  solution:
    "Aliases keep the union and the object shape in one place. type can name unions, intersections, primitives, and tuples — interface cannot. Aliases are transparent: UserOrAnon is exactly User | `null`. Prefer one exported alias over repeating the same union inline. Public APIs first; loosen only where you can name the tradeoff.",
  js: {
    code: `function nameOf(user) {
  return user ? user.name : "anonymous";
}

nameOf({ name: 42 });
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "Without a shared alias, shape drift is invisible.",
  },
  ts: {
    code: `type User = { name: string };
type UserOrAnon = User | null;

function nameOf(user: UserOrAnon): string {
  return user ? user.name : "anonymous";
}

nameOf({ name: 42 });
`,
    highlights: [{ start: 8, end: 8 }],
    caption: "Aliases keep the union and the object shape in one place.",
    expectedDiagnostics: [{ code: 2322, line: 8, messageIncludes: "number" }],
  },
  insight: [
    "type can name unions, intersections, primitives, and tuples — interface cannot.",
    "Aliases are transparent: UserOrAnon is exactly User | `null`.",
    "Prefer one exported alias over repeating the same union inline.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Which can a type alias express that interface cannot?",
      choices: [
        { id: "a", text: "Object properties" },
        { id: "b", text: "A union like string | number" },
        { id: "c", text: "Optional fields" },
        { id: "d", text: "`Readonly` fields" },
      ],
      answerId: "b",
      explanation: "Interfaces only `declare` object (or callable) shapes.",
    },
  ],
  exercise: {
    prompt: "Pass a string name.",
    starter: `type User = { name: string };
type UserOrAnon = User | null;

function nameOf(user: UserOrAnon): string {
  return user ? user.name : "anonymous";
}

nameOf({ name: 42 });
`,
    assertion: "no-errors",
    hints: ['name: "Ada"'],
    solution: `type User = { name: string };
type UserOrAnon = User | null;

function nameOf(user: UserOrAnon): string {
  return user ? user.name : "anonymous";
}

nameOf({ name: "Ada" });
`,
  },
};
