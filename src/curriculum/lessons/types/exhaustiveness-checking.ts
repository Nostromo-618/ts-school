import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "exhaustiveness-checking",
  title: "Exhaustiveness checking",
  tier: "intermediate",
  track: "types",
  order: 13,
  summary:
    "Assign the narrowed value to never in the default branch and the compiler tells you the day someone adds a variant you did not handle.",
  prerequisites: ["discriminated-unions"],
  keywords: ["never", "exhaustive", "switch", "assertNever", "default case"],
  problem:
    "Adding a case to a union is a one-line change; finding the nine switch statements that needed updating is not.",
  js: {
    code: `function area(shape) {
  if (shape.kind === "circle") return Math.PI * shape.r ** 2;
  if (shape.kind === "square") return shape.size ** 2;
}
`,
    highlights: [{ start: 1, end: 4 }],
    caption: "Missing triangle case returns undefined.",
  },
  ts: {
    code: `type Shape =
  | { kind: "circle"; r: number }
  | { kind: "square"; size: number }
  | { kind: "triangle"; base: number; height: number };

function assertNever(x: never): never {
  throw new Error("unexpected");
}

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.r ** 2;
    case "square":
      return shape.size ** 2;
    default:
      return assertNever(shape);
  }
}
`,
    highlights: [{ start: 18, end: 18 }],
    caption: "default: assertNever(shape) errors until triangle is handled.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 17,
        messageIncludes: 'Argument of type \'{ kind: "triangle"; base: numb',
      },
    ],
  },
  insight: [
    "assertNever(shape) in the default branch forces new variants to be handled.",
    "Without it, forgetting a case returns undefined silently in JS.",
    "Prefer switch over if-chains for tagged unions.",
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Why call `assertNever(shape)` in a switch default?",
      choices: [
        { id: "a", text: "It silences all diagnostics in the function" },
        {
          id: "b",
          text: "If a new union member is unhandled, shape is not never and the call errors",
        },
        { id: "c", text: "It makes the switch run faster" },
        { id: "d", text: "It converts shape into unknown" },
      ],
      answerId: "b",
      explanation:
        "Exhaustiveness checking uses never: leftover variants refuse to assign to never, so the default becomes a compile-time alarm.",
    },
  ],
  diagram: {
    version: "1.2.0",
    viewport: { x: 0, y: 0, scale: 1 },
    nodes: [
      {
        id: "switch",
        type: "rounded-rect",
        x: 0,
        y: 40,
        width: 160,
        height: 72,
        text: "switch (kind)",
        data: {},
      },
      {
        id: "cases",
        type: "rounded-rect",
        x: 220,
        y: 0,
        width: 180,
        height: 72,
        text: "Handle known cases",
        data: {},
      },
      {
        id: "never",
        type: "rounded-rect",
        x: 220,
        y: 100,
        width: 180,
        height: 72,
        text: "default → never",
        data: {},
      },
    ],
    edges: [
      {
        id: "e1",
        from: { nodeId: "switch", port: "right" },
        to: { nodeId: "cases", port: "left" },
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
        from: { nodeId: "switch", port: "right" },
        to: { nodeId: "never", port: "left" },
        kind: "arrow",
        startMarker: "none",
        endMarker: "arrow",
        strokeWidth: 2,
        route: "orthogonal",
        label: "",
        data: {},
      },
    ],
  },
};
