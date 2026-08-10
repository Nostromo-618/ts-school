/**
 * Shared diagnostic contract.
 *
 * Lessons author `ExpectedDiagnostic`s; the build-time generator (Strada
 * Compiler API via `typescript-strada`) produces full `TsDiagnostic`s into
 * `src/curriculum/generated/diagnostics.ts`. The compiler-truth suite asserts
 * expectations match real Strada output.
 */

export type TsDiagnosticCategory =
  "error" | "warning" | "suggestion" | "message";

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
