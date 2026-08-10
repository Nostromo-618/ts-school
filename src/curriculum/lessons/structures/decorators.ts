import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "decorators",
  title: "Decorators",
  tier: "advanced",
  track: "structures",
  order: 23,
  summary:
    "Standard decorators and their context types, how they differ from the legacy experimental ones, and why frameworks still disagree about which to use.",
  prerequisites: ["classes-intro", "generic-utility-functions"],
  keywords: [
    "decorator",
    "experimentalDecorators",
    "metadata",
    "class",
    "framework",
  ],
  problem:
    "Two decorator designs exist in the wild, they are not compatible, and the `tsconfig` flag that picks between them is easy to inherit by accident. Look at the left pane: decorators are ordinary functions; typing context.kind matters in TS. Without a typechecker there is nothing to refuse that misuse while you type — only later, on a live path.",
  solution:
    "Decorator wrappers must preserve the method’s return type. experimentalDecorators enables the old TypeScript design; new code should prefer the standard model when the toolchain supports it. Context objects discriminate on kind: class, method, getter, setter, field, accessor. Do not mix legacy and standard decorators in one project — pick one emit story. Treat the TypeScript pane as the worked example of that refusal — diagnostics included — and the takeaways as what should stick after you leave the page.",
  js: {
    code: `// JS stage-3 decorators wrap definitions — frameworks differ on details.
function logged(value, context) {
  if (context.kind === "method") {
    return function (...args) {
      console.log("call", context.name);
      return value.call(this, ...args);
    };
  }
}
`,
    highlights: [{ start: 2, end: 10 }],
    caption:
      "Decorators are ordinary functions; typing context.kind matters in TS.",
  },
  ts: {
    code: `// Standard decorator = a function wrapping another function (simplified).
type MethodDecorator = <T extends (...args: never[]) => unknown>(
  value: T,
  context: { kind: "method"; name: string | symbol },
) => T;

const logged: MethodDecorator = (value, context) => {
  void context.name;
  return value;
};

function ping(): string {
  return "pong";
}

const decorated = logged(ping, { kind: "method", name: "ping" });
const bad: number = decorated();
`,
    highlights: [{ start: 16, end: 16 }],
    caption: "Decorator wrappers must preserve the method’s return type.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 17,
        messageIncludes: "string",
      },
    ],
  },
  insight: [
    "experimentalDecorators enables the old TypeScript design; new code should prefer the standard model when the toolchain supports it.",
    "Context objects discriminate on kind: class, method, getter, setter, field, accessor.",
    "Do not mix legacy and standard decorators in one project — pick one emit story.",
  ],
  quiz: [
    {
      id: "deco-q",
      prompt: "What does experimentalDecorators select?",
      choices: [
        { id: "a", text: "The TC39 standard decorator semantics" },
        { id: "b", text: "TypeScript’s older, incompatible decorator design" },
        { id: "c", text: "Only field decorators" },
        { id: "d", text: "Runtime reflection in every engine" },
      ],
      answerId: "b",
      explanation:
        "The flag opts into the legacy TypeScript decorator transform, not the standard one.",
    },
  ],
  exercise: {
    prompt:
      "Write identityDecorator that returns the method value unchanged and apply it to ping(): string.",
    starter: `type MethodDecorator = <T extends (...args: never[]) => unknown>(
  value: T,
  context: { kind: "method"; name: string | symbol },
) => T;
`,
    assertion: "no-errors",
    hints: ["const identityDecorator: MethodDecorator = (value) => value;"],
    solution: `type MethodDecorator = <T extends (...args: never[]) => unknown>(
  value: T,
  context: { kind: "method"; name: string | symbol },
) => T;

const identityDecorator: MethodDecorator = (value, _context) => value;

function ping(): string {
  return "pong";
}

const decorated = identityDecorator(ping, { kind: "method", name: "ping" });
const s: string = decorated();
void s;
`,
  },
};
