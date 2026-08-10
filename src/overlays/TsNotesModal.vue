<script setup lang="ts">
/**
 * Learner notes floating modal — drag / resize / fold; sheet below 48rem.
 * Non-modal dialog: no focus trap; Escape closes when focus is inside.
 */
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type CSSProperties,
} from "vue";
import { VdButton, VdIcon } from "@vanduo-oss/vd3";
import { renderNotesHtml } from "@/lib/notes-markdown";
import {
  NOTES_MIN_HEIGHT,
  NOTES_MIN_WIDTH,
  isNotesFreeMoveViewport,
  type NotesWindowV1,
} from "@/lib/notes-window";

const props = defineProps<{
  open: boolean;
  folded?: boolean;
  geometry: NotesWindowV1;
  body: string;
  nearSoftLimit?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  "toggle-fold": [];
  "update:body": [value: string];
  "update:geometry": [value: NotesWindowV1];
  reclamp: [];
}>();

const mode = ref<"edit" | "preview">("edit");
const rootEl = ref<HTMLElement | null>(null);
const freeMove = ref(true);

type DragMode = "move" | "resize" | null;
const dragMode = ref<DragMode>(null);
const dragOrigin = ref({
  pointerX: 0,
  pointerY: 0,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
});

const previewHtml = computed(() => renderNotesHtml(props.body));

const panelStyle = computed((): CSSProperties => {
  // Sheet mode: CSS owns placement (near-full inset when expanded).
  if (!freeMove.value) {
    return props.folded
      ? { height: "auto", minHeight: "0", top: "auto" }
      : {};
  }
  // Always set height explicitly when folded so a prior expanded px height
  // cannot linger and leave a blank band above the title row.
  if (props.folded) {
    return {
      left: `${props.geometry.x}px`,
      top: `${props.geometry.y}px`,
      width: `${props.geometry.width}px`,
      height: "auto",
      minHeight: "0",
    };
  }
  return {
    left: `${props.geometry.x}px`,
    top: `${props.geometry.y}px`,
    width: `${props.geometry.width}px`,
    height: `${props.geometry.height}px`,
  };
});

function syncFreeMove(): void {
  if (typeof window === "undefined") return;
  const rootPx =
    Number.parseFloat(getComputedStyle(document.documentElement).fontSize) ||
    16;
  freeMove.value = isNotesFreeMoveViewport(window.innerWidth, rootPx);
}

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

function onKeydown(event: KeyboardEvent): void {
  if (event.key !== "Escape") return;
  if (!props.open) return;
  const root = rootEl.value;
  if (!root) return;
  const active = document.activeElement;
  if (active && root.contains(active)) {
    event.preventDefault();
    event.stopPropagation();
    emit("close");
  }
}

function onViewportResize(): void {
  syncFreeMove();
  emit("reclamp");
}

function startDrag(mode: Exclude<DragMode, null>, event: PointerEvent): void {
  if (!freeMove.value || !props.open) return;
  if (event.button !== 0) return;
  event.preventDefault();
  const target = event.currentTarget as HTMLElement;
  target.setPointerCapture(event.pointerId);
  dragMode.value = mode;
  dragOrigin.value = {
    pointerX: event.clientX,
    pointerY: event.clientY,
    x: props.geometry.x,
    y: props.geometry.y,
    width: props.geometry.width,
    height: props.geometry.height,
  };
}

function onPointerMove(event: PointerEvent): void {
  if (!dragMode.value) return;
  const dx = event.clientX - dragOrigin.value.pointerX;
  const dy = event.clientY - dragOrigin.value.pointerY;
  if (dragMode.value === "move") {
    emit("update:geometry", {
      version: 1,
      x: dragOrigin.value.x + dx,
      y: dragOrigin.value.y + dy,
      width: dragOrigin.value.width,
      height: dragOrigin.value.height,
    });
    return;
  }
  emit("update:geometry", {
    version: 1,
    x: dragOrigin.value.x,
    y: dragOrigin.value.y,
    width: Math.max(NOTES_MIN_WIDTH, dragOrigin.value.width + dx),
    height: Math.max(NOTES_MIN_HEIGHT, dragOrigin.value.height + dy),
  });
}

function endDrag(event: PointerEvent): void {
  if (!dragMode.value) return;
  const target = event.currentTarget as HTMLElement;
  if (target.hasPointerCapture?.(event.pointerId)) {
    target.releasePointerCapture(event.pointerId);
  }
  dragMode.value = null;
  // Final write already happened via update:geometry; emit once more to persist clamp.
  emit("update:geometry", { ...props.geometry });
}

onMounted(() => {
  syncFreeMove();
  window.addEventListener("resize", onViewportResize);
  window.addEventListener("keydown", onKeydown, true);
});

onUnmounted(() => {
  window.removeEventListener("resize", onViewportResize);
  window.removeEventListener("keydown", onKeydown, true);
});
</script>

<template>
  <div
    v-show="open"
    ref="rootEl"
    class="ts-notes-modal"
    :class="{
      'is-folded': folded,
      'is-sheet': !freeMove,
      'is-dragging': dragMode === 'move',
      'is-resizing': dragMode === 'resize',
    }"
    :style="panelStyle"
    role="dialog"
    aria-modal="false"
    aria-label="Notes"
    data-testid="ts-notes-modal"
    :data-folded="folded ? 'true' : 'false'"
    :data-sheet="freeMove ? 'false' : 'true'"
  >
    <header
      class="ts-notes-modal-header"
      data-testid="ts-notes-drag-handle"
      :title="freeMove ? 'Drag to move notes' : undefined"
      @pointerdown="startDrag('move', $event)"
      @pointermove="onPointerMove"
      @pointerup="endDrag"
      @pointercancel="endDrag"
    >
      <span
        v-if="freeMove"
        class="ts-notes-drag-grip"
        aria-hidden="true"
        data-testid="ts-notes-drag-grip"
      >
        <VdIcon name="dots-six-vertical" size="sm" />
      </span>
      <VdIcon name="note" aria-hidden="true" />
      <div class="ts-notes-modal-title" style="flex: 1; min-width: 0">
        <strong>Notes</strong>
        <span v-if="!folded" class="vd-text-muted vd-text-sm"
          >Local only · markdown preview</span
        >
      </div>
      <VdButton
        variant="ghost"
        size="sm"
        :aria-label="folded ? 'Expand notes' : 'Fold notes'"
        :aria-pressed="Boolean(folded)"
        data-testid="ts-notes-fold"
        @click.stop="emit('toggle-fold')"
        @pointerdown.stop
      >
        <VdIcon
          :name="folded ? 'caret-down' : 'caret-up'"
          aria-hidden="true"
        />
      </VdButton>
      <VdButton
        variant="ghost"
        size="sm"
        aria-label="Close notes"
        data-testid="ts-notes-close"
        @click.stop="emit('close')"
        @pointerdown.stop
      >
        Close
      </VdButton>
    </header>

    <template v-if="!folded">
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
      </div>

      <p
        v-if="nearSoftLimit"
        class="vd-text-sm vd-text-muted ts-notes-size-hint"
        data-testid="ts-notes-size-hint"
      >
        Notes are getting large for localStorage. Consider exporting from
        Profile.
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

      <div
        v-if="freeMove"
        class="ts-notes-resize-handle"
        data-testid="ts-notes-resize-handle"
        aria-hidden="true"
        @pointerdown="startDrag('resize', $event)"
        @pointermove="onPointerMove"
        @pointerup="endDrag"
        @pointercancel="endDrag"
      />
    </template>
  </div>
</template>
