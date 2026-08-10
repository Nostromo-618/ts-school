import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "declaration-merging",
  title: "Declaration merging",
  tier: "intermediate",
  track: "structures",
  order: 19,
  summary:
    "Two interfaces with the same name become one. The feature behind global augmentation, and the reason a stray declaration can change a type you `never` touched.",
  prerequisites: ["interface-vs-type-alias", "type-space-vs-value-space"],
  keywords: [
    "declaration merging",
    "augmentation",
    "global",
    "interface",
    "namespace",
  ],
  problem:
    "Redeclarations silently fight each other. Object and class APIs leak through optional fields, mutable shared state, or signatures that do not match how instances are actually used. Tighten the shape so consumers cannot rely on properties you `never` meant to promise. Consumers will depend on whatever the type allows, including accidents.",
  solution:
    "Merged interface requires both fields. Interfaces merge; type aliases do not. Merging is useful for augmentation — dangerous for app models. Prefer one declaration unless you are extending a library. Let inference work locally; annotate what crosses modules.",
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
