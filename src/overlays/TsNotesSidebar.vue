<script setup lang="ts">
/**
 * Learner notes sidebar — plain-text edit + CSP-safe markdown preview.
 * Pin left XOR right; independent of the AI chat dock.
 */
import { computed, ref, watch } from "vue";
import { VdButton, VdIcon } from "@vanduo-oss/vd3";
import { renderNotesHtml } from "@/lib/notes-markdown";
import type { NotesPinSide } from "@/stores/notes";

const props = defineProps<{
  open: boolean;
  pinned?: boolean;
  pinSide?: NotesPinSide;
  body: string;
  nearSoftLimit?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  "toggle-pin": [];
  "update:body": [value: string];
  "set-pin-side": [side: NotesPinSide];
}>();

const mode = ref<"edit" | "preview">("edit");

const isPinned = computed(() => Boolean(props.pinned));
const side = computed<NotesPinSide>(() =>
  props.pinSide === "left" ? "left" : "right",
);
const pinLabel = computed(() =>
  isPinned.value ? "Unpin notes" : "Pin notes open",
);
const previewHtml = computed(() => renderNotesHtml(props.body));

watch(
  () => props.open,
  (open) => {
    if (!open) mode.value = "edit";
  },
);

function onInput(event: Event): void {
  const target = event.target as HTMLTextAreaElement;
  emit("update:body", target.value);
}

function chooseSide(next: NotesPinSide): void {
  emit("set-pin-side", next);
  if (!isPinned.value) emit("toggle-pin");
}
</script>

<template>
  <aside
    v-show="open"
    class="ts-notes-sidebar"
    :class="{
      'is-pinned': isPinned,
      'is-side-left': side === 'left',
      'is-side-right': side === 'right',
    }"
    data-testid="ts-notes-sidebar"
    :data-pinned="isPinned ? 'true' : 'false'"
    :data-pin-side="side"
    aria-label="Learner notes"
  >
    <header class="ts-notes-sidebar-header">
      <VdIcon name="note" aria-hidden="true" />
      <div class="vd-stack" data-gap="fib-1" style="flex: 1; min-width: 0">
        <strong>Notes</strong>
        <span class="vd-text-muted vd-text-sm"
          >Local only · markdown preview</span
        >
      </div>
      <VdButton
        variant="ghost"
        size="sm"
        :aria-label="pinLabel"
        :aria-pressed="isPinned"
        data-testid="ts-notes-pin"
        @click="emit('toggle-pin')"
      >
        <VdIcon name="push-pin" :filled="isPinned" aria-hidden="true" />
      </VdButton>
      <VdButton
        variant="ghost"
        size="sm"
        aria-label="Close notes"
        data-testid="ts-notes-close"
        @click="emit('close')"
      >
        Close
      </VdButton>
    </header>

    <div class="ts-notes-toolbar" role="toolbar" aria-label="Notes options">
      <div class="vd-cluster" data-gap="fib-3" role="group" aria-label="Mode">
        <VdButton
          size="sm"
          :variant="mode === 'edit' ? 'primary' : 'ghost'"
          data-testid="ts-notes-mode-edit"
          @click="mode = 'edit'"
        >
          Edit
        </VdButton>
        <VdButton
          size="sm"
          :variant="mode === 'preview' ? 'primary' : 'ghost'"
          data-testid="ts-notes-mode-preview"
          @click="mode = 'preview'"
        >
          Preview
        </VdButton>
      </div>
      <div
        class="vd-cluster"
        data-gap="fib-3"
        role="group"
        aria-label="Pin side"
      >
        <VdButton
          size="sm"
          variant="ghost"
          :aria-pressed="side === 'left'"
          data-testid="ts-notes-pin-left"
          @click="chooseSide('left')"
        >
          Left
        </VdButton>
        <VdButton
          size="sm"
          variant="ghost"
          :aria-pressed="side === 'right'"
          data-testid="ts-notes-pin-right"
          @click="chooseSide('right')"
        >
          Right
        </VdButton>
      </div>
    </div>

    <p
      v-if="nearSoftLimit"
      class="vd-text-sm vd-text-muted ts-notes-size-hint"
      data-testid="ts-notes-size-hint"
    >
      Notes are getting large for localStorage. Consider exporting from Profile.
    </p>

    <p
      v-if="isPinned && side === 'right'"
      class="vd-text-sm vd-text-muted ts-notes-size-hint"
    >
      Tip: pin notes left when Ask is pinned so both docks stay readable.
    </p>

    <textarea
      v-if="mode === 'edit'"
      class="vd-input ts-notes-editor"
      data-testid="ts-notes-editor"
      rows="16"
      :value="body"
      placeholder="Write study notes in markdown…"
      @input="onInput"
    />
    <!-- Escaped Labs markdown only; not raw HTML. -->
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div
      v-else
      class="ts-notes-preview"
      data-testid="ts-notes-preview"
      v-html="previewHtml"
    />
  </aside>
</template>
