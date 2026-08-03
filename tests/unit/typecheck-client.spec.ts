import { defineComponent, h, nextTick, ref } from "vue";
import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createTypecheckClient,
  DEFAULT_DEBOUNCE_MS,
  useTypecheck,
} from "@/typecheck/client";
import type { TypecheckWorkerLike } from "@/typecheck/client";
import type {
  TsDiagnostic,
  TypecheckErrorResponse,
  TypecheckRequest,
  TypecheckResponse,
} from "@/typecheck/types";

class FakeWorker implements TypecheckWorkerLike {
  onmessage: ((event: { data: unknown }) => void) | null = null;
  onerror: ((event: { message?: string }) => void) | null = null;
  readonly sent: TypecheckRequest[] = [];
  terminated = false;

  postMessage(message: TypecheckRequest): void {
    this.sent.push(message);
  }

  terminate(): void {
    this.terminated = true;
  }

  reply(response: TypecheckResponse | TypecheckErrorResponse): void {
    this.onmessage?.({ data: response });
  }

  answer(requestId: number, diagnostics: TsDiagnostic[] = []): void {
    this.reply({ requestId, diagnostics, durationMs: 1 });
  }
}

const diagnostic: TsDiagnostic = {
  code: 2322,
  category: "error",
  message: `Type 'string' is not assignable to type 'number'.`,
  line: 1,
  column: 7,
  length: 5,
};

let worker: FakeWorker;

beforeEach(() => {
  vi.useFakeTimers();
  worker = new FakeWorker();
});

afterEach(() => {
  vi.useRealTimers();
});

function client(overrides: Parameters<typeof createTypecheckClient>[0] = {}) {
  return createTypecheckClient({ createWorker: () => worker, ...overrides });
}

describe("typecheck client", () => {
  it("collapses a burst of keystrokes into one check", () => {
    const subject = client();

    for (const source of ["c", "co", "con", "cons", "const", "const x"]) {
      subject.check(source);
      vi.advanceTimersByTime(20);
    }
    expect(worker.sent).toHaveLength(0);

    vi.advanceTimersByTime(DEFAULT_DEBOUNCE_MS);

    expect(worker.sent).toHaveLength(1);
    expect(worker.sent[0].code).toBe("const x");
  });

  it("does not create a worker until something is dispatched", () => {
    let created = 0;
    const subject = createTypecheckClient({
      createWorker: () => {
        created += 1;
        return worker;
      },
    });

    subject.check("const a = 1;");
    expect(created).toBe(0);

    vi.advanceTimersByTime(DEFAULT_DEBOUNCE_MS);
    expect(created).toBe(1);
  });

  it("numbers requests monotonically", () => {
    const subject = client();

    subject.checkNow("a");
    subject.checkNow("b");
    subject.checkNow("c");

    expect(worker.sent.map((request) => request.requestId)).toEqual([1, 2, 3]);
  });

  it("discards a response the learner has already typed past", () => {
    const onResponse = vi.fn();
    const subject = client({ onResponse });

    subject.checkNow("first");
    subject.checkNow("second");

    worker.answer(1, [diagnostic]);
    expect(onResponse).not.toHaveBeenCalled();

    worker.answer(2, []);
    expect(onResponse).toHaveBeenCalledTimes(1);
    expect(onResponse.mock.calls[0][0].requestId).toBe(2);
  });

  it("forwards an error for the current request", () => {
    const onError = vi.fn();
    const subject = client({ onError });

    subject.checkNow("const a = 1;");
    worker.reply({ requestId: 1, error: "lib load failed" });

    expect(onError).toHaveBeenCalledWith({
      requestId: 1,
      error: "lib load failed",
    });
  });

  it("forwards an error the worker could not attribute to a request", () => {
    const onError = vi.fn();
    const subject = client({ onError });

    subject.checkNow("const a = 1;");
    worker.reply({ requestId: -1, error: "malformed type-check request" });

    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("reports a worker that fails to start", () => {
    const onError = vi.fn();
    const subject = client({ onError });

    subject.checkNow("const a = 1;");
    worker.onerror?.({ message: "boom" });

    expect(onError.mock.calls[0][0].error).toBe("boom");
  });

  it("cancels a pending check without touching the worker", () => {
    const subject = client();

    subject.check("const a = 1;");
    subject.cancel();
    vi.advanceTimersByTime(DEFAULT_DEBOUNCE_MS * 4);

    expect(worker.sent).toHaveLength(0);
  });

  it("terminates the worker and stays quiet afterwards", () => {
    const onResponse = vi.fn();
    const subject = client({ onResponse });

    subject.checkNow("const a = 1;");
    subject.check("const a = 2;");
    subject.terminate();
    vi.advanceTimersByTime(DEFAULT_DEBOUNCE_MS * 4);

    expect(worker.terminated).toBe(true);
    expect(worker.sent).toHaveLength(1);

    subject.check("const a = 3;");
    vi.advanceTimersByTime(DEFAULT_DEBOUNCE_MS * 4);
    expect(worker.sent).toHaveLength(1);
  });

  it("reports itself unsupported where there is no Worker", () => {
    // jsdom ships none, which is also the shape of the server-side path.
    expect(typeof Worker).toBe("undefined");

    const subject = createTypecheckClient();

    expect(subject.supported).toBe(false);
    expect(() => subject.checkNow("const a = 1;")).not.toThrow();
  });
});

describe("useTypecheck", () => {
  function mountHarness(source = 'const total: number = "12";') {
    const code = ref(source);
    let api: ReturnType<typeof useTypecheck> | undefined;

    const wrapper = mount(
      defineComponent({
        setup() {
          api = useTypecheck(code, {
            createWorker: () => worker,
            debounceMs: 10,
          });
          return () => h("div");
        },
      }),
    );

    return { code, wrapper, api: api as ReturnType<typeof useTypecheck> };
  }

  it("checks on mount and exposes the result reactively", async () => {
    const { api } = mountHarness();
    await nextTick();

    expect(api.supported.value).toBe(true);
    expect(api.checking.value).toBe(true);

    vi.advanceTimersByTime(20);
    expect(worker.sent).toHaveLength(1);

    worker.reply({ requestId: 1, diagnostics: [diagnostic], durationMs: 4.2 });
    await nextTick();

    expect(api.diagnostics.value).toEqual([diagnostic]);
    expect(api.durationMs.value).toBe(4.2);
    expect(api.checking.value).toBe(false);
    expect(api.error.value).toBeNull();
  });

  it("re-checks when the source changes", async () => {
    const { code } = mountHarness();
    await nextTick();
    vi.advanceTimersByTime(20);

    code.value = "const total: number = 12;";
    await nextTick();
    vi.advanceTimersByTime(20);

    expect(worker.sent.map((request) => request.code)).toEqual([
      'const total: number = "12";',
      "const total: number = 12;",
    ]);
  });

  it("keeps the last diagnostics and surfaces the message when a check fails", async () => {
    const { api } = mountHarness();
    await nextTick();
    vi.advanceTimersByTime(20);
    worker.reply({ requestId: 1, diagnostics: [diagnostic], durationMs: 1 });
    await nextTick();

    worker.reply({
      requestId: 1,
      error: "the standard library failed to load",
    });
    await nextTick();

    expect(api.error.value).toBe("the standard library failed to load");
    expect(api.diagnostics.value).toEqual([diagnostic]);
    expect(api.checking.value).toBe(false);
  });

  it("starts from the prerendered diagnostics it was given", () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          const api = useTypecheck(ref("const a = 1;"), {
            createWorker: () => worker,
            immediate: false,
            initialDiagnostics: [diagnostic],
          });
          return () => h("pre", String(api.diagnostics.value.length));
        },
      }),
    );

    expect(wrapper.text()).toBe("1");
    expect(worker.sent).toHaveLength(0);
  });

  it("terminates the worker when the component unmounts", async () => {
    const { wrapper } = mountHarness();
    await nextTick();
    vi.advanceTimersByTime(20);

    wrapper.unmount();

    expect(worker.terminated).toBe(true);
  });

  it("does nothing at all until started outside a component", () => {
    const api = useTypecheck(ref("const a = 1;"), {
      createWorker: () => worker,
    });

    expect(api.supported.value).toBe(false);
    expect(api.diagnostics.value).toEqual([]);
    expect(worker.sent).toHaveLength(0);

    api.start();
    vi.advanceTimersByTime(DEFAULT_DEBOUNCE_MS);
    expect(worker.sent).toHaveLength(1);

    api.stop();
    expect(worker.terminated).toBe(true);
  });
});
