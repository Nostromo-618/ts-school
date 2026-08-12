import { describe, expect, it } from "vitest";
import {
  SCHOOL_COMPARE_SUITE,
  scoreDiagnosticsHonesty,
  scoreInventLessonTrap,
  scoreJsPaneRefusal,
  scoreNarrowingProse,
  scoreProductRuntime,
  scoreSchoolCase,
  scoreStarterRoute,
  scoreToolXmlIntent,
  summarizeModelResults,
} from "@/ai/school-model-scorers";

describe("school model scorers", () => {
  it("passes grounded starter replies with markdown link", () => {
    const r = scoreStarterRoute(
      "Start with [Why types at all](/lessons/foundations/why-types).",
    );
    expect(r.pass).toBe(true);
  });

  it("fails starter replies that omit the markdown link", () => {
    const r = scoreStarterRoute("Start with Why types at all.");
    expect(r.pass).toBe(false);
  });

  it("fails invented Basic Types hedges", () => {
    const r = scoreStarterRoute(
      'Try "Basic Types" if they exist in the curriculum.',
    );
    expect(r.pass).toBe(false);
  });

  it("fails invent-lesson trap when fabricating a route", () => {
    const r = scoreInventLessonTrap(
      "Open /lessons/foundations/typescript-getting-started for TypeScript getting started.",
    );
    expect(r.pass).toBe(false);
  });

  it("fails invent trap soft-fail via installing-types near-miss", () => {
    const r = scoreInventLessonTrap(
      "I found Getting types for your dependencies at /lessons/node-migration/installing-types.",
    );
    expect(r.pass).toBe(false);
  });

  it("passes invent trap when redirecting to why-types", () => {
    const r = scoreInventLessonTrap(
      "No lesson titled that. Start with Why types at all instead.",
    );
    expect(r.pass).toBe(true);
  });

  it("scores tool XML intent", () => {
    expect(
      scoreToolXmlIntent(
        '<tool_call name="search_curriculum">{"query":"narrowing"}</tool_call>',
      ).pass,
    ).toBe(true);
    expect(scoreToolXmlIntent("Narrowing is in the types track.").pass).toBe(
      false,
    );
  });

  it("scores learner-visible narrowing prose", () => {
    expect(
      scoreNarrowingProse(
        "See truthiness narrowing in /lessons/types/truthiness-narrowing.",
      ).pass,
    ).toBe(true);
  });

  it("scores product runtime and JS pane refusal", () => {
    expect(
      scoreProductRuntime(
        "Ask runs fully in-browser via LiteRT WebGPU — no server LLM.",
      ).pass,
    ).toBe(true);
    expect(
      scoreJsPaneRefusal(
        "The JS pane is read-only; I cannot rewrite it. Use the TypeScript pane.",
      ).pass,
    ).toBe(true);
    expect(
      scoreJsPaneRefusal(
        "Here is the rewritten JavaScript pane code: const x=1",
      ).pass,
    ).toBe(false);
  });

  it("scores diagnostics honesty", () => {
    expect(
      scoreDiagnosticsHonesty("Those are a build-time snapshot, not live tsc.")
        .pass,
    ).toBe(true);
    expect(scoreDiagnosticsHonesty("This is live tsc running now.").pass).toBe(
      false,
    );
  });

  it("suite covers trust + tooling cases", () => {
    expect(SCHOOL_COMPARE_SUITE.map((c) => c.id)).toEqual([
      "starter-where-to-begin",
      "invent-getting-started",
      "tool-search-narrowing",
      "narrowing-prose",
      "product-ask-runtime",
      "js-pane-refusal",
      "diagnostics-honesty",
    ]);
  });

  it("summarizes fixture E2B better than bad E4B fixture on starter", () => {
    const e2b = summarizeModelResults("gemma-4-E2B-it-web", [
      {
        caseId: "starter-where-to-begin",
        ...scoreSchoolCase(
          SCHOOL_COMPARE_SUITE[0]!,
          "See [Why types](/lessons/foundations/why-types)",
        ),
        reply: "See [Why types](/lessons/foundations/why-types)",
      },
    ]);
    const bad = summarizeModelResults("gemma-4-E4B-it-web", [
      {
        caseId: "starter-where-to-begin",
        ...scoreSchoolCase(
          SCHOOL_COMPARE_SUITE[0]!,
          "Basic Types if they exist",
        ),
        reply: "Basic Types if they exist",
      },
    ]);
    expect(e2b.passRate).toBe(1);
    expect(bad.passRate).toBe(0);
  });
});
