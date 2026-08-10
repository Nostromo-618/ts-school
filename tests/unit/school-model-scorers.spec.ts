import { describe, expect, it } from "vitest";
import {
  SCHOOL_COMPARE_SUITE,
  scoreInventLessonTrap,
  scoreSchoolCase,
  scoreStarterRoute,
  scoreToolXmlIntent,
  summarizeModelResults,
} from "@/ai/school-model-scorers";

describe("school model scorers", () => {
  it("passes grounded starter replies", () => {
    const r = scoreStarterRoute(
      "Start with [Why types at all](/lessons/foundations/why-types).",
    );
    expect(r.pass).toBe(true);
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

  it("passes invent trap when redirecting to why-types", () => {
    const r = scoreInventLessonTrap(
      'No lesson titled that. Start with Why types at all instead.',
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

  it("suite covers starter, invent, and tools", () => {
    expect(SCHOOL_COMPARE_SUITE.map((c) => c.id)).toEqual([
      "starter-where-to-begin",
      "invent-getting-started",
      "tool-search-narrowing",
    ]);
  });

  it("summarizes fixture E2B better than bad E4B fixture on starter", () => {
    const e2b = summarizeModelResults("gemma-4-E2B-it-web", [
      {
        caseId: "starter-where-to-begin",
        ...scoreSchoolCase(SCHOOL_COMPARE_SUITE[0]!, "See why-types"),
        reply: "See why-types",
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
