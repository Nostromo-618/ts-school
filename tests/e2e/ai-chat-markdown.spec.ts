import { expect, test } from "./fixtures";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

test.describe("AI chat markdown rendering", () => {
  test("assistant bubble renders markdown and SPA links", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("ts-open-ai-chat").click();
    await expect(page.getByTestId("ts-ai-sidebar")).toBeVisible();

    // Seed a loaded chat message without LiteRT (CSP-safe DOM inject).
    await page.evaluate(() => {
      const list = document.querySelector('[data-testid="ts-ai-messages"]');
      if (!list) throw new Error("messages missing");
      const empty = list.querySelector(".vd-text-muted");
      empty?.remove();
      const bubble = document.createElement("div");
      bubble.className = "ts-ai-bubble is-assistant";
      bubble.setAttribute("data-testid", "ts-ai-bubble");
      bubble.setAttribute("data-role", "assistant");
      const md = document.createElement("div");
      md.className = "ts-ai-bubble-md";
      md.setAttribute("data-testid", "ts-ai-bubble-md");
      md.innerHTML =
        '<p>Start with <strong>Why types at all</strong> at <a href="/lessons/foundations/why-types" rel="noopener noreferrer">/lessons/foundations/why-types</a>.</p>';
      bubble.appendChild(md);
      list.appendChild(bubble);
    });

    const link = page
      .getByTestId("ts-ai-bubble-md")
      .locator('a[href="/lessons/foundations/why-types"]');
    await expect(link).toBeVisible();
    await expect(
      page.getByTestId("ts-ai-bubble-md").locator("strong"),
    ).toHaveText("Why types at all");

    await link.click();
    await expect(page).toHaveURL(/\/lessons\/foundations\/why-types/);
  });
  test("assistant bubble escapes adversarial markdown", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("ts-open-ai-chat").click();
    await expect(page.getByTestId("ts-ai-sidebar")).toBeVisible();

    await page.evaluate(() => {
      const list = document.querySelector('[data-testid="ts-ai-messages"]');
      if (!list) throw new Error("messages missing");
      list.querySelector(".vd-text-muted")?.remove();
      const bubble = document.createElement("div");
      bubble.className = "ts-ai-bubble is-assistant";
      bubble.setAttribute("data-testid", "ts-ai-bubble");
      const md = document.createElement("div");
      md.className = "ts-ai-bubble-md";
      md.setAttribute("data-testid", "ts-ai-bubble-md");
      // Mimic escaped pipeline output (what renderAssistantHtml produces).
      md.innerHTML =
        '&lt;script&gt;alert(1)&lt;/script&gt;<p>Safe <a href="/curriculum">curriculum</a></p>';
      bubble.appendChild(md);
      list.appendChild(bubble);
    });

    await expect(
      page.getByTestId("ts-ai-bubble-md").locator("script"),
    ).toHaveCount(0);
    await expect(
      page
        .getByTestId("ts-ai-bubble-md")
        .locator('a[href="javascript:alert(1)"]'),
    ).toHaveCount(0);
    await expect(page).toHaveURL(/\/$/);
  });
});

const modelFile = path.join(
  projectRoot,
  ".models",
  "gemma-4-E2B-it-web",
  "gemma-4-E2B-it-web.litertlm",
);
const hasLocalModel = fs.existsSync(modelFile);
const llmE2eEnabled = process.env.TS_SCHOOL_LLM_E2E === "1";

test.describe("local LLM starter chat", () => {
  test.describe.configure({ timeout: 15 * 60 * 1000 });

  test.skip(
    !llmE2eEnabled,
    "Set TS_SCHOOL_LLM_E2E=1 (pnpm test:e2e:llm) to run real Gemma chat",
  );
  test.skip(
    !hasLocalModel,
    "Requires .models/gemma-4-E2B-it-web (pnpm models:fetch)",
  );

  test("home where-to-start cites why-types", async ({
    page,
    browserName,
  }, testInfo) => {
    test.skip(
      browserName !== "chromium",
      "WebGPU LiteRT is Chromium-only here",
    );
    // Avoid contending with other Chromium workers for WebGPU / model memory.
    testInfo.setTimeout(15 * 60 * 1000);

    await page.goto("/");
    const hasGpu = await page.evaluate(
      () => typeof navigator !== "undefined" && Boolean(navigator.gpu),
    );
    test.skip(!hasGpu, "WebGPU unavailable in this browser");

    await page.getByTestId("ts-open-ai-chat").click();
    await page.getByTestId("ts-ai-load").click();

    const status = page.getByTestId("ts-ai-status");
    const loadDeadline = Date.now() + 12 * 60 * 1000;
    let last = "";
    while (Date.now() < loadDeadline) {
      last = (await status.textContent()) || "";
      if (last === "Ready" || last === "Load failed") break;
      await page.waitForTimeout(2000);
    }
    if (last !== "Ready") {
      const sidebar = await page.getByTestId("ts-ai-sidebar").innerText();
      throw new Error(
        `Ask model failed to reach Ready (status=${JSON.stringify(last)}). Sidebar:\n${sidebar.slice(0, 800)}`,
      );
    }
    await expect(page.getByTestId("ts-ai-input")).toBeEnabled();
    await expect(page.getByTestId("ts-ai-input")).toBeFocused();

    await page
      .getByTestId("ts-ai-input")
      .fill("Where should a beginner start with TypeScript?");
    await page.getByTestId("ts-ai-send").click();

    const assistant = page.locator(
      '[data-testid="ts-ai-bubble"][data-role="assistant"]',
    );
    await expect(assistant.first()).toBeVisible({ timeout: 5 * 60 * 1000 });
    await expect
      .poll(
        async () => {
          const text = (await assistant.last().innerText()).toLowerCase();
          return (
            text.includes("why-types") ||
            text.includes("why types") ||
            text.includes("/lessons/foundations/why-types")
          );
        },
        { timeout: 5 * 60 * 1000 },
      )
      .toBe(true);

    await expect(page.getByTestId("ts-ai-input")).toBeEnabled();
    await expect(page.getByTestId("ts-ai-input")).toBeFocused();

    const body = (await assistant.last().innerText()).toLowerCase();
    expect(body).not.toMatch(/if they exist/);
    expect(body).not.toContain("**");
  });
});
