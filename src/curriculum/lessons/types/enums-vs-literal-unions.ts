import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "enums-vs-literal-unions",
  title: "Enums against unions of literals",
  tier: "beginner",
  track: "types",
  order: 11,
  summary:
    "enum emits real JavaScript, does not erase, and has surprising assignability. A union of string literals does the same job with none of that.",
  prerequisites: ["literal-types"],
  keywords: ["enum", "literal union", "const enum", "erasable"],
  problem:
    "Object maps still accept `any` string at the call site. The type system is supposed to make that state unrepresentable — if it does not, callers invent ad-hoc checks and still miss a branch. Model the domain so the illegal mix cannot be constructed. Prefer a model where the illegal state cannot be written down.",
  solution:
    "Prefer a union of string literals for closed vocabularies unless you need an enum's runtime object. Literal unions erase cleanly and exhaust well; numeric enums can be surprising under reverse mapping. The TypeScript pane shows which values are actually assignable — pick the model that matches how you serialize and compare.",
  js: {
    code: `const Role = { Admin: "admin", User: "user" };

function canDelete(role) {
  return role === Role.Admin;
}

canDelete("Admin"); // wrong string — silent false
`,
    highlights: [{ start: 7, end: 7 }],
    caption: "Object maps still accept `any` string at the call site.",
  },
  ts: {
    code: `enum Role {
  Admin = "admin",
  User = "user",
}

function canDelete(role: Role): boolean {
  return role === Role.Admin;
}

// String enums are not the same as their string values.
canDelete("admin");
`,
    highlights: [{ start: 11, end: 11 }],
    caption: 'Prefer type Role = "admin" | "user" for erasable string sets.',
    expectedDiagnostics: [{ code: 2345, line: 11, messageIncludes: "Role" }],
  },
  insight: [
    "Numeric enums are bidirectional and surprisingly assignable from number — a frequent footgun.",
    "`String` enums require the enum member; bare strings are rejected (as shown).",
    "For most Node apps, a union of string literals (or `as const` objects) is simpler and erases cleanly.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Why do many TypeScript style guides avoid enum?",
      choices: [
        { id: "a", text: "Enums cannot represent strings" },
        {
          id: "b",
          text: "They emit runtime code and have surprising assignability",
        },
        { id: "c", text: "They only work in browsers" },
        { id: "d", text: "`tsc` cannot check them" },
      ],
      answerId: "b",
      explanation:
        "Literal unions stay in the type system; enums become JavaScript objects.",
    },
  ],
  exercise: {
    prompt: "Replace the enum with a literal union and fix the call.",
    starter: `enum Role {
  Admin = "admin",
  User = "user",
}

function canDelete(role: Role): boolean {
  return role === Role.Admin;
}

canDelete("admin");
`,
    assertion: "no-errors",
    hints: ['type Role = "admin" | "user"'],
    solution: `type Role = "admin" | "user";

function canDelete(role: Role): boolean {
  return role === "admin";
}

canDelete("admin");
`,
  },
};
