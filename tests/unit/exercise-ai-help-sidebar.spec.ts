import { nextTick } from "vue";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";

vi.mock("@vanduo-oss/vdl-ai-chat", () => {
  class AiChat {
    registerTools(): void {}
    setSystemPromptOptions(): void {}
    async setModelId(): Promise<void> {}
    async load(): Promise<void> {}
    isLoaded(): boolean {
      return true;
    }
    onProgress(): () => void {
      return () => {};
    }
    async generate(
      _text: string,
      onUpdate?: (partial: string) => void,
    ): Promise<string> {
      onUpdate?.("reply");
      return "reply";
    }
    async generateWithTools(
      _text: string,
      options: { onUpdate?: (partial: string) => void },
    ): Promise<string> {
      options.onUpdate?.("reply");
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

describe("exercise AI help auto-send", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("auto-sends a queued help prompt when the model is already Ready", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: "/", component: { template: "<div />" } }],
    });
    await router.push("/");
    await router.isReady();

    const wrapper = mount(TsAiChatSidebar, {
      props: { open: true },
      global: {
        plugins: [router],
        stubs: {
          VdButton: {
            template:
              '<button v-bind="$attrs" @click="$emit(\'click\')"><slot /></button>',
          },
          VdIcon: true,
          VdProgress: true,
        },
      },
    });

    await wrapper.get('[data-testid="ts-ai-load"]').trigger("click");
    await flushPromises();
    await nextTick();
    expect(wrapper.get('[data-testid="ts-ai-status"]').text()).toBe("Ready");

    const store = useAiChatStore();
    store.queueComposerPrompt(
      "Help me with exercise\n## My current code\nfunction nope() {}",
      { autoSend: true },
    );
    await flushPromises();
    await nextTick();
    await flushPromises();

    const userBubble = wrapper
      .findAll('[data-testid="ts-ai-bubble"]')
      .find((b) => b.attributes("data-role") === "user");
    expect(userBubble?.text()).toContain("Help me with exercise");
    expect(userBubble?.text()).toContain("function nope()");
    wrapper.unmount();
  });
});
