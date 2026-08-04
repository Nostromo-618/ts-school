<script setup lang="ts">
/**
 * Diagnostics under the TypeScript pane.
 *
 * `VdCodeEditor` is a textarea-overlay editor with no gutter-marker API, so
 * errors live in this list rather than beside the line they name. Jump-to-line
 * is emitted for the parent to focus the editor via `setSelection` / `focus`.
 *
 * Messages may contain newlines (flattened compiler chains). They are rendered
 * as plain text with `white-space: pre-wrap` — never as HTML.
 */
import type { TsDiagnostic } from "@/typecheck";

defineProps<{
  diagnostics: readonly TsDiagnostic[];
  checking?: boolean;
  error?: string | null;
}>();

const emit = defineEmits<{
  jump: [diagnostic: TsDiagnostic];
}>();
</script>

<template>
  <div class="ts-diagnostics" role="region" aria-label="TypeScript diagnostics">
    <p v-if="error" class="vd-alert vd-alert-danger" role="alert">
      {{ error }}
    </p>

    <p
      v-else-if="checking && diagnostics.length === 0"
      class="vd-text-muted vd-text-sm"
      role="status"
    >
      Checking…
    </p>

    <p
      v-else-if="diagnostics.length === 0"
      class="vd-text-muted vd-text-sm"
      role="status"
    >
      No diagnostics.
    </p>

    <ul v-else class="ts-diagnostics-list">
      <li
        v-for="(diagnostic, index) in diagnostics"
        :key="`${diagnostic.code}-${diagnostic.line}-${diagnostic.column}-${index}`"
        class="ts-diagnostics-item"
      >
        <button
          type="button"
          class="ts-diagnostics-jump"
          :aria-label="`Jump to line ${diagnostic.line}, column ${diagnostic.column}`"
          @click="emit('jump', diagnostic)"
        >
          <span class="ts-diagnostics-loc">
            {{ diagnostic.line }}:{{ diagnostic.column }}
          </span>
          <span class="ts-diagnostics-code">TS{{ diagnostic.code }}</span>
          <span class="ts-diagnostics-message">{{ diagnostic.message }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.ts-diagnostics {
  margin-top: var(--vd-space-fib-5, 0.5rem);
}

.ts-diagnostics-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--vd-space-fib-3, 0.3125rem);
}

.ts-diagnostics-jump {
  display: grid;
  grid-template-columns: auto auto 1fr;
  gap: var(--vd-space-fib-5, 0.5rem);
  align-items: start;
  width: 100%;
  margin: 0;
  padding: var(--vd-space-fib-5, 0.5rem) var(--vd-space-fib-8, 0.8125rem);
  border: 1px solid var(--vd-border-color, currentcolor);
  border-radius: var(--vd-radius-md, 0.5rem);
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.ts-diagnostics-jump:hover,
.ts-diagnostics-jump:focus-visible {
  border-color: var(--vd-color-primary);
  outline: none;
}

.ts-diagnostics-loc,
.ts-diagnostics-code {
  font-family: var(--vd-font-mono, ui-monospace, monospace);
  font-size: 0.8125rem;
  white-space: nowrap;
}

.ts-diagnostics-code {
  color: var(--vd-color-danger, var(--vd-color-primary));
  font-weight: 600;
}

.ts-diagnostics-message {
  white-space: pre-wrap;
  font-size: 0.875rem;
  min-width: 0;
}
</style>
