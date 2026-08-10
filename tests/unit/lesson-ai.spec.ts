import { describe, expect, it, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useLessonEditorStore } from "@/stores/lessonEditor";
import { SCHOOL_TOOL_DEFS } from "@/ai/school-tools";
import { validateToolCall } from "@vanduo-oss/vdl-engines/guardrails/tools.js";

describe("lessonEditor store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("queues and accepts ts edits only after acceptPending", () => {
    const editor = useLessonEditorStore();
    editor.bindLesson("truthiness-narrowing", "const x = 1;");
    editor.proposeTsEdit("const x: number = 1;");
    expect(editor.tsCode).toBe("const x = 1;");
    expect(editor.hasPendingEdit).toBe(true);
    editor.acceptPending();
    expect(editor.tsCode).toBe("const x: number = 1;");
    expect(editor.hasPendingEdit).toBe(false);
  });

  it("rejects pending edits without applying", () => {
    const editor = useLessonEditorStore();
    editor.bindLesson("x", "a");
    editor.proposeTsEdit("b");
    editor.rejectPending();
    expect(editor.tsCode).toBe("a");
    expect(editor.hasPendingEdit).toBe(false);
  });
});

describe("school tool allowlist", () => {
  it("exposes the planned tool names", () => {
    const names = SCHOOL_TOOL_DEFS.map((t) => t.name);
    expect(names).toContain("search_curriculum");
    expect(names).toContain("apply_ts_edit");
    expect(names).toContain("navigate_lesson");
  });

  it("blocks unknown tools via guardrails", () => {
    const result = validateToolCall({
      name: "rm_rf",
      args: {},
      allowlist: SCHOOL_TOOL_DEFS.map((t) => t.name),
    });
    expect(result.allowed).toBe(false);
  });
});

describe("AiChat load progress descriptors", () => {
  it("maps stage events into status + percent for the sidebar", async () => {
    const {
      describeLoadProgress,
      inferLoadSource,
      LOAD_FREEZE_HINT,
    } = await import("@vanduo-oss/vdl-engines/ai-chat.js");

    expect(inferLoadSource("/models/gemma-4-E2B-it-web/x.litertlm")).toBe(
      "local",
    );
    expect(inferLoadSource("45% · 900 / 2000 MB")).toBe("network");

    const init = describeLoadProgress({
      stage: "init",
      message: "Initializing LiteRT WebGPU engine…",
    });
    expect(init.statusText).toBe("Loading…");
    expect(init.progressText).toMatch(/Initializing/i);

    const localDl = describeLoadProgress({
      stage: "downloading",
      message: "Reading local model weights…",
      text: "42% · 840 / 2000 MB",
      loaded: 0.42,
      source: "local",
    });
    expect(localDl.statusText).toBe("Loading 42%");
    expect(localDl.progressPct).toBe(42);
    expect(localDl.source).toBe("local");
    expect(localDl.progressText).toMatch(/local/i);
    expect(localDl.progressText).toMatch(/42%/);

    const compiling = describeLoadProgress({
      stage: "compiling",
      message: LOAD_FREEZE_HINT,
      loaded: 1,
    });
    expect(compiling.statusText).toBe("Compiling…");
    expect(compiling.progressPct).toBe(100);
    expect(compiling.freezeHint).toMatch(/freeze/i);
  });
});
