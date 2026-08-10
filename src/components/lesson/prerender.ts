/**
 * Fallback when generated diagnostics are missing: maps authored
 * `ExpectedDiagnostic`s onto the display shape used by `DiagnosticsList`.
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
