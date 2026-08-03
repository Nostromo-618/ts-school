/**
 * Compares what the compiler actually said against what a lesson claims it
 * will say.
 *
 * Two callers depend on this: the compiler-truth suite, which fails CI when a
 * lesson promises a diagnostic TypeScript does not produce, and the exercise
 * validator, which decides whether a learner's attempt passes. Both need to
 * render a useful message when it does not match, so the result is a structured
 * comparison rather than a boolean.
 */

import type { ExpectedDiagnostic, TsDiagnostic } from "./types";

export interface DiagnosticPair {
  expected: ExpectedDiagnostic;
  actual: TsDiagnostic;
}

export interface DiagnosticMatch {
  /** True when every expectation was met and nothing else was reported. */
  matched: boolean;
  /** Expectations that found a diagnostic, in authoring order. */
  pairs: DiagnosticPair[];
  /** Expectations the compiler did not satisfy, in authoring order. */
  unmet: ExpectedDiagnostic[];
  /** Diagnostics no expectation claimed, in source order. */
  unexpected: TsDiagnostic[];
}

function satisfies(
  expected: ExpectedDiagnostic,
  actual: TsDiagnostic,
): boolean {
  return (
    expected.code === actual.code &&
    expected.line === actual.line &&
    (expected.messageIncludes === undefined ||
      actual.message.includes(expected.messageIncludes))
  );
}

/**
 * Each actual diagnostic is consumed by at most one expectation, so two errors
 * on one line are not both satisfied by a single claim.
 *
 * Expectations that pin a message substring are matched first: they are the
 * more specific claim, and letting a looser expectation take their diagnostic
 * would report a spurious mismatch.
 */
export function matchesExpected(
  actual: readonly TsDiagnostic[],
  expected: readonly ExpectedDiagnostic[],
): DiagnosticMatch {
  const claimed = new Array<boolean>(actual.length).fill(false);
  const pairedActual = new Array<TsDiagnostic | undefined>(expected.length);

  const bySpecificity = expected
    .map((expectation, index) => ({ expectation, index }))
    .sort(
      (a, b) =>
        Number(b.expectation.messageIncludes !== undefined) -
        Number(a.expectation.messageIncludes !== undefined),
    );

  for (const { expectation, index } of bySpecificity) {
    const found = actual.findIndex(
      (candidate, at) => !claimed[at] && satisfies(expectation, candidate),
    );
    if (found === -1) continue;
    claimed[found] = true;
    pairedActual[index] = actual[found];
  }

  const pairs: DiagnosticPair[] = [];
  const unmet: ExpectedDiagnostic[] = [];
  expected.forEach((expectation, index) => {
    const match = pairedActual[index];
    if (match) pairs.push({ expected: expectation, actual: match });
    else unmet.push(expectation);
  });

  const unexpected = actual.filter((_, index) => !claimed[index]);

  return {
    matched: unmet.length === 0 && unexpected.length === 0,
    pairs,
    unmet,
    unexpected,
  };
}

function describeExpected(expected: ExpectedDiagnostic): string {
  const message =
    expected.messageIncludes === undefined
      ? ""
      : ` including ${JSON.stringify(expected.messageIncludes)}`;
  return `TS${expected.code} on line ${expected.line}${message}`;
}

function describeActual(actual: TsDiagnostic): string {
  const firstLine = actual.message.split("\n")[0];
  return `TS${actual.code} at ${actual.line}:${actual.column} — ${firstLine}`;
}

/**
 * A failure message a human can act on. Test suites print this; it is the
 * difference between "expected true, got false" and knowing which lesson line
 * drifted.
 */
export function formatDiagnosticMatch(result: DiagnosticMatch): string {
  if (result.matched) {
    return `all ${result.pairs.length} expected diagnostics matched`;
  }

  const lines: string[] = [];
  if (result.unmet.length > 0) {
    lines.push("expected but not reported by the compiler:");
    for (const expectation of result.unmet) {
      lines.push(`  - ${describeExpected(expectation)}`);
    }
  }
  if (result.unexpected.length > 0) {
    lines.push("reported by the compiler but not expected:");
    for (const diagnostic of result.unexpected) {
      lines.push(`  - ${describeActual(diagnostic)}`);
    }
  }
  return lines.join("\n");
}
