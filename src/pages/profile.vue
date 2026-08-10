<script setup lang="ts">
/**
 * Local Profile — progress summary, data inventory, export, clear notes / clear all.
 */
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { VdButton, VdModal, VdProgress } from "@vanduo-oss/vd3";
import { useDisclaimerConsent } from "@/composables/useDisclaimerConsent";
import {
  NON_CLEARABLE_SURFACES,
  buildLocalDataInventory,
  clearAllSchoolData,
  downloadSchoolExport,
  type LocalDataInventoryItem,
} from "@/lib/data-hygiene";
import { buildLearnerProgressSummary } from "@/lib/learner-progress";
import { TRACKS, lessonsByTrack } from "@/curriculum";
import { useAiChatStore } from "@/stores/aiChat";
import { useNotesStore } from "@/stores/notes";
import { useProgressStore } from "@/stores/progress";
import { useThemeStore } from "@/stores/theme";

const progress = useProgressStore();
const notes = useNotesStore();
const aiChat = useAiChatStore();
const theme = useThemeStore();
const { refresh: refreshToc, resetAcceptance: resetToc } =
  useDisclaimerConsent();

const inventory = ref<LocalDataInventoryItem[]>([]);
const clearAllOpen = ref(false);
const clearing = ref(false);
const statusMessage = ref("");

const summary = computed(() => buildLearnerProgressSummary());

const trackRows = computed(() =>
  TRACKS.map((track) => {
    const trackLessons = lessonsByTrack(track.id);
    const completed = progress.completedCountForTrack(track.id);
    return {
      id: track.id,
      title: track.title,
      completed,
      total: trackLessons.length,
    };
  }),
);

function refreshInventory(): void {
  inventory.value = buildLocalDataInventory();
}

onMounted(() => {
  progress.hydrate();
  notes.hydrate();
  refreshInventory();
});

function onExport(): void {
  downloadSchoolExport();
  statusMessage.value = "Export downloaded.";
}

function onClearNotes(): void {
  notes.clearNotes();
  refreshInventory();
  statusMessage.value = "Notes cleared. Progress and consents were kept.";
}

async function onConfirmClearAll(): Promise<void> {
  clearing.value = true;
  statusMessage.value = "";
  try {
    notes.flushPersist();
    notes.clearNotes();
    notes.closeNotes();
    notes.setPinSide("right");

    progress.clearProgress();

    aiChat.closeChat();
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem("ts-school-ai-chat-pinned");
      } catch {
        /* ignore */
      }
    }
    aiChat.pinned = false;

    await clearAllSchoolData();
    resetToc();
    refreshToc();
    theme.init();
    refreshInventory();
    statusMessage.value =
      "Local school data cleared. Terms consent will be asked again when needed.";
  } finally {
    clearing.value = false;
    clearAllOpen.value = false;
  }
}
</script>

<template>
  <section
    id="profile"
    class="ts-page vd-stack"
    data-gap="fib-34"
    data-testid="ts-profile-page"
  >
    <header class="vd-stack" data-gap="fib-8">
      <h1>Profile</h1>
      <p class="ts-lead">
        Everything here stays in this browser. There is no account and no server
        sync — export a JSON snapshot if you want a backup, or clear local data
        when you are done.
      </p>
    </header>

    <p
      v-if="statusMessage"
      class="vd-text-sm"
      role="status"
      data-testid="ts-profile-status"
    >
      {{ statusMessage }}
    </p>

    <section
      class="vd-stack"
      data-gap="fib-13"
      aria-labelledby="profile-progress"
      data-testid="ts-profile-progress"
    >
      <h2 id="profile-progress">Learning progress</h2>
      <p class="vd-text-muted vd-text-sm">
        {{ summary.completedCount }} complete · {{ summary.inProgressCount }} in
        progress · {{ summary.lessonCount }} lessons in the curriculum
      </p>
      <ul
        class="vd-stack"
        data-gap="fib-8"
        style="list-style: none; padding: 0"
      >
        <li
          v-for="row in trackRows"
          :key="row.id"
          class="vd-stack"
          data-gap="fib-3"
        >
          <div
            class="vd-cluster"
            data-gap="fib-5"
            style="justify-content: space-between"
          >
            <span>{{ row.title }}</span>
            <span class="vd-text-muted vd-text-sm">
              {{ row.completed }} / {{ row.total }}
            </span>
          </div>
          <VdProgress
            :value="row.completed"
            :max="row.total"
            :label="`${row.completed} of ${row.total} complete`"
          />
        </li>
      </ul>
      <p class="vd-text-sm">
        Browse the
        <RouterLink to="/curriculum">curriculum map</RouterLink>
        to continue.
      </p>
    </section>

    <section
      class="vd-stack"
      data-gap="fib-13"
      aria-labelledby="profile-inventory"
      data-testid="ts-profile-inventory"
    >
      <h2 id="profile-inventory">Local data on this device</h2>
      <p class="vd-text-muted vd-text-sm">
        School keys, theme preferences, and any “model cached” flags Labs
        recorded. On-device LLM files may also live in Cache Storage or
        IndexedDB under names that look like webllm / mlc / litert / gemma —
        Clear all tries to delete those when the browser allows it.
      </p>
      <ul
        class="ts-profile-inventory-list"
        data-testid="ts-profile-inventory-list"
      >
        <li
          v-for="item in inventory"
          :key="item.key"
          :data-present="item.present ? 'true' : 'false'"
          :data-key="item.key"
        >
          <span>{{ item.label }}</span>
          <code class="vd-text-sm">{{ item.key }}</code>
          <span class="vd-text-muted vd-text-sm">{{
            item.present ? "present" : "absent"
          }}</span>
        </li>
      </ul>
      <details class="vd-text-sm">
        <summary>What Clear all cannot guarantee</summary>
        <ul>
          <li v-for="line in NON_CLEARABLE_SURFACES" :key="line">{{ line }}</li>
        </ul>
      </details>
    </section>

    <section
      class="vd-stack"
      data-gap="fib-8"
      aria-labelledby="profile-actions"
      data-testid="ts-profile-actions"
    >
      <h2 id="profile-actions">Export and clear</h2>
      <div class="vd-cluster" data-gap="fib-8">
        <VdButton data-testid="ts-profile-export" @click="onExport">
          Export all
        </VdButton>
        <VdButton
          variant="danger"
          data-testid="ts-profile-clear-notes"
          @click="onClearNotes"
        >
          Clear notes
        </VdButton>
        <VdButton
          variant="danger"
          data-testid="ts-profile-clear-all"
          @click="clearAllOpen = true"
        >
          Clear all…
        </VdButton>
      </div>
    </section>

    <VdModal
      :open="clearAllOpen"
      title="Clear all local school data?"
      data-testid="ts-profile-clear-all-modal"
      @close="clearAllOpen = false"
    >
      <div class="vd-stack" data-gap="fib-8">
        <p>
          This removes progress, notes, pin preferences, theme preferences this
          site can write, Terms acceptance, and any legacy AI risk key. Best-effort
          model cache deletion runs next — some browser caches may remain. You
          will need to accept the site terms again before continuing.
        </p>
        <div class="vd-cluster" data-gap="fib-8">
          <VdButton
            variant="danger"
            data-testid="ts-profile-clear-all-confirm"
            :loading="clearing"
            :disabled="clearing"
            @click="onConfirmClearAll"
          >
            Clear all
          </VdButton>
          <VdButton
            variant="ghost"
            data-testid="ts-profile-clear-all-cancel"
            :disabled="clearing"
            @click="clearAllOpen = false"
          >
            Cancel
          </VdButton>
        </div>
      </div>
    </VdModal>
  </section>
</template>

<style scoped>
.ts-profile-inventory-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--vd-space-fib-5, 0.5rem);
}

.ts-profile-inventory-list li {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1.6fr) auto;
  gap: var(--vd-space-fib-5, 0.5rem);
  align-items: baseline;
  padding: var(--vd-space-fib-5, 0.5rem) 0;
  border-bottom: 1px solid var(--vd-border-color, #e5e7eb);
}

@media (max-width: 40rem) {
  .ts-profile-inventory-list li {
    grid-template-columns: 1fr;
  }
}
</style>
