import { describe, expect, it } from "vitest";
import { formatExerciseAiHelpPrompt } from "@/ai/exercise-help";

const exercise = {
  prompt: "Make addTax compile: parse the string before calling.",
  starter: `function addTax(amount: number): number {\n  return amount * 1.2;\n}\n\naddTax("19.99");\n`,
  assertion: "no-errors" as const,
  solution: `function addTax(amount: number): number {\n  return amount * 1.2;\n}\n\naddTax(Number("19.99"));\n`,
};

describe("formatExerciseAiHelpPrompt", () => {
  it("includes lesson, prompt, starter, current code, and assertion", () => {
    const text = formatExerciseAiHelpPrompt({
      lessonId: "first-type-error",
      lessonTitle: "Your first type error",
      exercise,
      currentCode: 'addTax("nope");\n',
    });

    expect(text).toContain("first-type-error");
    expect(text).toContain("Your first type error");
    expect(text).toContain("Make addTax compile");
    expect(text).toContain("## Starter code");
    expect(text).toContain('addTax("19.99")');
    expect(text).toContain("## My current code");
    expect(text).toContain('addTax("nope")');
    expect(text).toContain("typecheck with no errors");
    expect(text).toMatch(/Socratic hint|next small step/i);
    expect(text).not.toContain("## Revealed solution");
    expect(text).not.toContain('addTax(Number("19.99"))');
  });

  it("includes solution only when revealed", () => {
    const text = formatExerciseAiHelpPrompt({
      lessonId: "first-type-error",
      lessonTitle: "Your first type error",
      exercise,
      currentCode: exercise.solution,
      solutionRevealed: true,
    });

    expect(text).toContain("## Revealed solution");
    expect(text).toContain('addTax(Number("19.99"))');
  });

  it("describes diagnostic assertions", () => {
    const text = formatExerciseAiHelpPrompt({
      lessonId: "x",
      lessonTitle: "X",
      exercise: {
        prompt: "p",
        starter: "s",
        assertion: [{ code: 2345, line: 5, messageIncludes: "string" }],
      },
      currentCode: "c",
    });

    expect(text).toContain("TS2345 @ line 5");
    expect(text).toContain("string");
  });
});
