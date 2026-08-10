import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "declaration-merging",
  title: "Declaration merging",
  tier: "intermediate",
  track: "structures",
  order: 19,
  summary:
    "Two interfaces with the same name become one. The feature behind global augmentation, and the reason a stray declaration can change a type you never touched.",
  prerequisites: ["interface-vs-type-alias", "type-space-vs-value-space"],
  keywords: [
    "declaration merging",
    "augmentation",
    "global",
    "interface",
    "namespace",
  ],
  problem:
    "An interface you did not write gained a property because a dependency declared one with the same name. Redeclarations silently fight each other. Interfaces merge; type aliases do not.",
  solution:
    "Merged interface requires both fields. Interfaces merge; type aliases do not. Merging is useful for augmentation — dangerous for app models. Prefer one declaration unless you are extending a library.",
  js: {
    code: `// two interfaces with same name in JS just overwrite
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Redeclarations silently fight each other.",
  },
  ts: {
    code: `interface User {
  id: string;
}
interface User {
  name: string;
}
const u: User = { id: "1", name: "Ada" };
const bad: User = { id: "1" };
`,
    highlights: [{ start: 8, end: 8 }],
    caption: "Merged interface requires both fields.",
    expectedDiagnostics: [
      {
        code: 2741,
        line: 8,
        messageIncludes: "Property 'name' is missing in type '{ id: string",
      },
    ],
  },
  insight: [
    "Interfaces merge; type aliases do not.",
    "Merging is useful for augmentation — dangerous for app models.",
    "Prefer one declaration unless you are extending a library.",
  ],
};
