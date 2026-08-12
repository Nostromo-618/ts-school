import { nextTick } from "vue";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";
import {
  AI_CHAT_HISTORY_KEY,
  writeAiChatHistory,
} from "@/lib/ai-chat-history";

vi.mock("@vanduo-oss/vdl-ai-chat/guardrails/llm", () => ({
  LLM_BLOCK_MESSAGE: "labs input block",
  LLM_OUTPUT_BLOCK_MESSAGE: "labs output block",
  validateLlmInput: () => ({ allowed: true }),
  validateLlmOutput: () => ({ allowed: true }),
  normalizeJailbreakScanText: (t: string) => t,
  buildChatSystemPrompt: () => "",
}));

vi.mock("@vanduo-oss/vdl-ai-chat", () => {
  class AiChat {
    registerTools(): void {}
    setSystemPromptOptions(): void {}
    async setModelId(): Promise<void> {}
    async load(): Promise<void> {}
    isLoaded(): boolean {
      return false;
    }
    onProgress(): () => void {
      return () => {};
    }
    async generate(): Promise<string> {
      return "reply";
    }
    async generateWithTools(): Promise<string> {
      return "reply";
    }
    async dispose(): Promise<void> {}
  }

  return {
    AiChat,
    TOOLS_UNSUPPORTED_ERROR: "tools unsupported",
    describeLoadProgress: () => ({
      stage: "ready",
      progressPct: 100,
      progressText: "",
      statusText: "Ready",
      statusTone: "ok" as const,
      freezeHint: "",
      source: "cache" as const,
    }),
    MODEL_OPTIONS: [],
  };
});

vi.mock("@litert-lm/core", () => ({}));

import TsAiChatSidebar from "@/overlays/TsAiChatSidebar.vue";
import { useAiChatStore } from "@/stores/aiChat";

describe("TsAiChatSidebar chat history", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  async function mountSidebar(open = true) {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: "/", component: { template: "<div />" } }],
    });
    await router.push("/");
    await router.isReady();

    return mount(TsAiChatSidebar, {
      props: { open },
      global: {
        plugins: [router],
        stubs: {
          VdButton: {
            template:
              '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
          },
          VdIcon: true,
          VdProgress: true,
          VdAlert: { template: "<div><slot /></div>" },
        },
      },
      attachTo: document.body,
    });
  }

  it("hydrates persisted user bubbles on mount", async () => {
    writeAiChatHistory([{ role: "user", content: "Remember this question" }]);

    const wrapper = await mountSidebar(true);
    await nextTick();

    expect(wrapper.findAll('[data-testid="ts-ai-bubble"]')).toHaveLength(1);
    expect(wrapper.text()).toContain("Remember this question");
    wrapper.unmount();
  });

  it("clear chat button wipes bubbles and localStorage", async () => {
    writeAiChatHistory([{ role: "user", content: "Wipe me" }]);

    const wrapper = await mountSidebar(true);
    await nextTick();

    await wrapper.get('[data-testid="ts-ai-clear-chat"]').trigger("click");
    await nextTick();

    expect(wrapper.findAll('[data-testid="ts-ai-bubble"]')).toHaveLength(0);
    expect(localStorage.getItem(AI_CHAT_HISTORY_KEY)).toBeNull();
    wrapper.unmount();
  });

  it("reacts to store clearChatHistory via historyRevision", async () => {
    writeAiChatHistory([{ role: "user", content: "Profile cleared" }]);

    const wrapper = await mountSidebar(true);
    await flushPromises();
    await nextTick();
    expect(wrapper.findAll('[data-testid="ts-ai-bubble"]')).toHaveLength(1);

    const store = useAiChatStore();
    store.clearChatHistory();
    await nextTick();

    expect(wrapper.findAll('[data-testid="ts-ai-bubble"]')).toHaveLength(0);
    wrapper.unmount();
  });
});
