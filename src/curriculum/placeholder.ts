/**
 * Stub code panes for lessons whose body has not been written yet.
 *
 * The taxonomy lands well before the prose does: every topic is registered,
 * tiered, ordered, and routed while its two code panes are still empty. Rather
 * than weaken `Lesson` with optional panes — which would push a `?.` into every
 * consumer forever — a stubbed lesson carries a real `CodePane` whose code is a
 * single marked comment.
 *
 * `isPlaceholder()` is the seam that makes that honest. The lesson page uses it
 * to say "not written yet" instead of rendering the marker as if it were
 * content, and the compiler-truth suite uses it to check authored panes only —
 * so an unwritten lesson never fails CI, and the moment a pane is authored it
 * starts being checked.
 */

import type { CodePane, TsCodePane } from "./types";

/**
 * The marker that identifies an unwritten pane. Deliberately a comment, so a
 * placeholder pane is still syntactically valid input to the compiler.
 */
export const PLACEHOLDER_MARKER = "// TODO(content):";

const placeholderCode = (language: "JavaScript" | "TypeScript"): string =>
  `${PLACEHOLDER_MARKER} the ${language} pane for this lesson is not written yet.\n`;

/** The left pane of a stubbed lesson. */
export const placeholderJsPane = (): CodePane => ({
  code: placeholderCode("JavaScript"),
  highlights: [],
  caption: "JavaScript example — not written yet.",
});

/**
 * The right pane of a stubbed lesson. `expectedDiagnostics` is empty because a
 * lone comment genuinely produces none: the stub claims nothing it cannot back
 * up, which is the same standard the authored lessons are held to.
 */
export const placeholderTsPane = (): TsCodePane => ({
  code: placeholderCode("TypeScript"),
  highlights: [],
  caption: "TypeScript example — not written yet.",
  expectedDiagnostics: [],
});

/** Whether a pane is still a stub rather than authored content. */
export const isPlaceholder = (pane: CodePane): boolean =>
  pane.code.includes(PLACEHOLDER_MARKER);
