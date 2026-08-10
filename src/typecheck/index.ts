/**
 * The type-check contract's public surface for the app and curriculum.
 *
 * Browser code imports types + match helpers only. The Strada Compiler API
 * host lives in `./host` and is Node-only (diagnostic generator + CI truth).
 */

export type {
  ExpectedDiagnostic,
  TsDiagnostic,
  TsDiagnosticCategory,
  TypecheckOptions,
} from "./types";

export { formatDiagnosticMatch, matchesExpected } from "./match";
export type { DiagnosticMatch, DiagnosticPair } from "./match";

/** Normalize source for exercise solution-match checks. */
export function normalizeSource(code: string): string {
  return code.replace(/\r\n/g, "\n").trim();
}
