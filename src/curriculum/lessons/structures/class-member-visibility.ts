import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "class-member-visibility",
  title: "private, protected, and #private",
  tier: "beginner",
  track: "structures",
  order: 8,
  summary:
    "TypeScript's private/protected are compile-time only; #fields are true runtime privacy — know which boundary you need.",
  prerequisites: ["classes-intro"],
  keywords: ["private", "protected", "hash private", "encapsulation"],
  problem:
    "A token field is 'private' by convention (underscore) and still logged from every helper that receives the object.",
  js: {
    code: `function Session(token) {
  this._token = token;
}
Session.prototype.debug = function () {
  return this._token;
};

new Session("secret")._token;
`,
    highlights: [{ start: 8, end: 8 }],
    caption: "Underscore privacy is a social contract, not enforcement.",
  },
  ts: {
    code: `class Session {
  constructor(private token: string) {}

  debug(): string {
    return this.token;
  }
}

const s = new Session("secret");
s.token;
`,
    highlights: [{ start: 10, end: 10 }],
    caption: "private blocks external access at compile time.",
    expectedDiagnostics: [{ code: 2341, line: 10, messageIncludes: "private" }],
  },
  insight: [
    "TS private/protected erase — malicious JS can still read the property.",
    "#token is a runtime-private field checked by the engine.",
    "Use # or WeakMap patterns when secrecy matters; use private for API hygiene.",
  ],
  security: {
    title: "Compile-time private is not secrecy",
    body: "Do not store credentials in private fields expecting runtime isolation in shipped JS. Prefer #private, env vars outside objects you log, and never serialize secrets.",
    severity: "caution",
  },
  quiz: [
    {
      id: "q1",
      prompt: "Which privacy is enforced at runtime in modern JS?",
      choices: [
        { id: "a", text: "private token" },
        { id: "b", text: "#token" },
        { id: "c", text: "_token" },
        { id: "d", text: "protected token" },
      ],
      answerId: "b",
      explanation: "Hash private fields are a JavaScript language feature.",
    },
  ],
  exercise: {
    prompt: "Read the token through debug() instead of s.token.",
    starter: `class Session {
  constructor(private token: string) {}

  debug(): string {
    return this.token;
  }
}

const s = new Session("secret");
s.token;
`,
    assertion: "no-errors",
    hints: ["s.debug()"],
    solution: `class Session {
  constructor(private token: string) {}

  debug(): string {
    return this.token;
  }
}

const s = new Session("secret");
s.debug();
`,
  },
};
