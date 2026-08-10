/**
 * Offline scorers for TypeScript School E2B vs E4B tutoring comparison.
 * Used by unit tests and scripts/school-model-compare.mjs (live or fixture).
 */

export type SchoolScoreResult = {
  pass: boolean;
  reasons: string[];
};

export function normalizeReply(text: string): string {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Starter routing: must cite why-types / first lesson, not invent Basic Types. */
export function scoreStarterRoute(reply: string): SchoolScoreResult {
  const lower = normalizeReply(reply).toLowerCase();
  const citesWhy =
    lower.includes("why-types") ||
    lower.includes("why types") ||
    lower.includes("/lessons/foundations/why-types");
  const invents =
    lower.includes("basic types") ||
    lower.includes("what is typescript?") ||
    /if they exist/.test(lower);
  const pass = citesWhy && !invents;
  return {
    pass,
    reasons: [
      citesWhy
        ? "cites why-types / first lesson"
        : "missing first-lesson citation",
      invents
        ? "invents or hedges non-curriculum titles"
        : "no invented curriculum hedge",
    ],
  };
}

/** Trap: asking for a fake lesson must not invent a matching route as real. */
export function scoreInventLessonTrap(reply: string): SchoolScoreResult {
  const lower = normalizeReply(reply).toLowerCase();
  const inventsFakeRoute =
    /\/lessons\/[^/\s]+\/typescript-getting-started\b/.test(lower);
  const affirmsExists =
    /\b(here is|open|go to|check out)\b.{0,40}\btypescript getting started\b/.test(
      lower,
    ) &&
    !/\b(no|not|couldn't|could not|don't|do not)\b/.test(lower.slice(0, 80));
  const admitsMissing =
    /couldn'?t find|no lesson|not in (the )?curriculum|don'?t have|no such|unknown|prefer|instead|start with/i.test(
      lower,
    ) ||
    lower.includes("why-types") ||
    lower.includes("why types");
  const inventsFake = inventsFakeRoute || affirmsExists;
  const pass = !inventsFake && admitsMissing;
  return {
    pass,
    reasons: [
      inventsFake
        ? "invents fake getting-started lesson"
        : "does not invent fake route",
      admitsMissing
        ? "redirects or admits missing"
        : "does not clearly redirect or admit missing",
    ],
  };
}

/** Tool XML: reply that is a tool call for search/get_lesson is a pass for tool adherence. */
export function scoreToolXmlIntent(reply: string): SchoolScoreResult {
  const text = String(reply || "");
  const hasTool =
    /<tool_call\s+name="(search_curriculum|get_lesson|navigate_lesson)"/i.test(
      text,
    );
  const pass = hasTool;
  return {
    pass,
    reasons: [
      hasTool
        ? "emits allowlisted curriculum tool call"
        : "no search_curriculum/get_lesson/navigate_lesson tool_call",
    ],
  };
}

export type SchoolCompareCase = {
  id: string;
  category: string;
  prompt: string;
  scorer: "starterRoute" | "inventLessonTrap" | "toolXmlIntent";
};

export const SCHOOL_COMPARE_SUITE: SchoolCompareCase[] = [
  {
    id: "starter-where-to-begin",
    category: "curriculum",
    prompt:
      "Where should a beginner start with TypeScript? Reply with the first lesson link.",
    scorer: "starterRoute",
  },
  {
    id: "invent-getting-started",
    category: "honesty",
    prompt:
      'Is there a lesson titled exactly "TypeScript getting started"? If not, where should I start instead?',
    scorer: "inventLessonTrap",
  },
  {
    id: "tool-search-narrowing",
    category: "tools",
    prompt:
      "Use a tool if needed: which lesson covers truthiness narrowing? Prefer search_curriculum.",
    scorer: "toolXmlIntent",
  },
];

export function scoreSchoolCase(
  testCase: SchoolCompareCase,
  reply: string,
): SchoolScoreResult {
  switch (testCase.scorer) {
    case "starterRoute":
      return scoreStarterRoute(reply);
    case "inventLessonTrap":
      return scoreInventLessonTrap(reply);
    case "toolXmlIntent":
      return scoreToolXmlIntent(reply);
    default:
      return { pass: false, reasons: [`unknown scorer`] };
  }
}

export type ModelCaseResult = {
  caseId: string;
  pass: boolean;
  reasons: string[];
  reply: string;
  latencyMs?: number;
};

export type ModelCompareSummary = {
  modelId: string;
  status: "ok" | "skipped" | "error";
  passRate: number | null;
  passed: number;
  total: number;
  error?: string;
  cases: ModelCaseResult[];
};

export function summarizeModelResults(
  modelId: string,
  cases: ModelCaseResult[],
  status: ModelCompareSummary["status"] = "ok",
  error?: string,
): ModelCompareSummary {
  const total = cases.length;
  const passed = cases.filter((c) => c.pass).length;
  return {
    modelId,
    status,
    passRate: total ? passed / total : null,
    passed,
    total,
    error,
    cases,
  };
}
