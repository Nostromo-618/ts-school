import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "optional-and-readonly-properties",
  title: "Optional and readonly properties",
  tier: "beginner",
  track: "structures",
  order: 4,
  summary:
    "?: for fields that may be absent, `readonly` for fields that must not be reassigned — and how each changes assignability.",
  prerequisites: ["interfaces-intro", "null-and-undefined"],
  keywords: ["optional", "readonly", "?", "mutation"],
  problem:
    "A config object gets mutated mid-request; the next handler sees a different port than the one that was validated.",
  js: {
    code: `function bind(config) {
  config.port = Number(config.port);
  return config.port;
}

const cfg = { port: "3000" };
bind(cfg);
`,
    highlights: [{ start: 2, end: 2 }],
    caption: "Mutation changes meaning for every other reference to cfg.",
  },
  ts: {
    code: `interface Config {
  readonly port: number;
  host?: string;
}

function bind(config: Config): number {
  config.port = 4000;
  return config.port;
}
`,
    highlights: [{ start: 7, end: 7 }],
    caption: "`readonly` blocks assignment through that property.",
    expectedDiagnostics: [{ code: 2540, line: 7, messageIncludes: "port" }],
  },
  insight: [
    "optional (host?) means the property may be missing; read it as T | `undefined`.",
    "`readonly` is a type-level constraint — runtime code can still mutate if it cheats.",
    "Combine them: `readonly` id: string for identity fields that never change.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "What does `readonly` prevent?",
      choices: [
        { id: "a", text: "Reading the property" },
        { id: "b", text: "Assigning to the property through that type" },
        { id: "c", text: "JSON serialization" },
        { id: "d", text: "Spreading the object" },
      ],
      answerId: "b",
      explanation: "It is a compile-time assignment check.",
    },
  ],
  exercise: {
    prompt: "Return port without reassigning it.",
    starter: `interface Config {
  readonly port: number;
  host?: string;
}

function bind(config: Config): number {
  config.port = 4000;
  return config.port;
}
`,
    assertion: "no-errors",
    hints: ["Just return config.port"],
    solution: `interface Config {
  readonly port: number;
  host?: string;
}

function bind(config: Config): number {
  return config.port;
}
`,
  },
};
