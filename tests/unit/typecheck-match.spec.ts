import { describe, expect, it } from "vitest";

import { formatDiagnosticMatch, matchesExpected } from "@/typecheck/match";
import type { ExpectedDiagnostic, TsDiagnostic } from "@/typecheck/types";

function diagnostic(
  overrides: Partial<TsDiagnostic> & Pick<TsDiagnostic, "code" | "line">,
): TsDiagnostic {
  return {
    category: "error",
    message: "something is wrong",
    column: 1,
    length: 1,
    ...overrides,
  };
}

describe("matchesExpected", () => {
  it("matches on code, line and message substring", () => {
    const actual = [
      diagnostic({
        code: 2322,
        line: 3,
        message: `Type 'string' is not assignable to type 'number'.`,
      }),
    ];
    const expected: ExpectedDiagnostic[] = [
      { code: 2322, line: 3, messageIncludes: "not assignable" },
    ];

    const result = matchesExpected(actual, expected);

    expect(result.matched).toBe(true);
    expect(result.unmet).toEqual([]);
    expect(result.unexpected).toEqual([]);
    expect(result.pairs).toEqual([
      { expected: expected[0], actual: actual[0] },
    ]);
  });

  it("ignores the message when a lesson does not pin one", () => {
    const result = matchesExpected(
      [diagnostic({ code: 7006, line: 1, message: "whatever the wording is" })],
      [{ code: 7006, line: 1 }],
    );

    expect(result.matched).toBe(true);
  });

  it("reports an expectation the compiler did not satisfy", () => {
    const expected: ExpectedDiagnostic[] = [
      { code: 2322, line: 3 },
      { code: 2345, line: 9 },
    ];

    const result = matchesExpected(
      [diagnostic({ code: 2322, line: 3 })],
      expected,
    );

    expect(result.matched).toBe(false);
    expect(result.unmet).toEqual([{ code: 2345, line: 9 }]);
    expect(result.unexpected).toEqual([]);
    expect(result.pairs).toHaveLength(1);
  });

  it("reports a diagnostic no expectation claimed", () => {
    const surprise = diagnostic({
      code: 7006,
      line: 5,
      column: 12,
      message: `Parameter 'value' implicitly has an 'any' type.`,
    });

    const result = matchesExpected([surprise], []);

    expect(result.matched).toBe(false);
    expect(result.unexpected).toEqual([surprise]);
  });

  it("fails a right code on the wrong line", () => {
    const result = matchesExpected(
      [diagnostic({ code: 2322, line: 4 })],
      [{ code: 2322, line: 3 }],
    );

    expect(result.matched).toBe(false);
    expect(result.unmet).toHaveLength(1);
    expect(result.unexpected).toHaveLength(1);
  });

  it("fails when the message substring is absent", () => {
    const result = matchesExpected(
      [diagnostic({ code: 2322, line: 1, message: "a different wording" })],
      [{ code: 2322, line: 1, messageIncludes: "not assignable" }],
    );

    expect(result.matched).toBe(false);
  });

  it("counts duplicates on one line instead of collapsing them", () => {
    const first = diagnostic({ code: 2322, line: 2, column: 5 });
    const second = diagnostic({ code: 2322, line: 2, column: 20 });

    const result = matchesExpected([first, second], [{ code: 2322, line: 2 }]);

    expect(result.matched).toBe(false);
    expect(result.pairs).toHaveLength(1);
    expect(result.unexpected).toEqual([second]);
  });

  it("lets the more specific expectation take its diagnostic", () => {
    const generic = diagnostic({
      code: 2322,
      line: 1,
      message: "first wording",
    });
    const specific = diagnostic({
      code: 2322,
      line: 1,
      message: "second wording",
    });

    // Authored loosest-first: without specificity ordering the bare
    // expectation would consume the diagnostic the pinned one needs.
    const result = matchesExpected(
      [generic, specific],
      [
        { code: 2322, line: 1 },
        { code: 2322, line: 1, messageIncludes: "second" },
      ],
    );

    expect(result.matched).toBe(true);
    expect(result.pairs[1].actual).toBe(specific);
  });

  it("matches nothing against nothing", () => {
    const result = matchesExpected([], []);

    expect(result.matched).toBe(true);
    expect(result.pairs).toEqual([]);
  });
});

describe("formatDiagnosticMatch", () => {
  it("summarises a match", () => {
    const result = matchesExpected(
      [diagnostic({ code: 2322, line: 1 })],
      [{ code: 2322, line: 1 }],
    );

    expect(formatDiagnosticMatch(result)).toBe(
      "all 1 expected diagnostics matched",
    );
  });

  it("names both sides of a mismatch", () => {
    const result = matchesExpected(
      [
        diagnostic({
          code: 7006,
          line: 5,
          column: 12,
          message: `Parameter 'value' implicitly has an 'any' type.`,
        }),
      ],
      [{ code: 2322, line: 3, messageIncludes: "not assignable" }],
    );

    const report = formatDiagnosticMatch(result);

    expect(report).toContain('TS2322 on line 3 including "not assignable"');
    expect(report).toContain(
      `TS7006 at 5:12 — Parameter 'value' implicitly has an 'any' type.`,
    );
  });

  it("prints only the first line of a message chain", () => {
    const result = matchesExpected(
      [diagnostic({ code: 2322, line: 1, message: "outer.\n  inner." })],
      [],
    );

    expect(formatDiagnosticMatch(result)).not.toContain("inner");
  });
});
