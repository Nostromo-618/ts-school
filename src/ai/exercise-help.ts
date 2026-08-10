import type { Exercise, ExerciseAssertion } from "@/curriculum";

export type ExerciseAiHelpInput = {
  lessonId: string;
  lessonTitle: string;
  exercise: Pick<Exercise, "prompt" | "starter" | "assertion" | "solution">;
  /** Live editor buffer (may differ from starter). */
  currentCode: string;
  /** Include authored solution only after the learner revealed it. */
  solutionRevealed?: boolean;
};

function describeAssertion(assertion: ExerciseAssertion): string {
  if (assertion === "no-errors") {
    return "the solution should typecheck with no errors.";
  }
  const parts = assertion.map((d) => {
    const line = typeof d.line === "number" ? ` @ line ${d.line}` : "";
    const hint = d.messageIncludes ? ` (mentions “${d.messageIncludes}”)` : "";
    return `TS${d.code}${line}${hint}`;
  });
  return `expect diagnostic(s) ${parts.join("; ")}.`;
}

/**
 * Build a composer-ready help request with exercise context.
 * Omits the solution unless the learner has already revealed it.
 */
export function formatExerciseAiHelpPrompt(input: ExerciseAiHelpInput): string {
  const { lessonId, lessonTitle, exercise, currentCode } = input;
  const sections: string[] = [
    "Help me with this TypeScript School exercise. Explain what is wrong with my current code and how to fix it. Do not dump the full solution unless I ask.",
    "",
    "## Lesson",
    `- id: ${lessonId}`,
    `- title: ${lessonTitle}`,
    "",
    "## Exercise prompt",
    exercise.prompt,
    "",
    "## Starter code",
    "```ts",
    exercise.starter.trimEnd(),
    "```",
    "",
    "## My current code",
    "```ts",
    currentCode.trimEnd(),
    "```",
    "",
    "## Assertion",
    describeAssertion(exercise.assertion),
  ];

  if (input.solutionRevealed && exercise.solution) {
    sections.push(
      "",
      "## Revealed solution (learner already opened this)",
      "```ts",
      exercise.solution.trimEnd(),
      "```",
    );
  }

  return sections.join("\n");
}
