/**
 * Shared diagnostic contract.
 *
 * Two independent subsystems meet here: the in-browser typecheck worker
 * (`src/typecheck/`) produces `TsDiagnostic`s, and lesson data
 * (`src/curriculum/`) authors `ExpectedDiagnostic`s. The compiler-truth test
 * suite asserts the second predicts the first. Keeping the contract in one
 * dependency-free module lets both sides evolve without importing each other.
 */

export type TsDiagnosticCategory =
  | "error"
  | "warning"
  | "suggestion"
  | "message";

/** A diagnostic as reported by the compiler, normalized for display. */
export interface TsDiagnostic {
  /** TypeScript error code, e.g. 2322 for "Type X is not assignable to Y". */
  code: number;
  category: TsDiagnosticCategory;
  /** Message chain flattened to a single string. */
  message: string;
  /** 1-based, to match what the editor gutter shows the learner. */
  line: number;
  /** 1-based. */
  column: number;
  /** Span width in characters; 0 when the compiler reports no span. */
  length: number;
}

/**
 * A diagnostic a lesson claims TypeScript will report.
 *
 * `messageIncludes` is a substring rather than an exact match so that upstream
 * rewording of a compiler message does not fail the build over prose.
 */
export interface ExpectedDiagnostic {
  code: number;
  line: number;
  messageIncludes?: string;
}

/** Compiler options a lesson may vary; the rest are fixed by the host. */
export interface TypecheckOptions {
  /** Defaults to the project's strict baseline. */
  strict?: boolean;
  /** Extra `lib.*.d.ts` names, e.g. "dom" for a browser-flavoured lesson. */
  libs?: string[];
}

export interface TypecheckRequest {
  /** Correlates responses to requests so stale results can be discarded. */
  requestId: number;
  code: string;
  options?: TypecheckOptions;
}

export interface TypecheckResponse {
  requestId: number;
  diagnostics: TsDiagnostic[];
  /** Wall-clock time inside the worker, surfaced for the perf budget test. */
  durationMs: number;
}

export interface TypecheckErrorResponse {
  requestId: number;
  error: string;
}
