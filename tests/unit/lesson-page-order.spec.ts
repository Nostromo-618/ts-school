import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Template contract for LessonPage section order — keeps presentation
 * (problem → panes → solution → … → prerequisites → pager) from regressing
 * without mounting the full app shell.
 */
describe("LessonPage presentation order", () => {
  const source = readFileSync(
    resolve(__dirname, "../../src/pages/LessonPage.vue"),
    "utf8",
  );

  function indexOf(marker: string): number {
    const i = source.indexOf(marker);
    expect(i, `missing marker: ${marker}`).toBeGreaterThanOrEqual(0);
    return i;
  }

  it("orders teaching sections then prerequisites before the pager", () => {
    const problem = indexOf('id="lesson-problem"');
    const dualPane = indexOf("<DualPane");
    const solution = indexOf('id="lesson-solution"');
    const insight = indexOf('id="lesson-insight"');
    const quiz = indexOf("<QuizBlock");
    const exercise = indexOf("<ExerciseBlock");
    const prerequisites = indexOf('id="lesson-prerequisites"');
    const pager = indexOf('class="ts-lesson-pager"');

    expect(problem).toBeLessThan(dualPane);
    expect(dualPane).toBeLessThan(solution);
    expect(solution).toBeLessThan(insight);
    expect(insight).toBeLessThan(quiz);
    expect(quiz).toBeLessThan(exercise);
    expect(exercise).toBeLessThan(prerequisites);
    expect(prerequisites).toBeLessThan(pager);
  });

  it("does not place prerequisites between problem and dual panes", () => {
    const problem = indexOf('id="lesson-problem"');
    const dualPane = indexOf("<DualPane");
    const prerequisites = indexOf('id="lesson-prerequisites"');
    expect(prerequisites).toBeGreaterThan(dualPane);
    expect(prerequisites).toBeGreaterThan(problem);
  });
});
