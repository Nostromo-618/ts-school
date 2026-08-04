import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "extending-interfaces",
  title: "Extending an interface",
  tier: "beginner",
  track: "structures",
  order: 6,
  summary:
    "interface Child extends Parent adds fields while keeping assignability to the parent type.",
  prerequisites: ["interfaces-intro"],
  keywords: ["extends", "inheritance", "interface"],
  problem:
    "Admin users need a role field; copying the whole User interface guarantees the next User change is forgotten on Admin.",
  js: {
    code: `function audit(actor) {
  return actor.id + ":" + actor.role;
}

audit({ id: "1", name: "Ada" });
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "role is assumed; missing means undefined in the log line.",
  },
  ts: {
    code: `interface User {
  id: string;
  name: string;
}

interface Admin extends User {
  role: "admin";
}

function audit(actor: Admin): string {
  return actor.id + ":" + actor.role;
}

audit({ id: "1", name: "Ada" });
`,
    highlights: [{ start: 14, end: 14 }],
    caption: "Extends pulls in User fields and still requires role.",
    expectedDiagnostics: [{ code: 2345, line: 14, messageIncludes: "role" }],
  },
  insight: [
    "Child is assignable to Parent when it only adds fields (structural).",
    "Multiple extends is allowed: interface C extends A, B.",
    "Prefer extends over copy-paste when modeling specialization.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Is Admin assignable to User?",
      choices: [
        { id: "a", text: "Usually yes — it has at least User's fields" },
        { id: "b", text: "Never" },
        { id: "c", text: "Only with as User" },
        { id: "d", text: "Only at runtime" },
      ],
      answerId: "a",
      explanation: "Structural typing: extra fields are fine for variables.",
    },
  ],
  exercise: {
    prompt: 'Include role: "admin" in the call.',
    starter: `interface User {
  id: string;
  name: string;
}

interface Admin extends User {
  role: "admin";
}

function audit(actor: Admin): string {
  return actor.id + ":" + actor.role;
}

audit({ id: "1", name: "Ada" });
`,
    assertion: "no-errors",
    hints: ['Add role: "admin"'],
    solution: `interface User {
  id: string;
  name: string;
}

interface Admin extends User {
  role: "admin";
}

function audit(actor: Admin): string {
  return actor.id + ":" + actor.role;
}

audit({ id: "1", name: "Ada", role: "admin" });
`,
  },
};
