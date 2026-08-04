import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "null-and-undefined",
  title: "null and undefined",
  tier: "beginner",
  track: "types",
  order: 6,
  summary:
    "The two absences JavaScript ships with, what strictNullChecks changes about them, and why 'cannot read properties of undefined' stops being a surprise.",
  prerequisites: ["union-types", "strict-mode"],
  keywords: ["null", "undefined", "strictNullChecks", "optional"],
  problem:
    "Without strictNullChecks every type silently includes null and undefined, so the most common runtime crash in Node is invisible to the checker.",
  js: {
    code: `function header(name) {
  return name.trim().toUpperCase();
}

header(undefined);
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "undefined.trim is a classic production TypeError.",
  },
  ts: {
    code: `function header(name: string): string {
  return name.trim().toUpperCase();
}

header(undefined);
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "undefined is not assignable to string under strictNullChecks.",
    expectedDiagnostics: [
      { code: 2345, line: 5, messageIncludes: "undefined" },
    ],
  },
  insight: [
    "null is often an intentional empty; undefined often means 'not provided' — pick a convention and stick to it.",
    "strictNullChecks makes both absences visible in the type system.",
    "Prefer T | undefined for optional params and T | null when a search can miss.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "With strictNullChecks, is string assignable from undefined?",
      choices: [
        { id: "a", text: "Yes always" },
        { id: "b", text: "No — include undefined in the type if needed" },
        { id: "c", text: "Only inside .js files" },
        { id: "d", text: "Only for const" },
      ],
      answerId: "b",
      explanation: "You must write string | undefined explicitly.",
    },
  ],
  exercise: {
    prompt: "Accept undefined and return a default header.",
    starter: `function header(name: string): string {
  return name.trim().toUpperCase();
}

header(undefined);
`,
    assertion: "no-errors",
    hints: ['name: string | undefined; (name ?? "guest").trim()...'],
    solution: `function header(name: string | undefined): string {
  return (name ?? "guest").trim().toUpperCase();
}

header(undefined);
`,
  },
};
