<script setup lang="ts">
/**
 * Hands-on exercise checked by the same worker that powers the dual pane.
 * Passes when diagnostics match the authored assertion (`"no-errors"` or an
 * `ExpectedDiagnostic[]` via `matchesExpected`).
 */
import { computed, ref, watch } from "vue";
import { VdCodeEditor } from "@vanduo-oss/vd3-cbun/code-editor";
import type { Exercise } from "@/curriculum";
import {
  formatDiagnosticMatch,
  matchesExpected,
  useTypecheck,
} from "@/typecheck";
import { useProgressStore } from "@/stores/progress";
import DiagnosticsList from "./DiagnosticsList.vue";

const props = defineProps<{
  lessonId: string;
  exercise: Exercise;
}>();

const emit = defineEmits<{
  pass: [];
}>();

const progress = useProgressStore();
const code = ref(props.exercise.starter);
const showHints = ref(false);
const showSolution = ref(false);
const checked = ref(false);
const passed = ref(false);
const mismatchMessage = ref<string | null>(null);

watch(
  () => props.exercise.starter,
  (next) => {
    code.value = next;
    checked.value = false;
    passed.value = false;
    mismatchMessage.value = null;
    showHints.value = false;
    showSolution.value = false;
  },
);

const { diagnostics, checking, error, checkNow } = useTypecheck(code, {
  immediate: true,
});

const alreadyPassed = computed(
  () =>
    passed.value || progress.lessons[props.lessonId]?.exercisePassed === true,
);

function evaluate(): boolean {
  const assertion = props.exercise.assertion;
  if (assertion === "no-errors") {
    if (diagnostics.value.length === 0) return true;
    mismatchMessage.value = `expected no diagnostics, got ${diagnostics.value.length}`;
    return false;
  }
  const match = matchesExpected(diagnostics.value, assertion);
  if (match.matched) return true;
  mismatchMessage.value = formatDiagnosticMatch(match);
  return false;
}

function check(): void {
  checkNow();
  // The worker answer is async; watch diagnostics after requesting a check.
  // For the immediate path, useTypecheck's checkNow dispatches now — we
  // evaluate on the next tick via a one-shot watch when checking flips false.
  checked.value = true;
  if (!checking.value) {
    finishEvaluate();
  }
}

watch(checking, (isChecking, wasChecking) => {
  if (wasChecking && !isChecking && checked.value && !passed.value) {
    finishEvaluate();
  }
});

function finishEvaluate(): void {
  if (error.value) {
    mismatchMessage.value = error.value;
    return;
  }
  if (evaluate()) {
    passed.value = true;
    mismatchMessage.value = null;
    progress.recordExercisePass(props.lessonId);
    emit("pass");
  }
}

function revealSolution(): void {
  if (!props.exercise.solution) return;
  showSolution.value = true;
  code.value = props.exercise.solution;
}
</script>

<template>
  <section
    class="ts-exercise vd-stack"
    data-gap="fib-13"
    aria-labelledby="lesson-exercise"
  >
    <header class="vd-stack" data-gap="fib-5">
      <h2 id="lesson-exercise">Exercise</h2>
      <p>{{ exercise.prompt }}</p>
    </header>

    <VdCodeEditor
      v-model="code"
      language="typescript"
      :line-numbers="true"
      :highlight-active-line="true"
      aria-label="Exercise editor"
    />

    <DiagnosticsList
      :diagnostics="diagnostics"
      :checking="checking"
      :error="error"
    />

    <div class="ts-exercise-actions vd-inline" data-gap="fib-5">
      <button
        type="button"
        class="vd-btn vd-btn-primary vd-btn-sm"
        :disabled="checking"
        @click="check"
      >
        Check
      </button>
      <button
        v-if="exercise.hints && exercise.hints.length > 0"
        type="button"
        class="vd-btn vd-btn-secondary vd-btn-sm"
        @click="showHints = !showHints"
      >
        {{ showHints ? "Hide hints" : "Show hints" }}
      </button>
      <button
        v-if="exercise.solution"
        type="button"
        class="vd-btn vd-btn-outline vd-btn-sm"
        @click="revealSolution"
      >
        Show solution
      </button>
    </div>

    <p v-if="alreadyPassed" class="vd-alert vd-alert-success" role="status">
      Exercise passed.
    </p>
    <p
      v-else-if="mismatchMessage"
      class="vd-alert vd-alert-warning"
      role="status"
    >
      Not quite yet.
      <span class="ts-exercise-mismatch">{{ mismatchMessage }}</span>
    </p>

    <ul v-if="showHints && exercise.hints" class="ts-exercise-hints">
      <li v-for="(hint, index) in exercise.hints" :key="index">{{ hint }}</li>
    </ul>
  </section>
</template>

<style scoped>
.ts-exercise-mismatch {
  display: block;
  margin-top: var(--vd-space-fib-3, 0.3125rem);
  white-space: pre-wrap;
  font-family: var(--vd-font-mono, ui-monospace, monospace);
  font-size: 0.8125rem;
}

.ts-exercise-hints {
  margin: 0;
  padding-left: 1.25rem;
}
</style>
