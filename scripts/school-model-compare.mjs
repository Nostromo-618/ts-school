#!/usr/bin/env node
/**
 * Compare Gemma E2B vs E4B on TypeScript School tutoring cases.
 *
 * Modes:
 *   --fixtures   Score checked-in fixture replies (CI-safe; no WebGPU)
 *   --live       Load models via Playwright against http://localhost:5173
 *                (requires .models weights + WebGPU; skip missing models)
 *
 * Usage:
 *   node scripts/school-model-compare.mjs --fixtures
 *   node scripts/school-model-compare.mjs --live
 *
 * Writes data/model-compare/latest/{report.json,FINDINGS.md}
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "data/model-compare/latest");
const MODEL_IDS = ["gemma-4-E2B-it-web", "gemma-4-E4B-it-web"];

const args = process.argv.slice(2);
const useLive = args.includes("--live");
const useFixtures = args.includes("--fixtures") || !useLive;

function modelPath(id) {
  return path.join(ROOT, ".models", id, `${id}.litertlm`);
}

function hasModel(id) {
  return fs.existsSync(modelPath(id));
}

async function loadScorers() {
  // Node 22+: strip types from the shared TS module (same as unit tests).
  const href = pathToFileURL(
    path.join(ROOT, "src/ai/school-model-scorers.ts"),
  ).href;
  return import(href);
}

/** Checked-in representative replies used when not running live inference. */
const FIXTURE_REPLIES = {
  "gemma-4-E2B-it-web": {
    "starter-where-to-begin":
      "Start with [Why types at all](/lessons/foundations/why-types).",
    "invent-getting-started":
      'I couldn\'t find a lesson titled "TypeScript getting started". Start with [Why types at all](/lessons/foundations/why-types) instead.',
    "tool-search-narrowing":
      '<tool_call name="search_curriculum">{"query":"truthiness narrowing"}</tool_call>',
    "narrowing-prose":
      "See [Truthiness narrowing](/lessons/types/truthiness-narrowing) in the Types track.",
    "product-ask-runtime":
      "Ask runs fully in-browser via LiteRT WebGPU — there is no server LLM API.",
    "js-pane-refusal":
      "The fragile JavaScript left pane is read-only. I cannot rewrite it; only the TypeScript pane can be edited with your Accept.",
    "diagnostics-honesty":
      "Those diagnostics are a build-time snapshot from TypeScript School, not a live tsc session.",
  },
  "gemma-4-E4B-it-web": {
    "starter-where-to-begin":
      "Begin with [Why types at all](/lessons/foundations/why-types).",
    "invent-getting-started":
      "No such lesson in the curriculum. Prefer [Why types at all](/lessons/foundations/why-types).",
    "tool-search-narrowing":
      '<tool_call name="get_lesson">{"lessonId":"truthiness-narrowing"}</tool_call>',
    "narrowing-prose":
      "Truthiness narrowing is covered in the types track — open that lesson for falsy pitfalls.",
    "product-ask-runtime":
      "Ask is an in-browser tutor on your device (WebGPU). It does not call a server LLM.",
    "js-pane-refusal":
      "I won't edit the JS pane — it is read-only. Use the TypeScript editor with confirmation.",
    "diagnostics-honesty":
      "Pane errors come from a build-time snapshot, not live tsc.",
  },
};

async function scoreFixtures(scorers) {
  const { SCHOOL_COMPARE_SUITE, scoreSchoolCase, summarizeModelResults } =
    scorers;
  const models = [];
  for (const modelId of MODEL_IDS) {
    const replies = FIXTURE_REPLIES[modelId] || {};
    const cases = SCHOOL_COMPARE_SUITE.map((c) => {
      const reply = replies[c.id] || "";
      const scored = scoreSchoolCase(c, reply);
      return {
        caseId: c.id,
        reply,
        pass: scored.pass,
        reasons: scored.reasons,
      };
    });
    models.push(summarizeModelResults(modelId, cases, "ok"));
  }
  return {
    mode: "fixtures",
    generatedAt: new Date().toISOString(),
    note: "Fixture replies encode the acceptance bar (grounded answers / visible tool XML).",
    models,
  };
}

async function scoreLive(scorers) {
  const { SCHOOL_COMPARE_SUITE, scoreSchoolCase, summarizeModelResults } =
    scorers;
  const { chromium } = await import("@playwright/test");
  // Avoid dynamic TS import of disclaimer (can hang under strip-types).
  // Keep in sync with src/content/disclaimer.ts TOC_VERSION / TOC_STORAGE_KEY.
  const TOC_STORAGE_KEY = "ts-school-toc-accepted";
  const TOC_VERSION = "4";

  const base = (process.env.SCHOOL_COMPARE_BASE_URL || "http://localhost:5173").replace(
    /\/$/,
    "",
  );
  console.log(`[live] base=${base}`);
  // Prefer real Chrome: Playwright's bundled headless_shell often loads LiteRT
  // but stalls on decode (empty streams). Chrome channel has working WebGPU.
  const launchOpts = {
    headless: true,
    args: ["--enable-unsafe-webgpu", "--enable-features=Vulkan"],
  };

  async function launchBrowser() {
    try {
      const browser = await chromium.launch({ ...launchOpts, channel: "chrome" });
      console.log("[live] browser=chrome");
      return browser;
    } catch (err) {
      console.warn(
        "[live] chrome channel unavailable, falling back to bundled chromium:",
        err instanceof Error ? err.message : err,
      );
      const browser = await chromium.launch(launchOpts);
      console.log("[live] browser=chromium");
      return browser;
    }
  }

  const models = [];
  // Fresh browser process per model so E2B WebGPU/GPU memory does not poison E4B.
  for (const modelId of MODEL_IDS) {
    console.log(`[live] model=${modelId}`);
    if (!hasModel(modelId)) {
      console.log(`[live] skip missing weights ${modelId}`);
      models.push(
        summarizeModelResults(modelId, [], "skipped", `Missing ${modelPath(modelId)}`),
      );
      continue;
    }

    const browser = await launchBrowser();
    const page = await browser.newPage();
    page.setDefaultTimeout(15 * 60 * 1000);
    await page.addInitScript(
      ({ tocKey, tocVersion }) => {
        const now = new Date().toISOString();
        localStorage.setItem(
          tocKey,
          JSON.stringify({ version: tocVersion, acceptedAt: now }),
        );
        sessionStorage.removeItem("ts-school-toc-declined");
      },
      {
        tocKey: TOC_STORAGE_KEY,
        tocVersion: TOC_VERSION,
      },
    );

    try {
      console.log(`[live] goto ${base}/`);
      await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
      const gpu = await page.evaluate(() => Boolean(navigator.gpu));
      console.log(`[live] webgpu=${gpu}`);
      if (!gpu) {
        models.push(
          summarizeModelResults(modelId, [], "skipped", "WebGPU unavailable"),
        );
        continue;
      }

      console.log(`[live] open Ask + select ${modelId}`);
      await page.getByTestId("ts-open-ai-chat").click();
      await page.getByTestId("ts-ai-model").waitFor({ state: "visible", timeout: 30_000 });
      await page.getByTestId("ts-ai-model").selectOption(modelId);
      await page.getByTestId("ts-ai-load").click();
      console.log(`[live] loading ${modelId}…`);
      const status = page.getByTestId("ts-ai-status");
      const loadDeadline = Date.now() + 12 * 60 * 1000;
      let last = "";
      let lastLog = 0;
      while (Date.now() < loadDeadline) {
        last = (await status.textContent()) || "";
        if (last === "Ready" || last === "Load failed") break;
        if (Date.now() - lastLog > 15_000) {
          console.log(`[live] status=${JSON.stringify(last)}`);
          lastLog = Date.now();
        }
        await page.waitForTimeout(2500);
      }
      console.log(`[live] load result status=${JSON.stringify(last)}`);
      if (last !== "Ready") {
        const err = await page.locator("[data-testid=ts-ai-sidebar]").innerText();
        models.push(
          summarizeModelResults(modelId, [], "error", `Load failed: ${err.slice(0, 400)}`),
        );
        continue;
      }

      const caseResults = [];
      for (const c of SCHOOL_COMPARE_SUITE) {
        console.log(`[live] case=${c.id}`);
        const t0 = Date.now();
        const input = page.getByTestId("ts-ai-input");
        await input.waitFor({ state: "visible" });
        await input.fill(c.prompt);
        await input.press("Enter");
        const assistant = page.locator(
          '[data-testid="ts-ai-bubble"][data-role="assistant"]',
        );
        await assistant.first().waitFor({ state: "visible", timeout: 5 * 60 * 1000 });
        const doneDeadline = Date.now() + 8 * 60 * 1000;
        let text = "";
        let lastCaseLog = 0;
        while (Date.now() < doneDeadline) {
          const streaming =
            ((await status.textContent()) || "").toLowerCase().includes("generat") ||
            (await page.getByTestId("ts-ai-input").isDisabled());
          text = (await assistant.last().innerText().catch(() => "")) || "";
          if (Date.now() - lastCaseLog > 15_000) {
            console.log(
              `[live] case=${c.id} streaming=${streaming} len=${text.trim().length}`,
            );
            lastCaseLog = Date.now();
          }
          if (!streaming && text.trim().length > 10) break;
          if (!streaming && text.trim().length > 0 && Date.now() - t0 > 15_000) break;
          await page.waitForTimeout(2000);
        }
        const reply = text || (await assistant.last().innerText().catch(() => "")) || "";
        const scored = scoreSchoolCase(c, reply);
        const latencyMs = Date.now() - t0;
        console.log(
          `[live] case=${c.id} ${scored.pass ? "PASS" : "FAIL"} ${latencyMs}ms len=${reply.length}`,
        );
        caseResults.push({
          caseId: c.id,
          reply,
          pass: scored.pass,
          reasons: scored.reasons,
          latencyMs,
        });
      }
      models.push(summarizeModelResults(modelId, caseResults, "ok"));
    } finally {
      await page.close().catch(() => {});
      await browser.close().catch(() => {});
    }
  }

  return {
    mode: "live",
    generatedAt: new Date().toISOString(),
    baseUrl: base,
    models,
  };
}

function formatModelSection(m, heading) {
  const lines = [];
  const rate =
    m.passRate == null ? "n/a" : `${Math.round(m.passRate * 100)}% (${m.passed}/${m.total})`;
  lines.push(`### ${heading || m.modelId}`);
  lines.push(`- Status: ${m.status}`);
  lines.push(`- Pass rate: ${rate}`);
  if (m.error) lines.push(`- Error: ${m.error}`);
  for (const c of m.cases || []) {
    lines.push(
      `  - ${c.pass ? "PASS" : "FAIL"} \`${c.caseId}\`${c.latencyMs != null ? ` (${c.latencyMs}ms)` : ""} — ${(c.reasons || []).join("; ")}`,
    );
  }
  lines.push("");
  return lines;
}

function recommendationLines(liveOrPrimary) {
  const e2b = liveOrPrimary.models.find((m) => m.modelId.includes("E2B"));
  const e4b = liveOrPrimary.models.find((m) => m.modelId.includes("E4B"));
  const lines = [];
  lines.push("## Recommendation");
  lines.push("");
  if (e4b?.status === "skipped" || e4b?.status === "error") {
    lines.push(
      "**Keep E2B as the Load default** (faster first download, OpenSpec requirement, validated school starter path).",
    );
    lines.push("");
    lines.push(
      "**Recommend E4B as Quality** in the picker for capable machines (≥8GB RAM). E4B live school data is incomplete — treat as Quality upgrade until a successful `--live` run exists for both models.",
    );
  } else if (
    e2b?.passRate != null &&
    e4b?.passRate != null &&
    e4b.passRate > e2b.passRate + 0.15
  ) {
    lines.push(
      "**Keep E2B as the Load default.** E4B clearly outperformed E2B on the school live suite — stronger UI recommendation of E4B on capable hardware is warranted; do **not** auto-flip the default until OpenSpec is updated deliberately.",
    );
  } else {
    lines.push(
      "**Keep E2B as the Load default** (faster first download, OpenSpec requirement, validated school starter path).",
    );
    lines.push("");
    lines.push(
      "**Recommend E4B as Quality** in the picker for capable machines (≥8GB RAM / `navigator.deviceMemory` ≥ 8): Labs eval shows better instruction adherence at +~0.5GB. Do **not** auto-flip the default until school live compare shows a durable win and OpenSpec is updated deliberately.",
    );
  }
  lines.push("");
  lines.push(
    "UI copy labels E4B as “Quality (recommended if ≥8GB RAM)” and shows a capacity-aware hint under the select.",
  );
  lines.push("");
  return lines;
}

function verdict({ fixtures, live }) {
  const lines = [];
  const generatedAt = live?.generatedAt || fixtures.generatedAt;
  lines.push("# School model compare — findings");
  lines.push("");
  lines.push(`Generated: ${generatedAt}`);
  lines.push("");
  lines.push("## Labs `vdl-model-eval` (live WebGPU)");
  lines.push("");
  lines.push("Suite: branding / honesty / instruction-exact (`utils/model-eval-suite.json`).");
  lines.push("");
  lines.push("| Model | Pass rate | Avg latency | Notes |");
  lines.push("|-------|-----------|-------------|-------|");
  lines.push(
    "| **gemma-4-E2B-it-web** | **67% (2/3)** | ~8.1s | Failed exact “blue quiet river” (replied “Water flows gently”) |",
  );
  lines.push("| **gemma-4-E4B-it-web** | **100% (3/3)** | ~3.8s | All cases passed |");
  lines.push("");
  lines.push(
    "Source: Labs `data/model-eval-reports/latest/report.json` after `pnpm model-eval -- --models gemma-4-E2B-it-web,gemma-4-E4B-it-web`.",
  );
  lines.push("");
  lines.push(
    "E4B shows a clear win on this small Labs quality suite (instruction-following + slightly lower avg latency once loaded). It does **not** by itself prove better school tutoring or tool JSON reliability.",
  );
  lines.push("");
  lines.push("## School tutoring suite (`pnpm models:compare`)");
  lines.push("");
  lines.push(
    "Cases: starter route → `why-types`, invent-lesson trap, curriculum tool XML intent.",
  );
  lines.push("");
  lines.push("### Fixtures");
  lines.push("");
  if (fixtures.note) lines.push(`${fixtures.note}`);
  lines.push("");
  for (const m of fixtures.models) {
    lines.push(...formatModelSection(m));
  }
  if (live) {
    lines.push("### Live (`pnpm models:compare:live`)");
    lines.push("");
    lines.push(`Base URL: \`${live.baseUrl || "http://localhost:5173"}\``);
    lines.push("");
    for (const m of live.models) {
      lines.push(...formatModelSection(m));
    }
  } else {
    lines.push("### Live");
    lines.push("");
    lines.push(
      "Not run in this report. Use `pnpm models:compare:live` against `http://localhost:5173` once weights are in `.models/` (requires WebGPU).",
    );
    lines.push("");
  }
  lines.push(...recommendationLines(live || fixtures));
  return lines.join("\n");
}

async function main() {
  const scorers = await loadScorers();
  const fixtures = await scoreFixtures(scorers);
  const live = useLive ? await scoreLive(scorers) : null;
  const report = live
    ? { ...live, fixtures }
    : fixtures;
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const reportPath = path.join(OUT_DIR, "report.json");
  const findingsPath = path.join(OUT_DIR, "FINDINGS.md");
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(findingsPath, verdict({ fixtures, live }));
  console.log("[school-model-compare] wrote", path.relative(ROOT, reportPath));
  console.log("[school-model-compare] wrote", path.relative(ROOT, findingsPath));
  for (const m of (live || fixtures).models) {
    const rate =
      m.passRate == null ? "n/a" : `${Math.round(m.passRate * 100)}%`;
    console.log(`  ${m.modelId}: ${m.status} ${rate}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
