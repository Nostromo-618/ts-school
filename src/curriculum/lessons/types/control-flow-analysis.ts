import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "control-flow-analysis",
  title: "How control-flow analysis works",
  tier: "advanced",
  track: "types",
  order: 21,
  summary:
    "The checker walks your code as a graph and computes a type per reference. Understanding that graph explains every narrowing that surprised you.",
  prerequisites: [
    "truthiness-narrowing",
    "equality-narrowing",
    "in-operator-narrowing",
  ],
  keywords: [
    "control flow",
    "CFA",
    "narrowing",
    "flow node",
    "aliased condition",
  ],
  problem:
    "Narrowing looks like magic until it stops working, and then there is nothing to reason about unless you know what it is actually doing.",
  js: {
    code: `// JS: if-checks are just branches — no type changes.
function len(x) {
  if (typeof x === "string") return x.length;
  return x;
}
`,
    highlights: [{ start: 3, end: 4 }],
    caption:
      "Control flow in JS does not refine declared types — there are none.",
  },
  ts: {
    code: `function label(x: string | number) {
  if (typeof x === "string") {
    return x.toUpperCase();
  }
  return x.toFixed(1);
}

function broken(x: string | number) {
  const isStr = typeof x === "string";
  if (isStr) {
    // Aliased conditions are tracked in modern TS — but mutation breaks them.
    return x.toUpperCase();
  }
  return x.toFixed(1);
}

const n: number = label("hi");
`,
    highlights: [{ start: 17, end: 17 }],
    caption:
      "CFA narrows in branches; wrong assignments still fail outside them.",
    expectedDiagnostics: [
      {
        code: 2322,
        line: 17,
        messageIncludes: "string",
      },
    ],
  },
  insight: [
    "Each reference gets a type from reaching definitions along the control-flow graph.",
    "Discriminant checks, `typeof`, and equality create edges that refine types in true/false successors.",
    "When CFA “fails,” ask what assignment or call could have invalidated the predicate since it was proven.",
  ],
  diagram: {
    version: "1.2.0",
    viewport: { x: 0, y: 0, scale: 1 },
    nodes: [
      {
        id: "entry",
        type: "circle",
        x: 20,
        y: 100,
        width: 96,
        height: 96,
        text: "x: string | number",
        data: {},
      },
      {
        id: "test",
        type: "diamond",
        x: 200,
        y: 88,
        width: 184,
        height: 120,
        text: '`typeof` x === "string"',
        data: {},
      },
      {
        id: "true",
        type: "rounded-rect",
        x: 460,
        y: 20,
        width: 160,
        height: 72,
        text: "x: string",
        data: {},
      },
      {
        id: "false",
        type: "rounded-rect",
        x: 460,
        y: 200,
        width: 160,
        height: 72,
        text: "x: number",
        data: {},
      },
    ],
    edges: [
      {
        id: "e1",
        from: { nodeId: "entry", port: "right" },
        to: { nodeId: "test", port: "left" },
        kind: "arrow",
        startMarker: "none",
        endMarker: "arrow",
        strokeWidth: 2,
        route: "orthogonal",
        label: "",
        data: {},
      },
      {
        id: "e2",
        from: { nodeId: "test", port: "top" },
        to: { nodeId: "true", port: "left" },
        kind: "arrow",
        startMarker: "none",
        endMarker: "arrow",
        strokeWidth: 2,
        route: "orthogonal",
        label: "true",
        data: {},
      },
      {
        id: "e3",
        from: { nodeId: "test", port: "bottom" },
        to: { nodeId: "false", port: "left" },
        kind: "arrow",
        startMarker: "none",
        endMarker: "arrow",
        strokeWidth: 2,
        route: "orthogonal",
        label: "false",
        data: {},
      },
    ],
  },
  quiz: [
    {
      id: "cfa-q",
      prompt: "What does control-flow analysis compute?",
      choices: [
        { id: "a", text: "Runtime performance of each branch" },
        {
          id: "b",
          text: "A type for each expression based on reachable paths",
        },
        { id: "c", text: "The bundle size of the module" },
        { id: "d", text: "Whether a function is pure" },
      ],
      answerId: "b",
      explanation:
        "CFA assigns types per reference by analyzing which predicates hold on each path.",
    },
  ],
  exercise: {
    prompt:
      'Write narrow(x: `unknown`): string that returns x if `typeof` x === "string", else "".',
    starter: `function narrow(x: unknown) {
  return "";
}
`,
    assertion: "no-errors",
    hints: ["Use `typeof` and return x in the string branch."],
    solution: `function narrow(x: unknown): string {
  if (typeof x === "string") return x;
  return "";
}
`,
  },
};
