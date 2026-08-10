import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "class-member-visibility",
  title: "private, protected, and #private",
  tier: "beginner",
  track: "structures",
  order: 8,
  summary:
    "TypeScript's `private`/`protected` are compile-time only; `#fields` are true runtime privacy — know which boundary you need.",
  prerequisites: ["classes-intro"],
  keywords: ["private", "protected", "hash private", "encapsulation"],
  problem:
    'A session object stores an auth token behind an underscore — `_token` — and the team treats that as "private." It is not. Any helper that receives the object can read `session._token`, log it, stash it on `window`, or ship it in a debug payload. Look at the left pane: underscore privacy is a social contract, not enforcement. JavaScript will run that access anyway, so a token that was supposed to stay inside `Session` leaks the moment someone is curious, rushed, or malicious.',
  solution:
    "`private` on a TypeScript field (or a parameter property) blocks *external* access at compile time — `s.token` becomes an error — which is the right tool for API hygiene inside a typed codebase. It does **not** create runtime secrecy: emitted JavaScript still has an ordinary property, so malicious or untyped JS can still read it. `#token` is a different animal: it is a JavaScript language feature checked by the engine, so access from outside the class fails at runtime too. Use `private`/`protected` when you want the typechecker to keep callers honest; use `#` (or a `WeakMap`) when the value must stay unreachable after the code ships. The TypeScript pane shows the compile-time refusal; the security note below is the reminder not to confuse that refusal with encryption.",
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
    caption: "`private` blocks external access at compile time.",
    expectedDiagnostics: [{ code: 2341, line: 10, messageIncludes: "private" }],
  },
  insight: [
    "TS `private`/`protected` erase — malicious JS can still read the property.",
    "`#token` is a runtime-private field checked by the engine.",
    "Use `#` or `WeakMap` patterns when secrecy matters; use `private` for API hygiene.",
  ],
  security: {
    title: "Compile-time private is not secrecy",
    body: "Do not store credentials in `private` fields expecting runtime isolation in shipped JS. Prefer `#private`, env vars outside objects you log, and never serialize secrets.",
    severity: "caution",
  },
  quiz: [
    {
      id: "q1",
      prompt: "Which privacy is enforced at runtime in modern JS?",
      choices: [
        { id: "a", text: "`private` token" },
        { id: "b", text: "`#token`" },
        { id: "c", text: "`_token`" },
        { id: "d", text: "`protected` token" },
      ],
      answerId: "b",
      explanation: "Hash private fields are a JavaScript language feature.",
    },
  ],
  exercise: {
    prompt: "Read the token through `debug()` instead of `s.token`.",
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
    hints: ["`s.debug()`"],
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
