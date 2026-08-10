<script setup lang="ts">
/**
 * Authored multiple-choice quiz with instant feedback. Scores land in the
 * progress store when every question has been answered.
 *
 * Choices stay custom (not `VdRadioGroup`): after answering we need
 * correct/wrong styling per option while locking further input — radio groups
 * in vd3 are for live form selection, not one-shot reveal feedback.
 */
import { computed, ref, watch } from "vue";
import ProseHtml from "@/components/ProseHtml.vue";
import type { QuizQuestion } from "@/curriculum";
import { useProgressStore } from "@/stores/progress";

const props = defineProps<{
  lessonId: string;
  questions: QuizQuestion[];
}>();

const emit = defineEmits<{
  complete: [score: { correct: number; total: number }];
}>();

const progress = useProgressStore();
const answers = ref<Record<string, string>>({});

watch(
  () => props.questions,
  () => {
    answers.value = {};
  },
);

const total = computed(() => props.questions.length);

const answeredCount = computed(() => Object.keys(answers.value).length);

const correctCount = computed(
  () =>
    props.questions.filter(
      (question) => answers.value[question.id] === question.answerId,
    ).length,
);

const finished = computed(
  () => total.value > 0 && answeredCount.value === total.value,
);

/** A, B, C, … for choice order (UI only; scoring still uses choice ids). */
function choiceLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

function select(question: QuizQuestion, choiceId: string): void {
  if (answers.value[question.id] !== undefined) return;
  answers.value = { ...answers.value, [question.id]: choiceId };

  if (answeredCount.value === total.value) {
    const score = { correct: correctCount.value, total: total.value };
    progress.recordQuiz(props.lessonId, score.correct, score.total);
    emit("complete", score);
  }
}

function isCorrect(question: QuizQuestion): boolean {
  return answers.value[question.id] === question.answerId;
}
</script>

<template>
  <section
    class="ts-quiz vd-stack"
    data-gap="fib-13"
    aria-labelledby="lesson-quiz"
  >
    <header class="vd-stack" data-gap="fib-3">
      <h2 id="lesson-quiz">Quiz</h2>
      <p class="vd-text-muted vd-text-sm">
        {{ answeredCount }} of {{ total }} answered
        <template v-if="finished"> — {{ correctCount }} correct </template>
      </p>
    </header>

    <div
      v-for="(question, index) in questions"
      :key="question.id"
      class="ts-quiz-question vd-stack"
      data-gap="fib-5"
    >
      <div class="ts-quiz-prompt">
        <span class="vd-text-muted">{{ index + 1 }}.</span>
        <ProseHtml inline :text="question.prompt" />
      </div>

      <ul class="ts-quiz-choices" role="list">
        <li
          v-for="(choice, choiceIndex) in question.choices"
          :key="choice.id"
        >
          <button
            type="button"
            class="ts-quiz-choice"
            :class="{
              'is-selected': answers[question.id] === choice.id,
              'is-correct':
                answers[question.id] !== undefined &&
                choice.id === question.answerId,
              'is-wrong':
                answers[question.id] === choice.id &&
                choice.id !== question.answerId,
            }"
            :disabled="answers[question.id] !== undefined"
            :aria-pressed="answers[question.id] === choice.id"
            @click="select(question, choice.id)"
          >
            <span class="ts-quiz-choice-letter">{{
              choiceLetter(choiceIndex)
            }}</span>
            <ProseHtml inline :text="choice.text" />
          </button>
        </li>
      </ul>

      <div
        v-if="answers[question.id] !== undefined"
        class="ts-quiz-feedback"
        :class="isCorrect(question) ? 'is-correct' : 'is-wrong'"
        role="status"
      >
        <strong>{{ isCorrect(question) ? "Correct." : "Not quite." }}</strong>
        <ProseHtml inline :text="question.explanation" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.ts-quiz-prompt {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35em;
  align-items: baseline;
}

.ts-quiz-choices {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--vd-space-fib-3, 0.3125rem);
}

.ts-quiz-choice {
  display: flex;
  align-items: flex-start;
  gap: var(--vd-space-fib-8, 0.8125rem);
  width: 100%;
  margin: 0;
  padding: var(--vd-space-fib-5, 0.5rem) var(--vd-space-fib-8, 0.8125rem);
  border: 1px solid var(--vd-border-color, currentcolor);
  border-radius: var(--vd-btn-border-radius, var(--vd-radius-fib-5, 0.3125rem));
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.ts-quiz-choice:hover:not(:disabled) {
  background-color: color-mix(
    in srgb,
    var(--vd-bg-secondary, #f5f5f5) 85%,
    transparent
  );
  border-color: color-mix(
    in srgb,
    var(--vd-border-color, currentcolor) 70%,
    var(--vd-text-primary, #111) 30%
  );
}

.ts-quiz-choice:focus-visible {
  outline: 2px solid
    var(--vd-input-focus-border-color, var(--vd-color-primary, #2563eb));
  outline-offset: 2px;
}

.ts-quiz-choice-letter {
  flex: 0 0 auto;
  min-width: 1.25em;
  font-weight: 600;
  color: var(--vd-text-muted, var(--vd-text-secondary));
}

.ts-quiz-choice:disabled {
  cursor: default;
}

.ts-quiz-choice.is-correct {
  border-color: var(--vd-color-success, #2e7d32);
}

.ts-quiz-choice.is-wrong {
  border-color: var(--vd-color-danger, #c62828);
}

.ts-quiz-feedback {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35em;
  align-items: baseline;
}

.ts-quiz-feedback.is-correct {
  color: var(--vd-color-success, #2e7d32);
}

.ts-quiz-feedback.is-wrong {
  color: var(--vd-color-danger, #c62828);
}
</style>
