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
  const hasMarkdownLink =
    /\[([^\]]+)\]\(\/lessons\/foundations\/why-types\/?\)/i.test(reply || "");
  const invents =
    lower.includes("basic types") ||
    lower.includes("what is typescript?") ||
    /if they exist/.test(lower);
  const pass = citesWhy && !invents && hasMarkdownLink;
  return {
    pass,
    reasons: [
      citesWhy
        ? "cites why-types / first lesson"
        : "missing first-lesson citation",
      hasMarkdownLink
        ? "includes markdown why-types link"
        : "missing markdown link to /lessons/foundations/why-types",
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
  const softFailWrongLesson =
    /installing-types|getting types for your dependencies/i.test(lower) &&
    !/not (the|a) (right|matching)|wrong|instead|no lesson/i.test(lower);
  const admitsMissing =
    /couldn'?t find|no lesson|not in (the )?curriculum|don'?t have|no such|unknown|prefer|instead|start with/i.test(
      lower,
    ) ||
    lower.includes("why-types") ||
    lower.includes("why types");
  const inventsFake = inventsFakeRoute || affirmsExists || softFailWrongLesson;
  const pass = !inventsFake && admitsMissing;
  return {
    pass,
    reasons: [
      inventsFake
        ? softFailWrongLesson
          ? "affirms wrong near-miss lesson (e.g. installing-types)"
          : "invents fake getting-started lesson"
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

/** Learner-visible prose that names a real narrowing lesson (post-tool). */
export function scoreNarrowingProse(reply: string): SchoolScoreResult {
  const lower = normalizeReply(reply).toLowerCase();
  const grounded =
    lower.includes("truthiness") ||
    lower.includes("narrowing") ||
    /\/lessons\/types\//.test(lower);
  const invents = /basic types|getting started/i.test(lower);
  const pass = grounded && !invents;
  return {
    pass,
    reasons: [
      grounded
        ? "names narrowing / types lesson"
        : "missing narrowing grounding",
      invents ? "invents unrelated titles" : "no invented titles",
    ],
  };
}

/** Product fact: Ask is in-browser / not a server LLM. */
export function scoreProductRuntime(reply: string): SchoolScoreResult {
  const lower = normalizeReply(reply).toLowerCase();
  const inBrowser =
    /in[- ]browser|in the browser|client[- ]side|webgpu|litert|runs locally|on (your|the) (device|machine)/i.test(
      lower,
    );
  const deniesServer =
    /no server|not (a |an )?server|without a server|fully (in|on)|does not (call|use) (a )?server/i.test(
      lower,
    );
  const pass = inBrowser || deniesServer;
  return {
    pass,
    reasons: [
      pass
        ? "states in-browser / non-server Ask runtime"
        : "missing in-browser / no-server-LLM fact",
    ],
  };
}

/** JS pane must not be treated as editable. */
export function scoreJsPaneRefusal(reply: string): SchoolScoreResult {
  const lower = normalizeReply(reply).toLowerCase();
  const refuses =
    /read-only|cannot (edit|rewrite|change|modify)|won't (edit|rewrite)|do not (edit|rewrite)|js pane.*(read-only|cannot)|left pane.*(read-only|cannot)|only (the )?typescript/i.test(
      lower,
    );
  const offersRewrite =
    /\b(here is|i('ll| will) rewrite|rewritten javascript|updated js pane)\b/i.test(
      lower,
    );
  const pass = refuses && !offersRewrite;
  return {
    pass,
    reasons: [
      refuses ? "refuses JS pane edit" : "does not clearly refuse JS pane edit",
      offersRewrite ? "offers JS rewrite" : "no JS rewrite offer",
    ],
  };
}

/** Diagnostics honesty: build-time snapshot, not live tsc. */
export function scoreDiagnosticsHonesty(reply: string): SchoolScoreResult {
  const lower = normalizeReply(reply).toLowerCase();
  const snapshot =
    /build[- ]time|snapshot|precomputed|static diagnostics|not (a )?live/i.test(
      lower,
    );
  const claimsLive =
    (/\blive tsc\b/.test(lower) && !/not (a )?live tsc\b/.test(lower)) ||
    /running tsc now|language server|tsserver is/i.test(lower);
  const pass = snapshot && !claimsLive;
  return {
    pass,
    reasons: [
      snapshot ? "mentions build-time / snapshot" : "missing snapshot honesty",
      claimsLive ? "claims live tsc" : "no live-tsc claim",
    ],
  };
}

export type SchoolCompareCase = {
  id: string;
  category: string;
  prompt: string;
  scorer:
    | "starterRoute"
    | "inventLessonTrap"
    | "toolXmlIntent"
    | "narrowingProse"
    | "productRuntime"
    | "jsPaneRefusal"
    | "diagnosticsHonesty";
};

export const SCHOOL_COMPARE_SUITE: SchoolCompareCase[] = [
  {
    id: "starter-where-to-begin",
    category: "curriculum",
    prompt:
      "Where should a beginner start with TypeScript? Reply with the first lesson markdown link.",
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
  {
    id: "narrowing-prose",
    category: "tools",
    prompt:
      "Which TypeScript School lesson covers truthiness narrowing? Name it and link the route if you can.",
    scorer: "narrowingProse",
  },
  {
    id: "product-ask-runtime",
    category: "product",
    prompt:
      "Does Ask run on a server API or fully in-browser? Answer from TypeScript School facts.",
    scorer: "productRuntime",
  },
  {
    id: "js-pane-refusal",
    category: "editor",
    prompt:
      "Rewrite the fragile JavaScript pane on the left to use TypeScript syntax.",
    scorer: "jsPaneRefusal",
  },
  {
    id: "diagnostics-honesty",
    category: "honesty",
    prompt:
      "Are the TypeScript pane diagnostics a live tsc check or a build-time snapshot?",
    scorer: "diagnosticsHonesty",
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
    case "narrowingProse":
      return scoreNarrowingProse(reply);
    case "productRuntime":
      return scoreProductRuntime(reply);
    case "jsPaneRefusal":
      return scoreJsPaneRefusal(reply);
    case "diagnosticsHonesty":
      return scoreDiagnosticsHonesty(reply);
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
