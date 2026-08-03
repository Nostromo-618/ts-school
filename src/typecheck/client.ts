/**
 * The main-thread side of the type-check worker.
 *
 * Nothing here imports `typescript`; the compiler lives behind
 * `new Worker(...)` and arrives as a separate chunk the browser only fetches
 * when a lesson page actually mounts.
 *
 * The client debounces so a keystroke burst becomes one check, correlates every
 * response to its request, and drops anything stale. `useTypecheck()` wraps it
 * for components: it creates the worker in `onMounted` and tears it down in
 * `onBeforeUnmount`, so prerendering and hydration produce nothing and throw
 * nothing.
 */

import {
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
  toValue,
  watch,
} from "vue";
import type { MaybeRefOrGetter, Ref } from "vue";

import type {
  TsDiagnostic,
  TypecheckErrorResponse,
  TypecheckOptions,
  TypecheckRequest,
  TypecheckResponse,
} from "./types";

/** Long enough that typing does not thrash, short enough to feel live. */
export const DEFAULT_DEBOUNCE_MS = 250;

/** `requestId` the worker uses for a message it could not attribute. */
const UNATTRIBUTED = -1;

/** The slice of `Worker` this client uses, so tests can supply a fake. */
export interface TypecheckWorkerLike {
  postMessage(message: TypecheckRequest): void;
  terminate(): void;
  onmessage: ((event: { data: unknown }) => void) | null;
  onerror: ((event: { message?: string }) => void) | null;
}

export interface TypecheckClientOptions {
  debounceMs?: number;
  onResponse?: (response: TypecheckResponse) => void;
  onError?: (response: TypecheckErrorResponse) => void;
  /** Test seam. Defaults to the real module worker. */
  createWorker?: () => TypecheckWorkerLike;
}

export interface TypecheckClient {
  /** False when the environment has no `Worker` — SSR, or a jsdom test. */
  readonly supported: boolean;
  /** Debounced. The last call within the window wins. */
  check(code: string, options?: TypecheckOptions): void;
  /** Skips the debounce. */
  checkNow(code: string, options?: TypecheckOptions): void;
  /** Drops a pending debounced check. Cannot stop one already dispatched. */
  cancel(): void;
  /** Stops the worker for good. Safe to call twice. */
  terminate(): void;
}

function isResponse(value: unknown): value is TypecheckResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as TypecheckResponse).diagnostics)
  );
}

function isErrorResponse(value: unknown): value is TypecheckErrorResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as TypecheckErrorResponse).error === "string"
  );
}

function defaultCreateWorker(): TypecheckWorkerLike {
  // Vite rewrites this exact shape into a worker chunk at build time, which is
  // what keeps the compiler out of every other chunk. The cast is the one
  // place the real `Worker` meets the narrow seam above.
  return new Worker(new URL("./worker.ts", import.meta.url), {
    type: "module",
  }) as unknown as TypecheckWorkerLike;
}

export function createTypecheckClient(
  options: TypecheckClientOptions = {},
): TypecheckClient {
  const debounceMs = options.debounceMs ?? DEFAULT_DEBOUNCE_MS;
  const createWorker = options.createWorker ?? defaultCreateWorker;
  const supported =
    options.createWorker !== undefined || typeof Worker !== "undefined";

  let worker: TypecheckWorkerLike | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let nextRequestId = 0;
  let latestRequestId = UNATTRIBUTED;
  let terminated = false;

  function handle(data: unknown): void {
    if (isErrorResponse(data)) {
      if (
        data.requestId === latestRequestId ||
        data.requestId === UNATTRIBUTED
      ) {
        options.onError?.(data);
      }
      return;
    }
    // Out-of-date answers are discarded rather than rendered: the learner has
    // typed since, and a late result would flash a diagnostic they already
    // fixed.
    if (isResponse(data) && data.requestId === latestRequestId) {
      options.onResponse?.(data);
    }
  }

  function ensureWorker(): TypecheckWorkerLike | undefined {
    if (terminated || !supported) return undefined;
    if (worker) return worker;

    worker = createWorker();
    worker.onmessage = (event) => handle(event.data);
    worker.onerror = (event) => {
      options.onError?.({
        requestId: latestRequestId,
        error: event.message ?? "the type-check worker failed to start",
      });
    };
    return worker;
  }

  function dispatch(code: string, checkOptions?: TypecheckOptions): void {
    const active = ensureWorker();
    if (!active) return;

    latestRequestId = ++nextRequestId;
    active.postMessage({
      requestId: latestRequestId,
      code,
      options: checkOptions,
    });
  }

  return {
    supported,

    check(code, checkOptions) {
      if (terminated) return;
      if (timer !== undefined) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = undefined;
        dispatch(code, checkOptions);
      }, debounceMs);
    },

    checkNow(code, checkOptions) {
      if (terminated) return;
      this.cancel();
      dispatch(code, checkOptions);
    },

    cancel() {
      if (timer !== undefined) clearTimeout(timer);
      timer = undefined;
    },

    terminate() {
      this.cancel();
      terminated = true;
      worker?.terminate();
      worker = undefined;
    },
  };
}

export interface UseTypecheckOptions {
  /** Compiler knobs the lesson controls. May be reactive. */
  options?: MaybeRefOrGetter<TypecheckOptions | undefined>;
  debounceMs?: number;
  /** Check once as soon as the worker exists. Defaults to true. */
  immediate?: boolean;
  /**
   * What `diagnostics` holds before the first answer — a lesson's prerendered
   * `expectedDiagnostics`, mapped, so the pane is not empty during hydration.
   */
  initialDiagnostics?: TsDiagnostic[];
  /** Test seam, forwarded to the client. */
  createWorker?: () => TypecheckWorkerLike;
}

export interface UseTypecheck {
  diagnostics: Ref<TsDiagnostic[]>;
  /** The last failure, or null. Diagnostics are left alone when one occurs. */
  error: Ref<string | null>;
  /** True from the moment the source changes until its answer arrives. */
  checking: Ref<boolean>;
  /** Wall-clock time the worker spent on the last check. */
  durationMs: Ref<number | null>;
  /** False on the server, before mount, and where `Worker` is absent. */
  supported: Ref<boolean>;
  /** Checks the current source immediately, skipping the debounce. */
  checkNow: () => void;
  /** Called automatically on mount inside a component. */
  start: () => void;
  /** Called automatically on unmount inside a component. */
  stop: () => void;
}

/**
 * Reactive diagnostics for a piece of source.
 *
 * ```ts
 * const code = ref(lesson.ts.code);
 * const { diagnostics, checking } = useTypecheck(code, {
 *   options: { libs: lesson.ts.libs },
 * });
 * ```
 *
 * Inside a component nothing else is required: the worker starts on mount and
 * is terminated on unmount. Outside one, call `start()` and `stop()` yourself.
 */
export function useTypecheck(
  source: MaybeRefOrGetter<string>,
  useOptions: UseTypecheckOptions = {},
): UseTypecheck {
  const diagnostics = ref<TsDiagnostic[]>([
    ...(useOptions.initialDiagnostics ?? []),
  ]) as Ref<TsDiagnostic[]>;
  const error = ref<string | null>(null);
  const checking = ref(false);
  const durationMs = ref<number | null>(null);
  const supported = ref(false);

  let client: TypecheckClient | undefined;
  let stopWatching: (() => void) | undefined;

  const currentOptions = (): TypecheckOptions | undefined =>
    toValue(useOptions.options);

  function start(): void {
    // `onMounted` never runs on the server, but `start()` is public, so the
    // guard is here too: SSR must produce nothing and throw nothing.
    if (client || typeof window === "undefined") return;

    client = createTypecheckClient({
      debounceMs: useOptions.debounceMs,
      createWorker: useOptions.createWorker,
      onResponse(response) {
        diagnostics.value = response.diagnostics;
        durationMs.value = response.durationMs;
        error.value = null;
        checking.value = false;
      },
      onError(response) {
        error.value = response.error;
        checking.value = false;
      },
    });
    supported.value = client.supported;
    if (!client.supported) return;

    stopWatching = watch(
      // The options object is compared by value: lesson data usually hands the
      // same literal back on every render, and identity churn should not
      // re-run the compiler.
      () =>
        [toValue(source), JSON.stringify(currentOptions() ?? null)] as const,
      ([code]) => {
        checking.value = true;
        client?.check(code, currentOptions());
      },
      { immediate: useOptions.immediate ?? true },
    );
  }

  function stop(): void {
    stopWatching?.();
    stopWatching = undefined;
    client?.terminate();
    client = undefined;
    checking.value = false;
  }

  function checkNow(): void {
    if (!client) return;
    checking.value = true;
    client.checkNow(toValue(source), currentOptions());
  }

  if (getCurrentInstance()) {
    onMounted(start);
    onBeforeUnmount(stop);
  }

  return {
    diagnostics,
    error,
    checking,
    durationMs,
    supported,
    checkNow,
    start,
    stop,
  };
}
