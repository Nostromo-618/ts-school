import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "intersection-types",
  title: "Intersection types",
  tier: "intermediate",
  track: "structures",
  order: 12,
  summary:
    "A & B is everything from both. How it composes mixins and props, and how it produces `never` when the two disagree.",
  prerequisites: ["extending-interfaces", "type-aliases-intro"],
  keywords: ["intersection", "and", "mixin", "never", "composition"],
  problem:
    "Intersecting two types with a conflicting property gives a type with a `never` property, and the error appears at the use site.",
  js: {
    code: `function save(user) { return user.id + user.role; }
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Assuming both id and role exist.",
  },
  ts: {
    code: `type Id = { id: string };
type Role = { role: "admin" | "user" };
type Staff = Id & Role;

function save(user: Staff): string {
  return user.id + user.role;
}

save({ id: "1" });
`,
    highlights: [{ start: 9, end: 9 }],
    caption: "Intersection requires both sides. Missing role fails.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 9,
        messageIncludes: "Argument of type '{ id: string; }' is not assign",
      },
    ],
  },
  insight: [
    "A & B has properties of both.",
    "Conflicting properties can collapse to `never`.",
    "Prefer interfaces with extends for object merges you own.",
  ],
};
