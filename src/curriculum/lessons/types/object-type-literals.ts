import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "object-type-literals",
  title: "Object types",
  tier: "beginner",
  track: "types",
  order: 3,
  summary:
    "Describing a shape inline: required and optional properties, nested objects, and how the checker compares two of them.",
  prerequisites: ["primitive-types", "structural-typing"],
  keywords: ["object type", "properties", "optional", "nested"],
  problem:
    "Every Node handler passes objects around, and without a shape written down the only documentation is the last person who read the code.",
  js: {
    code: `function createSession(input) {
  return {
    userId: input.user_id,
    expiresAt: Date.now() + input.ttlMs,
  };
}

createSession({ userId: "u1", ttlMs: 60_000 });
`,
    highlights: [{ start: 7, end: 7 }],
    caption: "Snake_case vs camelCase — `undefined` expiresAt math.",
  },
  ts: {
    code: `type SessionInput = {
  user_id: string;
  ttlMs: number;
};

function createSession(input: SessionInput) {
  return {
    userId: input.user_id,
    expiresAt: Date.now() + input.ttlMs,
  };
}

createSession({ userId: "u1", ttlMs: 60_000 });
`,
    highlights: [{ start: 13, end: 13 }],
    caption: "The object type names the fields callers must provide.",
    expectedDiagnostics: [{ code: 2561, line: 13, messageIncludes: "userId" }],
  },
  insight: [
    "Write the shape once at the boundary; let inference carry it inward.",
    "Optional properties use ?: — absent is not the same as present-but-`undefined` unless you configure `exactOptionalPropertyTypes`.",
    "Nested objects are just properties whose types are other object types.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "What is SessionInput in this lesson?",
      choices: [
        { id: "a", text: "A runtime class" },
        { id: "b", text: "A compile-time shape for an object" },
        { id: "c", text: "A JSON schema validator" },
        { id: "d", text: "A Node built-in" },
      ],
      answerId: "b",
      explanation: "type aliases for objects exist only for the checker.",
    },
  ],
  exercise: {
    prompt: "Fix the call to use user_id.",
    starter: `type SessionInput = {
  user_id: string;
  ttlMs: number;
};

function createSession(input: SessionInput) {
  return {
    userId: input.user_id,
    expiresAt: Date.now() + input.ttlMs,
  };
}

createSession({ userId: "u1", ttlMs: 60_000 });
`,
    assertion: "no-errors",
    hints: ['{ user_id: "u1", ttlMs: 60_000 }'],
    solution: `type SessionInput = {
  user_id: string;
  ttlMs: number;
};

function createSession(input: SessionInput) {
  return {
    userId: input.user_id,
    expiresAt: Date.now() + input.ttlMs,
  };
}

createSession({ user_id: "u1", ttlMs: 60_000 });
`,
  },
};
