/**
 * Milestone and chart data for `/history`.
 *
 * Chart series are measured public metrics with citation metadata — not market
 * share estimates. Prefer incomplete but honest axes over invented curves.
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
  era: "javascript" | "node" | "typescript" | "runtime" | "checker";
}

export interface HistoryCitation {
  /** Short source name shown under charts / in footnotes. */
  label: string;
  url: string;
  /** Survey or publication year/label when known. */
  published?: string;
  /** ISO date this repo last verified the figure from the URL. */
  accessed: string;
}

export interface ChartSeriesMeta {
  /** Visible chart title. */
  name: string;
  /** One-line caption under the title. */
  caption: string;
  /** Axis labels for the chart component. */
  xLabel: string;
  yLabel: string;
  /** Accessible chart title / description seeds. */
  a11yTitle: string;
  a11yDescription: string;
  citations: readonly HistoryCitation[];
  /** Optional honesty note (sparse series, cohort caveats, etc.). */
  notes?: string;
}

/** npm `typescript` package downloads for a fixed calendar week. */
export interface NpmWeeklyPoint {
  year: number;
  /** Exact downloads for the 7-day window starting at `weekStart`. */
  downloads: number;
  /** ISO date of the first day in the sampled week (YYYY-MM-DD). */
  weekStart: string;
}

/** Stack Overflow “used extensively in the past year” language shares. */
export interface SoLanguagePoint {
  year: number;
  /** % of all respondents. */
  typescript: number;
  /** % of all respondents. */
  javascript: number;
}

/** Collapsed State of JS JS/TS time-split buckets. */
export interface TsBalanceBarPoint {
  bucket: string;
  /** % of question respondents. */
  percent: number;
}

/** State of JS runtime “regularly use” shares. */
export interface RuntimeBarPoint {
  runtime: string;
  /** % of question respondents. */
  percent: number;
}

/** GitHub Octoverse language YoY contributor growth. */
export interface OctoverseGrowthPoint {
  language: string;
  /** Year-over-year % growth in contributors (Aug 2024 → Aug 2025). */
  yoyPercent: number;
}

export const HISTORY_DATA_INTRO =
  "Charts below use public survey and registry metrics — npm download counts, Stack Overflow and State of JS respondent shares, and GitHub Octoverse contributor growth. They are not market-share estimates.";

const ACCESSED = "2026-08-10";

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
    id: "deno-1",
    date: "2020",
    sortKey: 2020.2,
    title: "Deno 1.0",
    body: "Ryan Dahl's second runtime ships with secure-by-default permissions and first-class TypeScript execution (transpile at the edge; type-check still opt-in).",
    era: "runtime",
    tone: "success",
  },
  {
    id: "typescript-4",
    date: "2020",
    sortKey: 2020.4,
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
    id: "bun-1",
    date: "2023",
    sortKey: 2023.7,
    title: "Bun 1.0",
    body: "A Zig/JavaScriptCore runtime aiming to be a drop-in Node alternative with a built-in bundler, test runner, package manager, and zero-config TypeScript/JSX.",
    era: "runtime",
    tone: "success",
  },
  {
    id: "node-strip-types",
    date: "2024",
    sortKey: 2024.6,
    title: "Node.js type stripping arrives",
    body: "Node 22.6 adds --experimental-strip-types: run erasable TypeScript by replacing type syntax with whitespace. Still not a type checker — tsc remains for errors.",
    era: "node",
    tone: "success",
  },
  {
    id: "typescript-6",
    date: "2025",
    sortKey: 2025,
    title: "TypeScript 6 — last Strada (JS) compiler line",
    body: "TypeScript 6.0.3 is the last JavaScript-hosted compiler with a full programmatic createProgram API. Tools that embed the checker still need it.",
    era: "typescript",
    tone: "success",
  },
  {
    id: "node-strip-stable",
    date: "2025",
    sortKey: 2025.2,
    title: "Node type stripping goes stable",
    body: "By Node 23.6 / 22.18 stripping is on by default for erasable syntax; Node 25.2 / 24.12 mark it Stability 2. Enums and other emit-heavy features still need a transformer or separate build.",
    era: "node",
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
    id: "bun-anthropic",
    date: "2025",
    sortKey: 2025.9,
    title: "Bun joins Anthropic",
    body: "Anthropic acquires Bun and keeps it open source, betting on the runtime as infrastructure for AI coding products — while Bun keeps shipping Node-compatibility and TypeScript DX.",
    era: "runtime",
  },
  {
    id: "checker-pin",
    date: "today",
    sortKey: 2026,
    title: "This school's checker: dual install",
    body: "typescript@7 is the primary package (native CLI / tooling). typescript-strada@6.0.3 generates lesson diagnostics at build time and powers the compiler-truth suite. The browser never ships a compiler.",
    era: "checker",
    tone: "success",
  },
];

/**
 * npm downloads for `typescript` during the calendar week starting July 1
 * each year (npm Downloads API range sums). Values are exact package
 * download counts for that 7-day window — CI mirrors and bots inflate the
 * absolute magnitude, so read the slope, not “users.”
 */
export const npmWeeklyMeta: ChartSeriesMeta = {
  name: "npm — typescript weekly downloads",
  caption:
    "Weekly downloads of the typescript package (week of July 1 each year). Absolute volume includes CI; the trend still tracks how often the checker lands in install graphs.",
  xLabel: "Year",
  yLabel: "Downloads (millions)",
  a11yTitle: "npm weekly downloads of the typescript package by year",
  a11yDescription:
    "Line chart of typescript package weekly downloads in millions for the week starting July 1, from 2019 through 2026.",
  citations: [
    {
      label: "npm Downloads API",
      url: "https://api.npmjs.org/downloads/range/2019-07-01:2026-07-07/typescript",
      published: "2019–2026",
      accessed: ACCESSED,
    },
    {
      label: "typescript on npm",
      url: "https://www.npmjs.com/package/typescript",
      accessed: ACCESSED,
    },
  ],
  notes:
    "Sampled as the 7 days starting 1 July each year. 2026 is a partial year overall, but that July week is complete.",
};

export const npmWeeklyPoints: readonly NpmWeeklyPoint[] = [
  { year: 2019, downloads: 5_694_392, weekStart: "2019-07-01" },
  { year: 2020, downloads: 11_764_713, weekStart: "2020-07-01" },
  { year: 2021, downloads: 19_731_719, weekStart: "2021-07-01" },
  { year: 2022, downloads: 29_545_126, weekStart: "2022-07-01" },
  { year: 2023, downloads: 39_216_859, weekStart: "2023-07-01" },
  { year: 2024, downloads: 51_370_714, weekStart: "2024-07-01" },
  { year: 2025, downloads: 87_018_944, weekStart: "2025-07-01" },
  { year: 2026, downloads: 213_828_395, weekStart: "2026-07-01" },
];

/**
 * Stack Overflow Developer Survey — programming languages used extensively
 * in the past year, among **all respondents** (not professional-only).
 */
export const soLanguageMeta: ChartSeriesMeta = {
  name: "Stack Overflow — JS & TypeScript",
  caption:
    "Share of all respondents who did extensive work in JavaScript or TypeScript in the past year. Professional-only cohorts run higher (e.g. TypeScript 48.8% in 2025).",
  xLabel: "Survey year",
  yLabel: "% of respondents",
  a11yTitle: "Stack Overflow survey JavaScript and TypeScript usage by year",
  a11yDescription:
    "Line chart of the percentage of all Stack Overflow survey respondents who reported extensive JavaScript or TypeScript use, 2022 through 2025.",
  citations: [
    {
      label: "SO Developer Survey 2025 (Technology)",
      url: "https://survey.stackoverflow.co/2025/technology/",
      published: "2025",
      accessed: ACCESSED,
    },
    {
      label: "SO Developer Survey 2024 (Technology)",
      url: "https://survey.stackoverflow.co/2024/technology/",
      published: "2024",
      accessed: ACCESSED,
    },
    {
      label: "devclass summary of SO 2023",
      url: "https://www.devclass.com/development/2023/06/13/postgresql-now-top-developer-choice-ahead-of-mysql-according-to-massive-new-survey/1623015",
      published: "2023",
      accessed: ACCESSED,
    },
    {
      label: "Visual Studio Magazine on SO 2022",
      url: "https://visualstudiomagazine.com/articles/2022/06/28/typescript-so.aspx",
      published: "2022",
      accessed: ACCESSED,
    },
  ],
  notes:
    "2022–2023 figures for all respondents are taken from contemporary write-ups of the official survey; 2024–2025 figures are read from the survey Technology pages (All Respondents tab).",
};

export const soLanguagePoints: readonly SoLanguagePoint[] = [
  { year: 2022, javascript: 65.36, typescript: 34.83 },
  { year: 2023, javascript: 63.61, typescript: 38.87 },
  { year: 2024, javascript: 62.3, typescript: 38.5 },
  { year: 2025, javascript: 66.0, typescript: 43.6 },
];

/**
 * State of JS 2024 — how respondents divide coding time between JS and TS.
 * Buckets collapsed from the nine-step slider counts on the Usage page.
 */
export const tsBalanceMeta: ChartSeriesMeta = {
  name: "State of JS 2024 — JS/TS balance",
  caption:
    "Collapsed from the survey’s time-split question (11,435 answers). The survey’s own headline: 67% write more TypeScript than JavaScript; the single largest group writes only TypeScript.",
  xLabel: "JS vs TypeScript split",
  yLabel: "% of respondents",
  a11yTitle: "State of JS 2024 JavaScript versus TypeScript coding balance",
  a11yDescription:
    "Bar chart of collapsed State of JS 2024 buckets for how much TypeScript versus JavaScript respondents write.",
  citations: [
    {
      label: "State of JS 2024 — Usage",
      url: "https://2024.stateofjs.com/en-US/usage/",
      published: "2024",
      accessed: ACCESSED,
    },
  ],
  notes:
    "Bucket % = raw slider counts ÷ 11,435. “Mostly JS” and “Mostly TS” each merge three intermediate slider steps.",
};

export const tsBalancePoints: readonly TsBalanceBarPoint[] = [
  { bucket: "0% TS", percent: 8.0 },
  { bucket: "Mostly JS", percent: 10.4 },
  { bucket: "~50 / 50", percent: 5.5 },
  { bucket: "Mostly TS", percent: 41.7 },
  { bucket: "100% TS", percent: 34.4 },
];

/**
 * State of JS 2024 — engines/runtimes regularly used (multi-select).
 */
export const runtimeUsageMeta: ChartSeriesMeta = {
  name: "State of JS 2024 — runtimes",
  caption:
    "Among 11,576 answers to “which engines/runtimes do you regularly use?” Node still dominates; Bun outpaces Deno in this JS-focused sample.",
  xLabel: "Runtime",
  yLabel: "% of respondents",
  a11yTitle: "State of JS 2024 runtime usage shares",
  a11yDescription:
    "Bar chart of State of JS 2024 regular usage percentages for Node.js, browsers, Bun, and Deno.",
  citations: [
    {
      label: "State of JS 2024 — Other Tools (runtimes)",
      url: "https://2024.stateofjs.com/en-US/other-tools/",
      published: "2024",
      accessed: ACCESSED,
    },
  ],
};

export const runtimeUsagePoints: readonly RuntimeBarPoint[] = [
  { runtime: "Node.js", percent: 90.8 },
  { runtime: "Browser", percent: 83.2 },
  { runtime: "Bun", percent: 16.4 },
  { runtime: "Deno", percent: 11.8 },
];

/**
 * GitHub Octoverse 2025 — YoY contributor growth by language
 * (August 2024 vs August 2025). Rank #1 by usage that August was TypeScript.
 */
export const octoverseGrowthMeta: ChartSeriesMeta = {
  name: "Octoverse 2025 — YoY contributor growth",
  caption:
    "In August 2025 TypeScript became GitHub’s most-used language by contributor count, overtaking Python and JavaScript. Bars show year-over-year % growth, not absolute share.",
  xLabel: "Language",
  yLabel: "YoY growth (%)",
  a11yTitle:
    "GitHub Octoverse 2025 year-over-year contributor growth by language",
  a11yDescription:
    "Bar chart of year-over-year contributor growth percentages for TypeScript, Python, and JavaScript from GitHub Octoverse 2025.",
  citations: [
    {
      label: "GitHub Octoverse 2025",
      url: "https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/",
      published: "2025",
      accessed: ACCESSED,
    },
  ],
  notes:
    "Octoverse ranks by GitHub contributor counts for a language; other indices (TIOBE, SO, JetBrains) use different methodologies and may still rank JavaScript or Python higher.",
};

export const octoverseGrowthPoints: readonly OctoverseGrowthPoint[] = [
  { language: "TypeScript", yoyPercent: 66.63 },
  { language: "Python", yoyPercent: 48.78 },
  { language: "JavaScript", yoyPercent: 24.79 },
];

/** Supporting prose citations (Deno / Bun / Node sections). */
export const runtimeStoryCitations = {
  nodeTypescript: {
    label: "Node.js docs — Modules: TypeScript",
    url: "https://nodejs.org/api/typescript.html",
    published: "v26 docs",
    accessed: ACCESSED,
  },
  nodeLearn: {
    label: "Node.js Learn — Running TypeScript natively",
    url: "https://nodejs.org/learn/typescript/run-natively",
    accessed: ACCESSED,
  },
  denoBlog: {
    label: "Deno blog",
    url: "https://deno.com/blog",
    accessed: ACCESSED,
  },
  deno29: {
    label: "Deno 2.9 release",
    url: "https://deno.com/blog/v2.9",
    published: "2026-06",
    accessed: ACCESSED,
  },
  bunBlog: {
    label: "Bun blog",
    url: "https://bun.com/blog",
    accessed: ACCESSED,
  },
  bunAnthropic: {
    label: "Bun is joining Anthropic",
    url: "https://bun.com/blog/bun-joins-anthropic",
    published: "2025-12",
    accessed: ACCESSED,
  },
  jetbrains2024: {
    label: "JetBrains Developer Ecosystem 2024",
    url: "https://www.jetbrains.com/lp/devecosystem-2024/",
    published: "2024",
    accessed: ACCESSED,
  },
} as const satisfies Record<string, HistoryCitation>;

export const timelineToneClass = (
  tone: TimelineTone | undefined,
): string | undefined => {
  if (!tone || tone === "default") return undefined;
  return `vd-timeline-${tone}`;
};

/** Format a citation line for figure footnotes. */
export const formatCitation = (c: HistoryCitation): string => {
  const when = c.published ? ` (${c.published})` : "";
  return `${c.label}${when}; accessed ${c.accessed}`;
};
