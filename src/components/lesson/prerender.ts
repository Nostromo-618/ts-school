/**
 * Maps authored `ExpectedDiagnostic`s onto the display shape used by
 * `DiagnosticsList` so SSG pages are meaningful before the worker answers.
 *
 * Expectations only pin `code`, `line`, and an optional message substring —
 * column / length / full message are unknown until the live checker runs —
 * so the fallback fills conservative defaults that the worker will replace.
 */

import type { ExpectedDiagnostic, TsDiagnostic } from "@/typecheck";

export function toPrerenderedDiagnostics(
  expected: readonly ExpectedDiagnostic[],
): TsDiagnostic[] {
  return expected.map((entry) => ({
    code: entry.code,
    category: "error" as const,
    message: entry.messageIncludes ?? `TS${entry.code}`,
    line: entry.line,
    column: 1,
    length: 0,
  }));
}
