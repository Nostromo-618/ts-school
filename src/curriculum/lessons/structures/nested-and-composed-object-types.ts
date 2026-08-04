import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "nested-and-composed-object-types",
  title: "Composing object types",
  tier: "beginner",
  track: "structures",
  order: 5,
  summary:
    "Build larger shapes from smaller ones with nesting, intersection (&), and extends — without copy-pasting fields.",
  prerequisites: ["optional-and-readonly-properties", "type-aliases-intro"],
  keywords: ["composition", "intersection", "nested", "extends"],
  problem:
    "Address fields are duplicated on User, Order, and Invoice until one of them renames zip to postalCode alone.",
  js: {
    code: `function shipTo(order) {
  return order.street + ", " + order.zip;
}

shipTo({ street: "1 Main", postalCode: "94105" });
`,
    highlights: [{ start: 5, end: 5 }],
    caption: "Duplicated shapes drift under different names.",
  },
  ts: {
    code: `type Address = { street: string; zip: string };
type Order = { id: string; shipTo: Address };

function shipTo(order: Order): string {
  return order.shipTo.street + ", " + order.shipTo.zip;
}

shipTo({ id: "o1", shipTo: { street: "1 Main", postalCode: "94105" } });
`,
    highlights: [{ start: 8, end: 8 }],
    caption: "Compose Address once; nest it where needed.",
    expectedDiagnostics: [
      { code: 2353, line: 8, messageIncludes: "postalCode" },
    ],
  },
  insight: [
    "Nest object types for ownership (Order.shipTo: Address).",
    "A & B intersects properties — useful for mixing capabilities.",
    "interface Child extends Parent { ... } is the interface form of composition.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Why compose Address instead of inlining fields?",
      choices: [
        { id: "a", text: "It runs faster" },
        { id: "b", text: "One definition stays consistent across use sites" },
        { id: "c", text: "TypeScript requires it" },
        { id: "d", text: "It enables eval" },
      ],
      answerId: "b",
      explanation: "Shared aliases prevent renames from going half-done.",
    },
  ],
  exercise: {
    prompt: "Use zip in the nested address.",
    starter: `type Address = { street: string; zip: string };
type Order = { id: string; shipTo: Address };

function shipTo(order: Order): string {
  return order.shipTo.street + ", " + order.shipTo.zip;
}

shipTo({ id: "o1", shipTo: { street: "1 Main", postalCode: "94105" } });
`,
    assertion: "no-errors",
    hints: ['zip: "94105"'],
    solution: `type Address = { street: string; zip: string };
type Order = { id: string; shipTo: Address };

function shipTo(order: Order): string {
  return order.shipTo.street + ", " + order.shipTo.zip;
}

shipTo({ id: "o1", shipTo: { street: "1 Main", zip: "94105" } });
`,
  },
};
