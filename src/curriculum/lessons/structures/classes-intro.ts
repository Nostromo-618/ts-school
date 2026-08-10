import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "classes-intro",
  title: "Classes",
  tier: "beginner",
  track: "structures",
  order: 7,
  summary:
    "TypeScript classes add parameter properties and implements — while remaining ordinary constructor functions at runtime.",
  prerequisites: ["interfaces-intro"],
  keywords: ["class", "constructor", "implements", "parameter properties"],
  problem:
    "mail vs email — the classic factory typo. Object and class APIs leak through optional fields, mutable shared state, or signatures that do not match how instances are actually used. Tighten the shape so consumers cannot rely on properties you `never` meant to promise. Consumers will depend on whatever the type allows, including accidents.",
  solution:
    "Parameter properties create typed instance fields. public/`private`/`protected` in the constructor parameter list `declare` and assign fields. implements Interface checks the instance shape; it does not change emit. Prefer plain objects + functions unless you need identity, `instanceof`, or inheritance. The dual panes are the lesson: left fails, right refuses.",
  js: {
    code: `function makeUser(id, email) {
  return { id, mail: email };
}

const u = makeUser("1", "a@b.co");
u.email.toLowerCase();
`,
    highlights: [{ start: 6, end: 6 }],
    caption: "mail vs email — the classic factory typo.",
  },
  ts: {
    code: `class User {
  constructor(
    public id: string,
    public email: string,
  ) {}
}

const u = new User("1", "a@b.co");
u.mail.toLowerCase();
`,
    highlights: [{ start: 9, end: 9 }],
    caption: "Parameter properties create typed instance fields.",
    expectedDiagnostics: [{ code: 2551, line: 9, messageIncludes: "mail" }],
  },
  insight: [
    "public/private/protected in the constructor parameter list `declare` and assign fields.",
    "implements Interface checks the instance shape; it does not change emit.",
    "Prefer plain objects + functions unless you need identity, `instanceof`, or inheritance.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "What does `constructor(public id: string)` create?",
      choices: [
        { id: "a", text: "Only a local variable" },
        { id: "b", text: "An instance property id" },
        { id: "c", text: "A static property" },
        { id: "d", text: "A global" },
      ],
      answerId: "b",
      explanation: "Parameter properties are syntactic sugar for this.id = id.",
    },
  ],
  exercise: {
    prompt: "Read u.email instead of u.mail.",
    starter: `class User {
  constructor(
    public id: string,
    public email: string,
  ) {}
}

const u = new User("1", "a@b.co");
u.mail.toLowerCase();
`,
    assertion: "no-errors",
    hints: ["u.email"],
    solution: `class User {
  constructor(
    public id: string,
    public email: string,
  ) {}
}

const u = new User("1", "a@b.co");
u.email.toLowerCase();
`,
  },
};
