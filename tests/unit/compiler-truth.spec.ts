/**
 * Compiler-truth suite.
 *
 * Runs the Strada Compiler API (typescript-strada@6.0.3) over every authored
 * lesson pane and asserts `expectedDiagnostics` match what the compiler reports.
 * Also asserts generated diagnostics stay in sync with live Strada output.
 */

import { describe, expect, it } from "vitest";
import * as ts from "typescript-strada";

import { allLessons, isPlaceholder } from "@/curriculum";
import {
  LESSON_DIAGNOSTICS,
  STRADA_COMPILER_VERSION,
} from "@/curriculum/generated/diagnostics";
import { formatDiagnosticMatch, matchesExpected } from "@/typecheck";
import {
  BASELINE_LIB,
  createTypecheckSession,
} from "@/typecheck/host";
import { loadStradaLibsForTests } from "../helpers/strada-libs";

const session = createTypecheckSession({
  ts,
  libs: loadStradaLibsForTests([BASELINE_LIB]),
});

const authored = allLessons.filter((lesson) => !isPlaceholder(lesson.ts));
const stubs = allLessons.length - authored.length;

describe("compiler-truth", () => {
  it(`skips ${stubs} placeholder lessons and checks ${authored.length} authored panes`, () => {
    expect(stubs + authored.length).toBe(allLessons.length);
  });

  it("uses Strada 6.0.3 for the programmatic checker", () => {
    expect(ts.version).toBe("6.0.3");
    expect(STRADA_COMPILER_VERSION).toBe("6.0.3");
  });

  for (const lesson of authored) {
    it(`${lesson.id}: expectedDiagnostics match real tsc output`, () => {
      const { diagnostics } = session.check(lesson.ts.code);
      const match = matchesExpected(
        diagnostics,
        lesson.ts.expectedDiagnostics,
      );
      expect(match.matched, formatDiagnosticMatch(match)).toBe(true);
    });

    it(`${lesson.id}: generated pane diagnostics match live Strada`, () => {
      const { diagnostics } = session.check(lesson.ts.code);
      const generated = LESSON_DIAGNOSTICS[lesson.id]?.pane;
      expect(generated).toBeDefined();
      expect(generated).toEqual(diagnostics);
    });

    if (lesson.exercise?.solution) {
      it(`${lesson.id}: exercise solution satisfies assertion`, () => {
        const { diagnostics } = session.check(lesson.exercise!.solution!);
        const assertion = lesson.exercise!.assertion;
        if (assertion === "no-errors") {
          expect(diagnostics).toEqual([]);
          return;
        }
        const match = matchesExpected(diagnostics, assertion);
        expect(match.matched, formatDiagnosticMatch(match)).toBe(true);
      });
    }
  }

  if (authored.length === 0) {
    it("has no authored panes yet — all lessons are placeholders", () => {
      expect(allLessons.every((lesson) => isPlaceholder(lesson.ts))).toBe(
        true,
      );
    });
  }
});
