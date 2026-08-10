import { nextTick } from "vue";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";

vi.mock("@vanduo-oss/vdl-engines/ai-chat.js", () => {
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
    async generate(_text: string, onUpdate?: (partial: string) => void): Promise<string> {
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

describe("TsAiChatSidebar composer focus", () => {
  beforeEach(() => {
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
            template: "<button v-bind=\"$attrs\" @click=\"$emit('click')\"><slot /></button>",
          },
          VdIcon: true,
          VdProgress: true,
        },
      },
      attachTo: document.body,
    });
  }

  it("focuses the composer after load becomes Ready", async () => {
    const wrapper = await mountSidebar(true);
    const input = wrapper.get('[data-testid="ts-ai-input"]');
    expect((input.element as HTMLTextAreaElement).disabled).toBe(true);

    await wrapper.get('[data-testid="ts-ai-load"]').trigger("click");
    await flushPromises();
    await nextTick();

    const el = input.element as HTMLTextAreaElement;
    expect(el.disabled).toBe(false);
    expect(document.activeElement).toBe(el);
    wrapper.unmount();
  });

  it("re-focuses the composer after send completes", async () => {
    const wrapper = await mountSidebar(true);
    await wrapper.get('[data-testid="ts-ai-load"]').trigger("click");
    await flushPromises();
    await nextTick();

    const input = wrapper.get('[data-testid="ts-ai-input"]');
    await input.setValue("Hello");
    await wrapper.get('[data-testid="ts-ai-send"]').trigger("click");
    await flushPromises();
    await nextTick();

    expect(document.activeElement).toBe(input.element);
    wrapper.unmount();
  });

  it("re-focuses when reopened with a loaded model", async () => {
    const wrapper = await mountSidebar(true);
    await wrapper.get('[data-testid="ts-ai-load"]').trigger("click");
    await flushPromises();
    await nextTick();

    await wrapper.setProps({ open: false });
    await nextTick();
    expect(wrapper.find('[data-testid="ts-ai-input"]').exists()).toBe(false);

    await wrapper.setProps({ open: true });
    await nextTick();
    await nextTick();

    const input = wrapper.get('[data-testid="ts-ai-input"]');
    expect(document.activeElement).toBe(input.element);
    wrapper.unmount();
  });

  it("does not mount the composer when the sidebar is closed", async () => {
    const wrapper = await mountSidebar(false);
    expect(wrapper.find('[data-testid="ts-ai-input"]').exists()).toBe(false);
    wrapper.unmount();
  });

  it("leaves pending prompt in the composer when the model is not loaded", async () => {
    const { useAiChatStore } = await import("@/stores/aiChat");
    const store = useAiChatStore();
    store.queueComposerPrompt("Help with Make addTax compile", {
      autoSend: true,
    });

    const wrapper = await mountSidebar(true);
    await flushPromises();
    await nextTick();

    const input = wrapper.get('[data-testid="ts-ai-input"]');
    expect((input.element as HTMLTextAreaElement).value).toContain(
      "Make addTax compile",
    );
    expect((input.element as HTMLTextAreaElement).disabled).toBe(true);
    expect(wrapper.findAll('[data-testid="ts-ai-bubble"]')).toHaveLength(0);
    wrapper.unmount();
  });
});
