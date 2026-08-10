/**
 * The curriculum data model.
 *
 * Everything the site knows about a lesson is declared here and authored as a
 * typed module under `lessons/`. Nav, routes, and the search index are derived
 * from that data (see `./index.ts` and `@/nav`), so this file — not a
 * hand-written page list — is where the shape of the product is decided.
 *
 * Two rules hold throughout:
 *
 * 1. Every code field is a plain string. Lesson code reaches the DOM through a
 *    text node in a `<textarea>` or `<pre>`, never as HTML, so the model
 *    deliberately offers no field that could carry markup.
 * 2. The diagnostic contract lives in `@/typecheck/types` and is imported, not
 *    restated. Lessons author `ExpectedDiagnostic`s; build-time Strada output
 *    produces `TsDiagnostic`s; the compiler-truth suite asserts the first
 *    predicts the second.
 */

import type { VdFlowchartDocument } from "@vanduo-oss/vd3-cbun/flowchart";
import type { ExpectedDiagnostic } from "@/typecheck/types";

/**
 * Difficulty tier. This is the site's pacing promise: a lesson's tier states
 * what the reader is assumed to know already, and the integrity suite enforces
 * that no lesson depends on a lesson of a higher tier.
 */
export type Tier = "beginner" | "intermediate" | "advanced";

/** Tiers in teaching order; also the tab order of the derived nav tree. */
export const TIERS = ["beginner", "intermediate", "advanced"] as const;

/**
 * The ten subject tracks. A track is a thematic column through the curriculum
 * and spans all three tiers; see `./tracks.ts` for titles and descriptions.
 */
export type TrackId =
  | "foundations"
  | "types"
  | "functions"
  | "structures"
  | "type-level"
  | "runtime-boundary"
  | "async"
  | "node-migration"
  | "tooling"
  | "testing";

/**
 * A lesson's stable identifier. Globally unique and lowercase kebab-case, so it
 * is used verbatim as the last segment of the lesson's URL. Both properties are
 * asserted by `tests/unit/curriculum.spec.ts` rather than encoded as a branded
 * type, which would force a cast into every lesson module for no extra safety.
 */
export type LessonId = string;

/** An inclusive 1-based line span the lesson wants the reader to look at. */
export interface LineRange {
  start: number;
  end: number;
}

/** One side of the dual pane: source text plus what to point at in it. */
export interface CodePane {
  /** Plain source text. Rendered into a text node; never interpreted as HTML. */
  code: string;
  /** Lines the lesson highlights, e.g. the one that goes wrong. */
  highlights: LineRange[];
  /** One line under the pane saying what the reader is looking at. */
  caption: string;
}

/**
 * The TypeScript pane. `expectedDiagnostics` does double duty: it renders during
 * the SSG prerender, so the page is meaningful before hydration and without
 * JavaScript, and it is what the compiler-truth suite asserts real `tsc` output
 * against.
 */
export interface TsCodePane extends CodePane {
  expectedDiagnostics: ExpectedDiagnostic[];
}

/** One option in a quiz question. */
export interface QuizChoice {
  id: string;
  text: string;
}

/** A single-answer multiple-choice question with instant feedback. */
export interface QuizQuestion {
  id: string;
  prompt: string;
  choices: QuizChoice[];
  /** The `QuizChoice.id` that is correct. */
  answerId: string;
  /** Shown after answering, right or wrong. */
  explanation: string;
}

/**
 * What the compiler-truth suite expects for the exercise solution.
 * `"no-errors"` means Strada must be silent; a list means it must report
 * those diagnostics. Learner pass/fail on the site is solution-match
 * (normalized text), not this assertion.
 */
export type ExerciseAssertion = "no-errors" | ExpectedDiagnostic[];

/** A hands-on task. Check passes when normalized editor text matches `solution`. */
export interface Exercise {
  prompt: string;
  /** Code the editor opens with. Plain text. */
  starter: string;
  /**
   * CI / compiler-truth expectation for `solution`. Not used by the Check
   * button — Check compares normalized editor text to `solution`.
   */
  assertion: ExerciseAssertion;
  hints?: string[];
  /** Revealed on request; Check compares normalized text to this string. */
  solution?: string;
}

/** An outward link, cited rather than paraphrased. */
export interface Reference {
  title: string;
  href: string;
  /** Why this link is worth following. */
  note?: string;
}

/**
 * A security consideration a lesson raises. Present mostly on the
 * runtime-boundary track, where types stop and untrusted input begins.
 */
export interface SecurityNote {
  title: string;
  body: string;
  severity: "info" | "caution" | "critical";
}

/** A subject track: a thematic column spanning all three tiers. */
export interface Track {
  id: TrackId;
  title: string;
  /** Phosphor icon name, without the `ph-` prefix. */
  icon: string;
  /** Position of the track in the curriculum map and the nav tree. */
  order: number;
  /** One sentence on what the track covers and who it is for. */
  description: string;
}

/**
 * One lesson: the JavaScript that breaks, the TypeScript that fixes it, and
 * everything the site needs to place, link, search, and check it.
 */
export interface Lesson {
  id: LessonId;
  title: string;
  tier: Tier;
  track: TrackId;
  /** Position within the track. Dense `1..n`, tier non-decreasing. */
  order: number;
  /** One or two sentences; shown on the curriculum map and in search results. */
  summary: string;
  /** Lessons the reader should have read first. Must form a DAG. */
  prerequisites: LessonId[];
  /** Extra search terms beyond the title and summary. */
  keywords: string[];
  /** The one-line statement of what goes wrong in JavaScript. */
  problem: string;
  /** Left pane: idiomatic JavaScript that is quietly broken. */
  js: CodePane;
  /** Right pane: the TypeScript that catches it, plus what the compiler says. */
  ts: TsCodePane;
  /** The takeaways, one bullet each. */
  insight: string[];
  security?: SecurityNote;
  /** Rendered by `VdFlowchart` — narrowing control flow, the tsc pipeline. */
  diagram?: VdFlowchartDocument;
  quiz?: QuizQuestion[];
  exercise?: Exercise;
  references?: Reference[];
}
