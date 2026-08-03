/**
 * The type-check worker.
 *
 * THIS IS THE ONLY MODULE IN THE REPOSITORY THAT IMPORTS `typescript` AS A
 * VALUE. Keeping the 8.7 MB compiler behind a worker boundary is what keeps it
 * out of the main bundle and off the main thread; `host.ts` imports it as a
 * type only so nothing else can pull it in by accident.
 *
 * The worker parses and type-checks learner source. It never runs it: there is
 * no `eval`, no `Function`, no emit, and no dynamic import anywhere on this
 * path.
 */

import * as ts from "typescript";

import { createTypecheckSession, entryLibsFor } from "./host";
import { createLibLoader } from "./libs";
import type {
  TypecheckErrorResponse,
  TypecheckOptions,
  TypecheckRequest,
  TypecheckResponse,
} from "./types";

/**
 * Just enough of `DedicatedWorkerGlobalScope` to talk to the client. Pulling in
 * `lib.webworker.d.ts` would collide with the project's DOM lib on `self`,
 * `location`, `fetch` and friends, so the surface is declared locally instead.
 */
interface WorkerScope {
  addEventListener(
    type: "message",
    listener: (event: { data: unknown }) => void,
  ): void;
  postMessage(message: TypecheckResponse | TypecheckErrorResponse): void;
}

const scope = self as unknown as WorkerScope;

/**
 * A lesson pane is not a text editor for novels. Refusing an absurd paste keeps
 * one bad message from wedging the worker for seconds.
 */
const MAX_SOURCE_LENGTH = 100_000;

/** `requestId` used when a message is too malformed to attribute to one. */
const UNATTRIBUTED = -1;

const loader = createLibLoader();
const session = createTypecheckSession({ ts, libs: loader.files });

function isLibName(value: unknown): value is string {
  return typeof value === "string" && /^[a-z][a-z0-9.]*$/i.test(value);
}

function isOptions(value: unknown): value is TypecheckOptions | undefined {
  if (value === undefined) return true;
  if (typeof value !== "object" || value === null) return false;

  const options = value as TypecheckOptions;
  if (options.strict !== undefined && typeof options.strict !== "boolean") {
    return false;
  }
  if (options.libs !== undefined) {
    if (!Array.isArray(options.libs)) return false;
    if (!options.libs.every(isLibName)) return false;
  }
  return true;
}

function isRequest(value: unknown): value is TypecheckRequest {
  if (typeof value !== "object" || value === null) return false;

  const request = value as TypecheckRequest;
  return (
    Number.isFinite(request.requestId) &&
    typeof request.code === "string" &&
    request.code.length <= MAX_SOURCE_LENGTH &&
    isOptions(request.options)
  );
}

function describe(error: unknown): string {
  if (error instanceof Error) return error.message;
  return typeof error === "string" ? error : "unknown type-check failure";
}

async function run(request: TypecheckRequest): Promise<void> {
  const startedAt = performance.now();
  try {
    await loader.ensure(entryLibsFor(request.options));
    const { diagnostics } = session.check(request.code, request.options);
    scope.postMessage({
      requestId: request.requestId,
      diagnostics,
      durationMs: performance.now() - startedAt,
    });
  } catch (error) {
    scope.postMessage({
      requestId: request.requestId,
      error: describe(error),
    });
  }
}

// One check at a time, newest queued request wins. A worker cannot interrupt a
// synchronous `createProgram` — that would need a SharedArrayBuffer, which a
// static site with no cross-origin isolation cannot have — so superseded
// requests are dropped before they start rather than cancelled midway. The
// client discards their responses anyway.
let running = false;
let queued: TypecheckRequest | undefined;

async function drain(): Promise<void> {
  running = true;
  try {
    while (queued) {
      const next = queued;
      queued = undefined;
      await run(next);
    }
  } finally {
    running = false;
  }
}

scope.addEventListener("message", (event) => {
  const data = event.data;

  if (!isRequest(data)) {
    const requestId =
      typeof data === "object" &&
      data !== null &&
      Number.isFinite((data as TypecheckRequest).requestId)
        ? (data as TypecheckRequest).requestId
        : UNATTRIBUTED;
    scope.postMessage({
      requestId,
      error: "malformed type-check request",
    });
    return;
  }

  queued = data;
  if (!running) void drain();
});
