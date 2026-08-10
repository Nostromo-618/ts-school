import type { Lesson } from "@/curriculum/types";

export const lesson: Lesson = {
  id: "module-resolution-explained",
  title: "How an import is resolved",
  tier: "intermediate",
  track: "tooling",
  order: 13,
  summary:
    "node16, nodenext, and bundler; baseUrl and paths; why the resolution mode changes what an import even means.",
  prerequisites: ["package-json-exports-and-types", "tsc-cli"],
  keywords: [
    "moduleResolution",
    "nodenext",
    "bundler",
    "paths",
    "baseUrl",
    "resolution",
  ],
  problem:
    "Cannot find module for a package that is definitely installed is nearly always a resolution-mode mismatch, not a missing dependency. Look at the left pane: extensionless requires everywhere. Without a typechecker there is nothing to refuse that misuse while you type — only later, on a live path.",
  solution:
    "Illustrative API: nodenext wants ./util.js — extensionless fails the SpecFor check. `moduleResolution` bundler vs nodenext change legal specifiers. Match resolution to your runtime (Node vs bundler). Do not mix modes across packages carelessly. Hold the dual panes side by side: the left side is the silent failure; the right side is where the checker finally refuses it.",
  js: {
    code: `require('./util');
`,
    highlights: [{ start: 1, end: 1 }],
    caption: "Extensionless requires everywhere.",
  },
  ts: {
    code: `// Illustrative: nodenext wants a .js extension on relative specs.
type Mode = "bundler" | "nodenext";
type SpecFor<M extends Mode> = M extends "nodenext" ? \`\${string}.js\` : string;
declare function resolve<M extends Mode>(mode: M, spec: SpecFor<M>): string;
const a = resolve("bundler", "./util");
const b = resolve("nodenext", "./util.js");
const bad = resolve("nodenext", "./util");
`,
    highlights: [{ start: 7, end: 7 }],
    caption:
      "Illustrative API: nodenext wants ./util.js — extensionless fails the SpecFor check.",
    expectedDiagnostics: [
      {
        code: 2345,
        line: 7,
        messageIncludes: ".js",
      },
    ],
  },
  insight: [
    "`moduleResolution` bundler vs nodenext change legal specifiers.",
    "Match resolution to your runtime (Node vs bundler).",
    "Do not mix modes across packages carelessly.",
  ],
  diagram: {
    version: "1.2.0",
    viewport: { x: 0, y: 0, scale: 1 },
    nodes: [
      {
        id: "spec",
        type: "rounded-rect",
        x: 20,
        y: 100,
        width: 160,
        height: 72,
        text: 'import "./util"',
        data: {},
      },
      {
        id: "mode",
        type: "diamond",
        x: 240,
        y: 76,
        width: 184,
        height: 120,
        text: "`moduleResolution`?",
        data: {},
      },
      {
        id: "bundler",
        type: "rounded-rect",
        x: 500,
        y: 20,
        width: 180,
        height: 72,
        text: "bundler: allow",
        data: {},
      },
      {
        id: "nodenext",
        type: "rounded-rect",
        x: 500,
        y: 200,
        width: 180,
        height: 72,
        text: "nodenext: need `.js`",
        data: {},
      },
    ],
    edges: [
      {
        id: "e1",
        from: { nodeId: "spec", port: "right" },
        to: { nodeId: "mode", port: "left" },
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
        from: { nodeId: "mode", port: "top" },
        to: { nodeId: "bundler", port: "left" },
        kind: "arrow",
        startMarker: "none",
        endMarker: "arrow",
        strokeWidth: 2,
        route: "orthogonal",
        label: "bundler",
        data: {},
      },
      {
        id: "e3",
        from: { nodeId: "mode", port: "bottom" },
        to: { nodeId: "nodenext", port: "left" },
        kind: "arrow",
        startMarker: "none",
        endMarker: "arrow",
        strokeWidth: 2,
        route: "orthogonal",
        label: "nodenext",
        data: {},
      },
    ],
  },
};
