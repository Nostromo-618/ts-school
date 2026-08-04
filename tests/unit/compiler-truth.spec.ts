/**
 * Compiler-truth suite.
 *
 * Runs the real TypeScript 6.0.3 compiler over every authored lesson pane and
 * asserts the lesson's `expectedDiagnostics` match what the compiler reports.
 *
 * Skip rule (documented for content-tier agents):
 * - If `isPlaceholder(lesson.ts)` is true, the lesson is SKIPPED. Taxonomy
 *   stubs must not fail CI.
 * - Otherwise the suite checks `lesson.ts.code` with `createTypecheckSession`
 *   (libs from `public/ts-lib/`) and asserts
 *   `matchesExpected(actual, lesson.ts.expectedDiagnostics).matched`.
 * - An authored pane with `expectedDiagnostics: []` MUST produce zero
 *   diagnostics — empty means "the compiler is silent", not "skip me".
 * - When an authored lesson includes `exercise.solution`, that solution is
 *   also checked against `exercise.assertion` (`"no-errors"` or an expected
 *   diagnostic set). Missing exercise/solution is not a failure.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as ts from "typescript";
import { describe, expect, it } from "vitest";

import { allLessons, isPlaceholder } from "@/curriculum";
import { formatDiagnosticMatch, matchesExpected } from "@/typecheck";
import {
  BASELINE_LIB,
  createTypecheckSession,
} from "@/typecheck/host";

const libDir = resolve(process.cwd(), "public", "ts-lib");
const manifest = JSON.parse(
  readFileSync(resolve(libDir, "manifest.json"), "utf8"),
) as { closures: Record<string, string[]> };

function loadLibs(entryLibs: string[] = [BASELINE_LIB]): Map<string, string> {
  const fileNames = new Set(
    entryLibs.flatMap((lib) => {
      const closure = manifest.closures[lib];
      if (!closure) throw new Error(`no closure for lib "${lib}"`);
      return closure;
    }),
  );
  return new Map(
    [...fileNames].map((fileName) => [
      fileName,
      readFileSync(resolve(libDir, fileName), "utf8"),
    ]),
  );
}

const session = createTypecheckSession({ ts, libs: loadLibs() });

const authored = allLessons.filter((lesson) => !isPlaceholder(lesson.ts));
const stubs = allLessons.length - authored.length;

describe("compiler-truth", () => {
  it(`skips ${stubs} placeholder lessons and checks ${authored.length} authored panes`, () => {
    expect(stubs + authored.length).toBe(allLessons.length);
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

  // When every lesson is still a stub the loop above adds zero cases; keep an
  // explicit anchor so the file always contributes a passing assertion.
  if (authored.length === 0) {
    it("has no authored panes yet — all lessons are placeholders", () => {
      expect(allLessons.every((lesson) => isPlaceholder(lesson.ts))).toBe(
        true,
      );
    });
  }
});
