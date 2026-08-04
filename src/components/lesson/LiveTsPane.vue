<script setup lang="ts">
/**
 * Editable TypeScript pane with a live worker behind it.
 *
 * Mounted only for authored (non-placeholder) panes so stub lessons never
 * construct a Worker. Owns `useTypecheck` and exposes jump-to-line for the
 * diagnostics list.
 */
import { computed, ref, toRef } from "vue";
import { VdCodeEditor } from "@vanduo-oss/vd3-cbun/code-editor";
import type { VdCodeEditorExposed } from "@vanduo-oss/vd3-cbun/code-editor";
import {
  useTypecheck,
  type TsDiagnostic,
  type TypecheckOptions,
} from "@/typecheck";
import DiagnosticsList from "./DiagnosticsList.vue";

const props = defineProps<{
  modelValue: string;
  caption: string;
  initialDiagnostics: TsDiagnostic[];
  options?: TypecheckOptions;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const code = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value),
});

const { diagnostics, checking, error } = useTypecheck(code, {
  options: toRef(props, "options"),
  initialDiagnostics: props.initialDiagnostics,
  immediate: true,
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
    <DiagnosticsList
      :diagnostics="diagnostics"
      :checking="checking"
      :error="error"
      @jump="jumpTo"
    />
  </div>
</template>
