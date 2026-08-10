import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "polymorphic-this-types",
  title: "Polymorphic this",
  tier: "advanced",
  track: "structures",
  order: 21,
  summary:
    "A method that returns this keeps the subclass's type through a chain — the mechanism behind every fluent builder that survives inheritance.",
  prerequisites: ["abstract-classes", "generic-classes-and-interfaces"],
  keywords: ["this type", "fluent", "builder", "chaining", "subclass"],
  problem:
    "A builder method typed to return the base class truncates the chain the moment someone subclasses it. Look at the left pane: runtime this-chaining works; bad return types break it in TS. The language will happily evaluate it; only a later runtime path reveals the damage.",
  solution:
    "Returning this preserves UserBuilder through the chain. The polymorphic this type is the type of the implementing class, not the base declaration site. Fluent APIs should return this (or a generic subtype) rather than the base class name. Interfaces can use thisType and methods returning this for the same pattern. Treat the TypeScript pane as the worked example of that refusal — diagnostics included — and the takeaways as what should stick after you leave the page.",
  js: {
    code: `// JS: fluent builders return this — subclasses keep working at runtime.
class Builder {
  withName(name) {
    this.name = name;
    return this;
  }
}
class UserBuilder extends Builder {
  withEmail(email) {
    this.email = email;
    return this;
  }
}
new UserBuilder().withName("Ada").withEmail("a@b.co");
`,
    highlights: [{ start: 14, end: 14 }],
    caption: "Runtime this-chaining works; bad return types break it in TS.",
  },
  ts: {
    code: `class Builder {
  name = "";
  withName(name: string): this {
    this.name = name;
    return this;
  }
}

class UserBuilder extends Builder {
  email = "";
  withEmail(email: string): this {
    this.email = email;
    return this;
  }
}

const u = new UserBuilder().withName("Ada").withEmail("a@b.co");

// If withName returned Builder, withEmail would not exist on the chain:
const bad: Builder = new UserBuilder().withName("Ada");
bad.withEmail("x");
`,
    highlights: [{ start: 22, end: 22 }],
    caption: "Returning this preserves UserBuilder through the chain.",
    expectedDiagnostics: [
      {
        code: 2339,
        line: 21,
        messageIncludes: "withEmail",
      },
    ],
  },
  insight: [
    "The polymorphic this type is the type of the implementing class, not the base declaration site.",
    "Fluent APIs should return this (or a generic subtype) rather than the base class name.",
    "Interfaces can use thisType and methods returning this for the same pattern.",
  ],
  quiz: [
    {
      id: "this-poly",
      prompt: "Why return `this` instead of `Builder` from withName?",
      choices: [
        { id: "a", text: "It is faster at runtime" },
        { id: "b", text: "Subclasses keep their own type through the chain" },
        { id: "c", text: "Builder is not a valid return type" },
        { id: "d", text: "It enables experimentalDecorators" },
      ],
      answerId: "b",
      explanation:
        "this stays UserBuilder after withName, so withEmail remains available.",
    },
  ],
  exercise: {
    prompt: "Add setX(x: number): this to a class Point and chain setX(1).",
    starter: `class Point {
  x = 0;
  setX(x: number) {
    this.x = x;
    return this;
  }
}
`,
    assertion: "no-errors",
    hints: ["Annotate return type as this."],
    solution: `class Point {
  x = 0;
  setX(x: number): this {
    this.x = x;
    return this;
  }
}

const p = new Point().setX(1);
void p;
`,
  },
};
