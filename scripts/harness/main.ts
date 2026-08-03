/**
 * Verification harness for the type-check engine. Not part of the site.
 *
 * Type into the pane and real diagnostics come back from a real compiler in a
 * real worker. The two buttons produce the numbers reported for this change:
 * round-trip latency (cold, then warm) and the bytes the standard library
 * actually costs over the wire.
 */

import { createApp, defineComponent, h, ref } from "vue";

import {
  createTypecheckClient,
  tsLibUrl,
  TS_LIB_MANIFEST,
  useTypecheck,
} from "@/typecheck";
import type { TsLibManifest, TypecheckResponse } from "@/typecheck";

const INITIAL_CODE = [
  "interface User {",
  "  id: number;",
  "  name: string;",
  "}",
  "",
  "function greet(user: User) {",
  "  return `Hello, ${user.name.toUpperCase()}`;",
  "}",
  "",
  "greet({ id: 1, name: 42 });",
].join("\n");

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

const Harness = defineComponent({
  setup() {
    const code = ref(INITIAL_CODE);
    const { diagnostics, checking, error, durationMs, supported } =
      useTypecheck(code);

    const latency = ref("not measured");
    const payload = ref("not measured");

    async function measureLatency(): Promise<void> {
      latency.value = "measuring…";

      let settle: ((response: TypecheckResponse) => void) | undefined;
      let fail: ((reason: string) => void) | undefined;
      // A dedicated client, so the first measurement is a genuine cold start:
      // worker boot, compiler parse, lib fetch and first program build.
      const client = createTypecheckClient({
        debounceMs: 0,
        onResponse: (response) => settle?.(response),
        onError: (response) => fail?.(response.error),
      });

      const run = (source: string): Promise<[number, number]> =>
        new Promise((resolve, reject) => {
          const startedAt = performance.now();
          settle = (response) =>
            resolve([performance.now() - startedAt, response.durationMs]);
          fail = reject;
          client.checkNow(source);
        });

      try {
        const [coldTotal, coldWorker] = await run(code.value);

        const warm: number[] = [];
        const inWorker: number[] = [];
        for (let index = 0; index < 20; index += 1) {
          const [total, worker] = await run(
            `${code.value}\nconst edit${index} = ${index};`,
          );
          warm.push(total);
          inWorker.push(worker);
        }

        latency.value = [
          `cold ${coldTotal.toFixed(0)} ms round trip (${coldWorker.toFixed(0)} ms in worker)`,
          `warm median ${median(warm).toFixed(1)} ms round trip`,
          `(worker ${median(inWorker).toFixed(1)} ms, min ${Math.min(...warm).toFixed(1)}, max ${Math.max(...warm).toFixed(1)}, n=20)`,
        ].join(" · ");
      } catch (reason) {
        latency.value = `failed: ${String(reason)}`;
      } finally {
        client.terminate();
      }
    }

    // The lib files are fetched inside the worker, whose resource timings the
    // main thread cannot see, so this reports what the manifest says each
    // closure costs rather than pretending to observe the transfer. Use the
    // browser's network panel for on-the-wire numbers.
    async function measurePayload(): Promise<void> {
      payload.value = "measuring…";
      try {
        const response = await fetch(tsLibUrl(TS_LIB_MANIFEST));
        const manifest = (await response.json()) as TsLibManifest;

        const describe = (label: string, fileNames: string[]) => {
          const bytes = fileNames.reduce(
            (total, fileName) => total + manifest.files[fileName].bytes,
            0,
          );
          return `${label} ${fileNames.length} files / ${(bytes / 1024).toFixed(0)} KB`;
        };

        const baseline = manifest.closures.es2022;
        const domOnly = [
          ...new Set([
            ...manifest.closures.dom,
            ...manifest.closures["dom.iterable"],
          ]),
        ].filter((fileName) => !baseline.includes(fileName));

        payload.value = `${describe("baseline", baseline)} · ${describe("dom adds", domOnly)}`;
      } catch (reason) {
        payload.value = `failed: ${String(reason)}`;
      }
    }

    return () =>
      h(
        "main",
        {
          style:
            "font: 14px/1.5 ui-monospace, monospace; margin: 2rem; max-width: 60rem",
        },
        [
          h("h1", { style: "font-size: 1.1rem" }, "typecheck worker harness"),
          h("p", `worker supported: ${supported.value}`),
          h("textarea", {
            value: code.value,
            rows: 14,
            spellcheck: false,
            "aria-label": "TypeScript source",
            style: "width: 100%; font: inherit; padding: 0.5rem",
            onInput: (event: Event) => {
              code.value = (event.target as HTMLTextAreaElement).value;
            },
          }),
          h(
            "p",
            { id: "status" },
            checking.value
              ? "checking…"
              : `${diagnostics.value.length} diagnostic(s)` +
                  (durationMs.value === null
                    ? ""
                    : ` in ${durationMs.value.toFixed(1)} ms`),
          ),
          error.value
            ? h("p", { style: "color: #b00" }, `error: ${error.value}`)
            : null,
          h(
            "ul",
            { id: "diagnostics" },
            diagnostics.value.map((diagnostic) =>
              h(
                "li",
                { style: "white-space: pre-wrap" },
                `TS${diagnostic.code} ${diagnostic.line}:${diagnostic.column} (len ${diagnostic.length}) — ${diagnostic.message}`,
              ),
            ),
          ),
          h("hr"),
          h("p", [
            h(
              "button",
              { id: "measure-latency", onClick: measureLatency },
              "measure latency",
            ),
            " ",
            h(
              "button",
              { id: "measure-payload", onClick: measurePayload },
              "measure lib payload",
            ),
          ]),
          h("p", { id: "latency" }, `latency: ${latency.value}`),
          h("p", { id: "payload" }, `payload: ${payload.value}`),
        ],
      );
  },
});

createApp(Harness).mount("#app");
