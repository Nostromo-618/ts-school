<script setup lang="ts">
/**
 * Editable TypeScript pane with static build-time diagnostics.
 *
 * Diagnostics come from `LESSON_DIAGNOSTICS` (Strada at generate time), not a
 * live worker. The editor stays editable for learning; the list does not update
 * as the learner types.
 */
import { computed, ref } from "vue";
import { VdCodeEditor } from "@vanduo-oss/vd3-cbun/code-editor";
import type { VdCodeEditorExposed } from "@vanduo-oss/vd3-cbun/code-editor";
import type { TsDiagnostic } from "@/typecheck";
import DiagnosticsList from "./DiagnosticsList.vue";

const props = defineProps<{
  modelValue: string;
  caption: string;
  diagnostics: TsDiagnostic[];
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const code = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value),
});

const editorRef = ref<VdCodeEditorExposed | null>(null);

function offsetFor(line: number, column: number): number {
  const lines = code.value.split("\n");
  let offset = 0;
  for (let index = 0; index < line - 1 && index < lines.length; index += 1) {
    offset += lines[index].length + 1;
  }
  return offset + Math.max(0, column - 1);
}

function jumpTo(diagnostic: TsDiagnostic): void {
  const editor = editorRef.value;
  if (!editor) return;
  const start = offsetFor(diagnostic.line, diagnostic.column);
  const end = start + Math.max(diagnostic.length, 0);
  editor.setSelection(start, end);
  editor.focus();
}
</script>

<template>
  <div class="ts-pane ts-pane-ts vd-stack" data-gap="fib-5">
    <div class="ts-pane-header">
      <span class="ts-pane-label">TypeScript</span>
      <span class="vd-text-muted vd-text-sm">{{ caption }}</span>
    </div>
    <VdCodeEditor
      ref="editorRef"
      v-model="code"
      language="typescript"
      :line-numbers="true"
      :highlight-active-line="true"
      aria-label="TypeScript lesson editor"
    />
    <DiagnosticsList :diagnostics="diagnostics" @jump="jumpTo" />
  </div>
</template>
