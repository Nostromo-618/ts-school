import { ref, computed } from "vue";
import { defineStore } from "pinia";

/**
 * Shared editable lesson buffers so the AI tool host and DualPane/ExerciseBlock
 * share one source of truth.
 */
export const useLessonEditorStore = defineStore("lessonEditor", () => {
  const lessonId = ref<string | null>(null);
  const tsCode = ref("");
  const exerciseCode = ref("");
  const pendingTsEdit = ref<string | null>(null);
  const pendingExerciseEdit = ref<string | null>(null);

  const hasPendingEdit = computed(
    () => pendingTsEdit.value !== null || pendingExerciseEdit.value !== null,
  );

  function bindLesson(id: string, ts: string, exercise?: string): void {
    lessonId.value = id;
    tsCode.value = ts;
    exerciseCode.value = exercise ?? "";
    pendingTsEdit.value = null;
    pendingExerciseEdit.value = null;
  }

  function setTsCode(value: string): void {
    tsCode.value = value;
  }

  function setExerciseCode(value: string): void {
    exerciseCode.value = value;
  }

  function proposeTsEdit(next: string): void {
    pendingTsEdit.value = next;
  }

  function proposeExerciseEdit(next: string): void {
    pendingExerciseEdit.value = next;
  }

  function acceptPending(): { applied: "ts" | "exercise" | "both" | null } {
    let applied: "ts" | "exercise" | "both" | null = null;
    if (pendingTsEdit.value !== null && pendingExerciseEdit.value !== null) {
      tsCode.value = pendingTsEdit.value;
      exerciseCode.value = pendingExerciseEdit.value;
      applied = "both";
    } else if (pendingTsEdit.value !== null) {
      tsCode.value = pendingTsEdit.value;
      applied = "ts";
    } else if (pendingExerciseEdit.value !== null) {
      exerciseCode.value = pendingExerciseEdit.value;
      applied = "exercise";
    }
    pendingTsEdit.value = null;
    pendingExerciseEdit.value = null;
    return { applied };
  }

  function rejectPending(): void {
    pendingTsEdit.value = null;
    pendingExerciseEdit.value = null;
  }

  function clear(): void {
    lessonId.value = null;
    tsCode.value = "";
    exerciseCode.value = "";
    pendingTsEdit.value = null;
    pendingExerciseEdit.value = null;
  }

  return {
    lessonId,
    tsCode,
    exerciseCode,
    pendingTsEdit,
    pendingExerciseEdit,
    hasPendingEdit,
    bindLesson,
    setTsCode,
    setExerciseCode,
    proposeTsEdit,
    proposeExerciseEdit,
    acceptPending,
    rejectPending,
    clear,
  };
});
