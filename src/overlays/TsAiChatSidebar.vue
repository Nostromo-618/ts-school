<script setup lang="ts">
/**
 * In-lesson AI assistant sidebar — local Gemma via Labs AiChat + school tools.
 * AiChat is dynamically imported so vite-ssg never evaluates browser-only code.
 */
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  watch,
  shallowRef,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { VdButton, VdIcon, VdProgress } from "@vanduo-oss/vd3";
import {
  SCHOOL_TOOL_DEFS,
  composeSchoolSystemExtra,
  createSchoolToolExecutor,
} from "@/ai/school-tools";
import { isSchoolInternalHref, renderAssistantHtml } from "@/ai/chat-markdown";
import {
  SCHOOL_DEFAULT_MODEL_ID,
  schoolModelOptionLabel,
  schoolModelRecommendHint,
} from "@/ai/school-model-picker";
import { useLessonEditorStore } from "@/stores/lessonEditor";

const props = defineProps<{
  open: boolean;
  pinned?: boolean;
}>();

const emit = defineEmits<{
  close: [];
  "toggle-pin": [];
}>();

const isPinned = computed(() => Boolean(props.pinned));
const pinLabel = computed(() =>
  isPinned.value ? "Unpin assistant" : "Pin assistant open",
);

const route = useRoute();
const router = useRouter();
const editor = useLessonEditorStore();

const lessonId = computed(() => {
  const id = route.params.lessonId;
  return typeof id === "string" ? id : null;
});

const modelId = ref(SCHOOL_DEFAULT_MODEL_ID);
const loaded = ref(false);
const loading = ref(false);
const streaming = ref(false);
const statusText = ref("Model not loaded");
const progressPct = ref(0);
const progressText = ref("");
const freezeHint = ref("");
const loadSource = ref<"cache" | "local" | "network" | "unknown" | "">("");
const errorText = ref("");
const inputText = ref("");
const messages = ref<Array<{ role: "user" | "assistant"; content: string }>>(
  [],
);
const messagesEl = ref<HTMLElement | null>(null);
const composerEl = ref<HTMLTextAreaElement | null>(null);
const gemmaModels = ref<Array<{ id: string; label: string }>>([
  {
    id: SCHOOL_DEFAULT_MODEL_ID,
    label: schoolModelOptionLabel(SCHOOL_DEFAULT_MODEL_ID),
  },
  {
    id: "gemma-4-E4B-it-web",
    label: schoolModelOptionLabel("gemma-4-E4B-it-web"),
  },
]);
const deviceMemoryGb = ref<number | null>(null);
const modelHint = computed(() =>
  schoolModelRecommendHint(deviceMemoryGb.value),
);

/** Focus the composer when it is usable; no-op if closed or disabled. */
function focusComposer(): void {
  void nextTick(() => {
    if (!props.open) return;
    const el = composerEl.value;
    if (!el || el.disabled) return;
    el.focus();
  });
}

type LoadProgressEvent = {
  stage?: string;
  message?: string;
  text?: string;
  loaded?: number;
  source?: "cache" | "local" | "network" | "unknown";
};

type DescribeLoadProgress = (
  data: LoadProgressEvent | Record<string, unknown> | null | undefined,
  options?: { likelyCached?: boolean; freezeHint?: string },
) => {
  stage: string;
  progressPct: number;
  progressText: string;
  statusText: string;
  statusTone: "muted" | "warn" | "ok" | "danger";
  freezeHint: string;
  source: "cache" | "local" | "network" | "unknown";
};

type AiChatInstance = {
  registerTools: (defs: unknown[]) => void;
  setSystemPromptOptions: (options: Record<string, unknown>) => void;
  setModelId: (
    modelId: string,
    options?: { resetMessages?: boolean; force?: boolean },
  ) => Promise<void>;
  load: () => Promise<void>;
  generate: (
    text: string,
    onUpdate?: (partial: string) => void,
  ) => Promise<string>;
  generateWithTools: (
    text: string,
    options: {
      execute: (
        name: string,
        args: Record<string, unknown>,
      ) => unknown | Promise<unknown>;
      maxRounds?: number;
      onUpdate?: (partial: string) => void;
      onFinish?: (usage: unknown) => void;
      onTool?: (info: unknown) => void;
    },
  ) => Promise<string>;
  onProgress: (cb: (data: LoadProgressEvent) => void) => () => void;
  isLoaded?: () => boolean;
  dispose: () => Promise<void>;
};

const chatRef = shallowRef<AiChatInstance | null>(null);
let toolsUnsupportedError =
  "Tool calling is only supported on LiteRT Gemma (E2B/E4B) models.";
let describeLoadProgress: DescribeLoadProgress | null = null;
let progressUnsub: (() => void) | null = null;

const sourceBadgeLabel = computed(() => {
  if (loadSource.value === "local") return "Local /models";
  if (loadSource.value === "cache") return "From cache";
  if (loadSource.value === "network") return "From web";
  return "";
});

function clearProgressUi(): void {
  progressPct.value = 0;
  progressText.value = "";
  freezeHint.value = "";
  loadSource.value = "";
}

function applyProgress(data: LoadProgressEvent): void {
  try {
    if (!describeLoadProgress) {
      if (typeof data.message === "string" && data.message) {
        statusText.value = data.message;
      }
      return;
    }
    const described = describeLoadProgress(data);
    if (described.stage === "error") {
      clearProgressUi();
      statusText.value = "Error";
      return;
    }
    progressPct.value = described.progressPct;
    progressText.value = described.progressText;
    freezeHint.value = described.freezeHint;
    statusText.value = described.statusText;
    loadSource.value = described.source === "unknown" ? "" : described.source;
  } catch {
    if (typeof data.message === "string" && data.message) {
      statusText.value = data.message;
    }
  }
}

async function loadAiModule() {
  const mod = await import("@vanduo-oss/vdl-engines/ai-chat.js");
  toolsUnsupportedError = mod.TOOLS_UNSUPPORTED_ERROR;
  describeLoadProgress = mod.describeLoadProgress;
  const official = (mod.MODEL_OPTIONS || []).filter(
    (m) => m.backend === "litert" && m.litertKind === "web-official",
  );
  if (official.length) {
    gemmaModels.value = official.map((m) => ({
      id: String(m.id),
      label: schoolModelOptionLabel(String(m.id)),
    }));
  }
  return mod;
}

async function ensureChat(): Promise<AiChatInstance> {
  if (chatRef.value) return chatRef.value;
  const mod = await loadAiModule();
  const instance = new mod.AiChat({
    modelId: modelId.value,
    toolProtocol: "auto",
    loadLiteRT: async () => import("@litert-lm/core"),
    // CSP script-src 'self' blocks the package default (jsDelivr WASM glue).
    liteRtWasmPath: `${import.meta.env.BASE_URL}litert-wasm/`,
    systemPromptOptions: {
      product: "TypeScript School",
      extra: composeSchoolSystemExtra({
        path: route.path,
        lessonId: lessonId.value,
      }),
    },
  }) as AiChatInstance;
  instance.registerTools([...SCHOOL_TOOL_DEFS]);
  chatRef.value = instance;
  return instance;
}

function refreshSystemPrompt(instance: AiChatInstance): void {
  instance.setSystemPromptOptions({
    product: "TypeScript School",
    extra: composeSchoolSystemExtra({
      path: route.path,
      lessonId: lessonId.value,
    }),
  });
}

async function loadModel(): Promise<void> {
  errorText.value = "";
  loading.value = true;
  clearProgressUi();
  statusText.value = "Loading…";
  progressText.value = "Initializing LiteRT WebGPU engine…";
  try {
    const instance = await ensureChat();
    await instance.setModelId(modelId.value, {
      resetMessages: true,
      force: true,
    });
    refreshSystemPrompt(instance);
    instance.registerTools([...SCHOOL_TOOL_DEFS]);
    if (progressUnsub) {
      progressUnsub();
      progressUnsub = null;
    }
    progressUnsub = instance.onProgress((p) => {
      applyProgress(p);
    });
    await instance.load();
    if (typeof instance.isLoaded === "function" && !instance.isLoaded()) {
      throw new Error("Model load did not complete.");
    }
    loaded.value = true;
    statusText.value = "Ready";
    clearProgressUi();
    messages.value = [];
  } catch (err) {
    errorText.value = err instanceof Error ? err.message : String(err);
    statusText.value = "Load failed";
    loaded.value = false;
    clearProgressUi();
  } finally {
    if (progressUnsub) {
      progressUnsub();
      progressUnsub = null;
    }
    loading.value = false;
    if (loaded.value) focusComposer();
  }
}

async function send(): Promise<void> {
  const text = inputText.value.trim();
  if (!text || streaming.value || !loaded.value || !chatRef.value) return;
  inputText.value = "";
  messages.value.push({ role: "user", content: text });
  streaming.value = true;
  errorText.value = "";
  let assistant = "";
  messages.value.push({ role: "assistant", content: "" });
  const idx = messages.value.length - 1;
  const chat = chatRef.value;
  try {
    refreshSystemPrompt(chat);
    const execute = createSchoolToolExecutor({
      router,
      getLessonId: () => lessonId.value,
    });
    const reply = await chat.generateWithTools(text, {
      execute,
      maxRounds: 4,
      onUpdate: (partial: string) => {
        assistant = partial;
        messages.value[idx] = { role: "assistant", content: assistant };
        void nextTick(() => {
          if (messagesEl.value) {
            messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
          }
        });
      },
    });
    messages.value[idx] = { role: "assistant", content: reply };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message === toolsUnsupportedError) {
      try {
        const reply = await chat.generate(text, (partial: string) => {
          messages.value[idx] = { role: "assistant", content: partial };
        });
        messages.value[idx] = { role: "assistant", content: reply };
      } catch (inner) {
        errorText.value =
          inner instanceof Error ? inner.message : String(inner);
        messages.value.pop();
        messages.value.pop();
      }
    } else {
      errorText.value = message;
      messages.value.pop();
      messages.value.pop();
    }
  } finally {
    streaming.value = false;
    focusComposer();
  }
}

function onComposerKey(event: KeyboardEvent): void {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    void send();
  }
}

function acceptEdit(): void {
  editor.acceptPending();
  focusComposer();
}

function rejectEdit(): void {
  editor.rejectPending();
  focusComposer();
}

function onMessagesClick(event: MouseEvent): void {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const anchor = target.closest("a");
  if (!(anchor instanceof HTMLAnchorElement)) return;
  const href = anchor.getAttribute("href");
  if (!href || !isSchoolInternalHref(href)) return;
  event.preventDefault();
  void router.push(href);
}

watch(
  () => props.open,
  (open) => {
    if (!open) return;
    errorText.value = "";
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.deviceMemory === "number"
    ) {
      deviceMemoryGb.value = navigator.deviceMemory;
    }
    // Focus when reopening with an already-loaded model (textarea remounts).
    focusComposer();
  },
);

onBeforeUnmount(() => {
  if (progressUnsub) {
    progressUnsub();
    progressUnsub = null;
  }
  void chatRef.value?.dispose();
  chatRef.value = null;
});
</script>

<template>
  <aside
    v-if="open"
    class="ts-ai-sidebar"
    :class="{ 'is-pinned': isPinned }"
    aria-label="Lesson AI assistant"
    data-testid="ts-ai-sidebar"
    :data-pinned="isPinned ? 'true' : 'false'"
    :aria-busy="loading ? 'true' : 'false'"
  >
    <header class="ts-ai-sidebar-header">
      <VdIcon name="chat-circle" aria-hidden="true" />
      <div class="vd-stack" data-gap="fib-3" style="flex: 1">
        <strong>Ask TypeScript School</strong>
        <span class="vd-text-muted vd-text-sm" data-testid="ts-ai-status">{{
          statusText
        }}</span>
      </div>
      <VdButton
        variant="ghost"
        size="sm"
        :aria-label="pinLabel"
        :aria-pressed="isPinned"
        data-testid="ts-ai-pin"
        @click="emit('toggle-pin')"
      >
        <VdIcon name="push-pin" :filled="isPinned" aria-hidden="true" />
      </VdButton>
      <VdButton
        variant="ghost"
        size="sm"
        aria-label="Close assistant"
        data-testid="ts-ai-close"
        @click="emit('close')"
      >
        Close
      </VdButton>
    </header>

    <div class="ts-ai-sidebar-header" style="border-bottom: 0">
      <label class="vd-text-sm" for="ts-ai-model">Model</label>
      <select
        id="ts-ai-model"
        v-model="modelId"
        class="vd-input"
        :disabled="loading || streaming"
        data-testid="ts-ai-model"
      >
        <option v-for="model in gemmaModels" :key="model.id" :value="model.id">
          {{ model.label }}
        </option>
      </select>
      <VdButton
        size="sm"
        :disabled="loading || streaming"
        :loading="loading"
        data-testid="ts-ai-load"
        @click="loadModel"
      >
        {{ loaded ? "Reload" : "Load model" }}
      </VdButton>
    </div>
    <p
      class="vd-text-sm vd-text-muted ts-ai-model-hint"
      data-testid="ts-ai-model-hint"
    >
      {{ modelHint }}
    </p>

    <div
      v-if="loading || progressText"
      class="ts-ai-load-progress"
      role="status"
      aria-live="polite"
      data-testid="ts-ai-load-progress"
    >
      <div
        v-if="sourceBadgeLabel"
        class="ts-ai-load-source"
        :data-source="loadSource"
      >
        {{ sourceBadgeLabel }}
      </div>
      <VdProgress :value="progressPct" />
      <div class="vd-text-sm vd-text-muted" data-testid="ts-ai-progress-text">
        {{ progressText }}
      </div>
      <p
        v-if="freezeHint"
        class="ts-ai-freeze-hint"
        data-testid="ts-ai-freeze-hint"
      >
        {{ freezeHint }}
      </p>
    </div>

    <p
      v-if="errorText"
      class="vd-text-sm"
      style="padding: 0 1.3rem; color: var(--vd-color-danger, #b91c1c)"
    >
      {{ errorText }}
    </p>

    <div
      v-if="editor.hasPendingEdit"
      class="ts-ai-pending-edit"
      data-testid="ts-ai-pending-edit"
    >
      <strong>Proposed editor change</strong>
      <p class="vd-text-sm vd-text-muted">
        The assistant queued an edit. Accept to apply it to the
        {{ editor.pendingExerciseEdit ? "exercise" : "TypeScript" }} pane.
      </p>
      <div class="vd-cluster" data-gap="fib-5">
        <VdButton size="sm" data-testid="ts-ai-accept-edit" @click="acceptEdit">
          Accept
        </VdButton>
        <VdButton
          size="sm"
          variant="ghost"
          data-testid="ts-ai-reject-edit"
          @click="rejectEdit"
        >
          Reject
        </VdButton>
      </div>
    </div>

    <div
      ref="messagesEl"
      class="ts-ai-messages"
      data-testid="ts-ai-messages"
      @click="onMessagesClick"
    >
      <div v-if="messages.length === 0" class="vd-text-muted vd-text-sm">
        Load Gemma 4 E2B/E4B locally, then ask about this lesson. Tools can
        search the curriculum and propose TS pane edits (with your
        confirmation).
      </div>
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="ts-ai-bubble"
        :class="msg.role === 'user' ? 'is-user' : 'is-assistant'"
        data-testid="ts-ai-bubble"
        :data-role="msg.role"
      >
        <template v-if="msg.role === 'user'">{{ msg.content }}</template>
        <!-- Escaped Labs markdown only (labsMarkdownToHtml); not raw model HTML. -->
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div
          v-else
          class="ts-ai-bubble-md"
          data-testid="ts-ai-bubble-md"
          v-html="renderAssistantHtml(msg.content)"
        />
      </div>
    </div>

    <footer class="ts-ai-sidebar-footer">
      <textarea
        ref="composerEl"
        v-model="inputText"
        rows="3"
        class="vd-input"
        placeholder="Ask about this lesson… (Enter to send)"
        :disabled="!loaded || loading || streaming"
        data-testid="ts-ai-input"
        @keydown="onComposerKey"
      />
      <VdButton
        :disabled="!loaded || loading || streaming || !inputText.trim()"
        data-testid="ts-ai-send"
        @click="send"
      >
        Send
      </VdButton>
    </footer>
  </aside>
</template>
