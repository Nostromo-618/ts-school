/**
 * Milestone and chart data for `/history`.
 *
 * Chart series are deliberately illustrative — teaching shapes, not measured
 * market share. Replace numbers only when a cited source is attached here.
 */

export type TimelineTone = "default" | "success" | "warning" | "danger";

export interface HistoryMilestone {
  id: string;
  /** Display year or year-range, e.g. "2009" or "2015". */
  date: string;
  /** Sort key (earliest first). Mid-year events use YYYY.M. */
  sortKey: number;
  title: string;
  body: string;
  tone?: TimelineTone;
  /** Optional era tag for tests and filtering. */
  era: "javascript" | "node" | "typescript" | "checker";
}

export interface ChartSeriesMeta {
  /** Visible series name shown in legends / chart titles. */
  name: string;
  /** True when the numbers are pedagogical, not measured. */
  illustrative: boolean;
  /** Citation URL when `illustrative` is false. */
  sourceUrl?: string;
  /** Short citation label when `illustrative` is false. */
  sourceLabel?: string;
}

export interface AdoptionLinePoint {
  year: number;
  /** Illustrative relative index (not absolute download counts). */
  typescript: number;
  javascript: number;
}

export interface StackShareBarPoint {
  stack: string;
  /** Illustrative share among a fictional Node survey cohort (0–100). */
  share: number;
}

export const HISTORY_CHART_DISCLAIMER =
  "Illustrative only — shapes teach the adoption story; they are not measured market share.";

export const milestones: readonly HistoryMilestone[] = [
  {
    id: "es5",
    date: "2009",
    sortKey: 2009,
    title: "ECMAScript 5",
    body: "Strict mode, getters/setters, and Array extras land. The dialect most Node code still assumes as its floor.",
    era: "javascript",
  },
  {
    id: "node-0-1",
    date: "2009",
    sortKey: 2009.5,
    title: "Node.js begins",
    body: "Ryan Dahl ships an evented JavaScript runtime on V8. Server-side JS stops being a curiosity.",
    era: "node",
    tone: "success",
  },
  {
    id: "typescript-1",
    date: "2012",
    sortKey: 2012,
    title: "TypeScript 1.0 path opens",
    body: "Anders Hejlsberg's typed superset of JavaScript is announced (1.0 follows in 2014). Types erase; the runtime stays JavaScript.",
    era: "typescript",
    tone: "success",
  },
  {
    id: "es2015",
    date: "2015",
    sortKey: 2015,
    title: "ES2015 (ES6)",
    body: "Classes, modules, arrows, promises, let/const. JavaScript's annual release train starts here.",
    era: "javascript",
  },
  {
    id: "node-lts-pattern",
    date: "2015",
    sortKey: 2015.3,
    title: "Node.js LTS cadence",
    body: "Even-numbered releases enter Long Term Support. Teams stop chasing every minor and pin an LTS line.",
    era: "node",
  },
  {
    id: "typescript-2",
    date: "2016",
    sortKey: 2016,
    title: "TypeScript 2.x — null as a type",
    body: 'strictNullChecks and control-flow analysis make "undefined is not an object" a compile-time conversation.',
    era: "typescript",
  },
  {
    id: "typescript-3",
    date: "2018",
    sortKey: 2018,
    title: "TypeScript 3.x — project scale",
    body: "Project references, unknown, and richer tuple/rest typing. Monorepos stop being a tsc afterthought.",
    era: "typescript",
  },
  {
    id: "typescript-4",
    date: "2020",
    sortKey: 2020,
    title: "TypeScript 4.x — template literals & variance",
    body: "Template literal types, labeled tuples, and explicit variance annotations push type-level programming into daily use.",
    era: "typescript",
  },
  {
    id: "node-esm",
    date: "2020",
    sortKey: 2020.5,
    title: "Node.js ESM stabilises",
    body: '"type": "module", import assertions evolving toward import attributes, and the long CJS↔ESM interop story.',
    era: "node",
  },
  {
    id: "typescript-5",
    date: "2023",
    sortKey: 2023,
    title: "TypeScript 5.x — decorators & const type params",
    body: "Standard decorators, const type parameters, and satisfies. The language feels finished for application code.",
    era: "typescript",
  },
  {
    id: "typescript-6",
    date: "2025",
    sortKey: 2025,
    title: "TypeScript 6 — last Strada (JS) compiler line",
    body: "TypeScript 6.0.3 is the last JavaScript-hosted compiler with a programmatic API this site can run in a browser worker.",
    era: "typescript",
    tone: "success",
  },
  {
    id: "typescript-7-go",
    date: "2025",
    sortKey: 2025.5,
    title: "TypeScript 7 — Go native port",
    body: "Microsoft rewrites the compiler in Go for speed. The native binary has no browser-embeddable programmatic API yet (a new API is targeted later). CLI-only for now.",
    era: "typescript",
    tone: "warning",
  },
  {
    id: "checker-pin",
    date: "today",
    sortKey: 2026,
    title: "This school's checker: TypeScript 6.0.3",
    body: "Live lesson panes type-check with typescript@6.0.3 in a Web Worker because TS 7 cannot run in the browser. One pin serves vue-tsc, ESLint, the worker, and the compiler-truth suite.",
    era: "checker",
    tone: "success",
  },
];

/** Illustrative relative adoption index (not downloads). */
export const adoptionLineMeta: ChartSeriesMeta = {
  name: "Relative adoption index (illustrative)",
  illustrative: true,
};

export const adoptionLinePoints: readonly AdoptionLinePoint[] = [
  { year: 2014, typescript: 8, javascript: 72 },
  { year: 2016, typescript: 18, javascript: 74 },
  { year: 2018, typescript: 32, javascript: 76 },
  { year: 2020, typescript: 48, javascript: 78 },
  { year: 2022, typescript: 62, javascript: 80 },
  { year: 2024, typescript: 74, javascript: 82 },
  { year: 2026, typescript: 82, javascript: 84 },
];

/** Illustrative share of a fictional Node-team survey. */
export const stackShareMeta: ChartSeriesMeta = {
  name: "Stack share among Node teams (illustrative)",
  illustrative: true,
};

export const stackSharePoints: readonly StackShareBarPoint[] = [
  { stack: "Plain JS", share: 18 },
  { stack: "JS + JSDoc", share: 12 },
  { stack: "TypeScript", share: 58 },
  { stack: "Mixed / migrating", share: 12 },
];

export const timelineToneClass = (
  tone: TimelineTone | undefined,
): string | undefined => {
  if (!tone || tone === "default") return undefined;
  return `vd-timeline-${tone}`;
};
