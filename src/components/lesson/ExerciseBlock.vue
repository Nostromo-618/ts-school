<script setup lang="ts">
/**
 * Hands-on exercise. Passes when normalized editor text matches the authored
 * `solution`. Diagnostics are static (starter / solution from the build-time
 * Strada generator), not live-checked.
 */
import { computed, ref, watch } from "vue";
import { VdAlert } from "@vanduo-oss/vd3";
import { VdCodeEditor } from "@vanduo-oss/vd3-cbun/code-editor";
import { formatExerciseAiHelpPrompt } from "@/ai/exercise-help";
import ProseHtml from "@/components/ProseHtml.vue";
import { lessonById, type Exercise } from "@/curriculum";
import { normalizeSource, type TsDiagnostic } from "@/typecheck";
import { useAiChatStore } from "@/stores/aiChat";
import { useProgressStore } from "@/stores/progress";
import { useLessonEditorStore } from "@/stores/lessonEditor";
import DiagnosticsList from "./DiagnosticsList.vue";

const props = defineProps<{
  lessonId: string;
  exercise: Exercise;
  starterDiagnostics?: readonly TsDiagnostic[];
  solutionDiagnostics?: readonly TsDiagnostic[];
}>();

const emit = defineEmits<{
  pass: [];
}>();

const progress = useProgressStore();
const editor = useLessonEditorStore();
const aiChat = useAiChatStore();
const showHints = ref(false);
const showSolution = ref(false);
const passed = ref(false);
const mismatchMessage = ref<string | null>(null);

const code = computed({
  get: () => editor.exerciseCode || props.exercise.starter,
  set: (value: string) => editor.setExerciseCode(value),
});

watch(
  () => [props.lessonId, props.exercise.starter] as const,
  ([id, starter]) => {
    if (editor.lessonId !== id) {
      editor.bindLesson(id, editor.tsCode, starter);
    } else {
      editor.setExerciseCode(starter);
    }
    passed.value = false;
    mismatchMessage.value = null;
    showHints.value = false;
    showSolution.value = false;
  },
  { immediate: true },
);

const alreadyPassed = computed(
  () =>
    passed.value || progress.lessons[props.lessonId]?.exercisePassed === true,
);

const displayDiagnostics = computed((): TsDiagnostic[] => {
  if (showSolution.value && props.solutionDiagnostics) {
    return [...props.solutionDiagnostics];
  }
  return [...(props.starterDiagnostics ?? [])];
});

function check(): void {
  const solution = props.exercise.solution;
  if (!solution) {
    mismatchMessage.value =
      "This exercise has no authored solution to match against.";
    return;
  }
  if (normalizeSource(code.value) === normalizeSource(solution)) {
    passed.value = true;
    mismatchMessage.value = null;
    progress.recordExercisePass(props.lessonId);
    emit("pass");
    return;
  }
  mismatchMessage.value =
    "Not a match yet — keep editing toward the solution (or reveal it).";
}

function revealSolution(): void {
  if (!props.exercise.solution) return;
  showSolution.value = true;
  code.value = props.exercise.solution;
}

function askAiHelp(): void {
  const lesson = lessonById(props.lessonId);
  const prompt = formatExerciseAiHelpPrompt({
    lessonId: props.lessonId,
    lessonTitle: lesson?.title ?? props.lessonId,
    exercise: props.exercise,
    currentCode: code.value,
    solutionRevealed: showSolution.value,
  });
  aiChat.queueComposerPrompt(prompt, { autoSend: true });
  aiChat.openChat();
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
      <ProseHtml :text="exercise.prompt" />
      <p class="vd-text-muted vd-text-sm">
        Check compares your code to the authored solution (normalized
        whitespace), not a live typecheck. Diagnostics below are build-time
        snapshots.
      </p>
    </header>

    <VdCodeEditor
      v-model="code"
      language="typescript"
      :line-numbers="true"
      :highlight-active-line="true"
      aria-label="Exercise editor"
    />

    <DiagnosticsList :diagnostics="displayDiagnostics" />

    <div class="ts-exercise-actions vd-inline" data-gap="fib-5">
      <button
        type="button"
        class="vd-btn vd-btn-primary vd-btn-sm"
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
      <button
        type="button"
        class="vd-btn vd-btn-secondary vd-btn-sm"
        data-testid="ts-exercise-ai-help"
        @click="askAiHelp"
      >
        AI help
      </button>
    </div>

    <VdAlert v-if="alreadyPassed" variant="success" role="status">
      Exercise passed.
    </VdAlert>
    <VdAlert v-else-if="mismatchMessage" variant="warning" role="status">
      Not quite yet.
      <span class="ts-exercise-mismatch">{{ mismatchMessage }}</span>
    </VdAlert>

    <ul v-if="showHints && exercise.hints" class="ts-exercise-hints">
      <li v-for="(hint, index) in exercise.hints" :key="index">
        <ProseHtml :text="hint" />
      </li>
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
