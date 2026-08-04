import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "structural-test-doubles",
  title: "Why fakes are cheap here",
  tier: "intermediate",
  track: "testing",
  order: 8,
  summary:
    "Structural typing means no interface declaration, no implements, and no framework â a plain object is a valid double if its shape matches.",
  prerequisites: ["typing-mocks-and-stubs", "interface-vs-type-alias"],
  keywords: [
    "test double",
    "fake",
    "structural",
    "dependency injection",
    "seam",
  ],
  problem:
    "Mocking frameworks exist to solve a nominal-typing problem that TypeScript does not have.",
  js: {
    code: `function greet(logger) { logger.info('hi'); }
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Duck-typed logger with no contract.",
  },
  ts: {
    code: `type Logger = { info(msg: string): void };
function greet(logger: Logger): void {
  logger.info("hi");
}
greet({ info: (m) => undefined });
greet({ info: (m) => m.length });
greet({ debug: (m) => undefined });
`,
    highlights: [{ start: 7, end: 7 }],
    caption:
      "Structural typing accepts matching shapes; debug-only object fails.",
    expectedDiagnostics: [
      {
        code: 2353,
        line: 7,
        messageIncludes: "Object literal may only specify known properties",
      },
      {
        code: 7006,
        line: 7,
        messageIncludes: "Parameter 'm' implicitly has an 'any' type.",
      },
    ],
  },
  insight: [
    "Structural typing makes lightweight stubs easy.",
    "Export small interfaces for dependencies.",
    "Avoid relying on excess fields in doubles.",
  ],
};
