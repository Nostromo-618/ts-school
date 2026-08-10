import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  NOTES_DEFAULT_WIDTH,
  NOTES_FOLDED_KEY,
  NOTES_MIN_HEIGHT,
  NOTES_MIN_WIDTH,
  NOTES_PINNED_KEY,
  NOTES_PIN_SIDE_KEY,
  NOTES_WINDOW_STORAGE_KEY,
  clampNotesWindow,
  defaultNotesWindow,
  parseNotesWindow,
  readLegacyPinSide,
} from "@/lib/notes-window";
import {
  NOTES_SCHEMA_VERSION,
  NOTES_STORAGE_KEY,
  parseNotes,
  useNotesStore,
} from "@/stores/notes";

describe("parseNotes", () => {
  it("accepts a valid v1 payload", () => {
    const parsed = parseNotes({
      version: 1,
      body: "hello",
      updatedAt: "2026-08-10T12:00:00.000Z",
    });
    expect(parsed?.version).toBe(NOTES_SCHEMA_VERSION);
    expect(parsed?.body).toBe("hello");
  });

  it("rejects a wrong version", () => {
    expect(
      parseNotes({
        version: 99,
        body: "x",
        updatedAt: "2026-08-10T12:00:00.000Z",
      }),
    ).toBeUndefined();
  });

  it("rejects a non-object", () => {
    expect(parseNotes(null)).toBeUndefined();
    expect(parseNotes("nope")).toBeUndefined();
  });
});

describe("notes window geometry", () => {
  it("parses a valid window payload", () => {
    const parsed = parseNotesWindow({
      version: 1,
      x: 10,
      y: 20,
      width: 300,
      height: 400,
    });
    expect(parsed).toEqual({
      version: 1,
      x: 10,
      y: 20,
      width: 300,
      height: 400,
    });
  });

  it("rejects invalid window payloads", () => {
    expect(parseNotesWindow({ version: 2, x: 0, y: 0, width: 300, height: 200 })).toBeUndefined();
    expect(parseNotesWindow({ version: 1, x: "a", y: 0, width: 300, height: 200 })).toBeUndefined();
    expect(parseNotesWindow(null)).toBeUndefined();
  });

  it("clamps off-screen positions so the title bar stays usable", () => {
    const clamped = clampNotesWindow(
      { version: 1, x: -2000, y: -500, width: 300, height: 400 },
      { width: 1000, height: 800 },
    );
    expect(clamped.x).toBeGreaterThan(-300);
    expect(clamped.y).toBeGreaterThanOrEqual(0);
    expect(clamped.width).toBeGreaterThanOrEqual(NOTES_MIN_WIDTH);
    expect(clamped.height).toBeGreaterThanOrEqual(NOTES_MIN_HEIGHT);
  });

  it("enforces minimum size", () => {
    const clamped = clampNotesWindow(
      { version: 1, x: 10, y: 10, width: 50, height: 50 },
      { width: 1000, height: 800 },
    );
    expect(clamped.width).toBe(NOTES_MIN_WIDTH);
    expect(clamped.height).toBe(NOTES_MIN_HEIGHT);
  });

  it("seeds default x from legacy pin side", () => {
    const left = defaultNotesWindow({ width: 1280, height: 800 }, "left");
    const right = defaultNotesWindow({ width: 1280, height: 800 }, "right");
    expect(left.x).toBeLessThan(right.x);
    expect(right.width).toBe(NOTES_DEFAULT_WIDTH);
  });

  it("reads legacy pin side", () => {
    const map = new Map<string, string>([[NOTES_PIN_SIDE_KEY, "left"]]);
    expect(readLegacyPinSide((k) => map.get(k) ?? null)).toBe("left");
  });
});

describe("useNotesStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    window.localStorage.clear();
    vi.useFakeTimers();
  });

  it("round-trips through localStorage after debounce", () => {
    const store = useNotesStore();
    store.hydrate();
    store.setBody("study notes");
    vi.runAllTimers();

    const raw = window.localStorage.getItem(NOTES_STORAGE_KEY);
    expect(raw).toBeTruthy();

    setActivePinia(createPinia());
    const restored = useNotesStore();
    restored.hydrate();
    expect(restored.body).toBe("study notes");
  });

  it("discards a corrupt payload on hydrate", () => {
    window.localStorage.setItem(NOTES_STORAGE_KEY, "{not-json");
    const store = useNotesStore();
    store.hydrate();
    expect(store.body).toBe("");
    expect(window.localStorage.getItem(NOTES_STORAGE_KEY)).toBeNull();
  });

  it("discards a wrong-version payload on hydrate", () => {
    window.localStorage.setItem(
      NOTES_STORAGE_KEY,
      JSON.stringify({ version: 2, body: "x", updatedAt: "t" }),
    );
    const store = useNotesStore();
    store.hydrate();
    expect(store.body).toBe("");
  });

  it("persists window geometry and fold; cleans legacy pin keys", () => {
    window.localStorage.setItem(NOTES_PINNED_KEY, "1");
    window.localStorage.setItem(NOTES_PIN_SIDE_KEY, "left");

    const store = useNotesStore();
    store.hydrate();
    expect(window.localStorage.getItem(NOTES_PINNED_KEY)).toBeNull();
    expect(window.localStorage.getItem(NOTES_PIN_SIDE_KEY)).toBeNull();
    expect(window.localStorage.getItem(NOTES_WINDOW_STORAGE_KEY)).toBeTruthy();
    // Seeded from left pin side → smaller x than a right default.
    expect(store.geometry.x).toBeLessThan(200);

    store.setWindow({
      version: 1,
      x: 120,
      y: 80,
      width: 360,
      height: 420,
    });
    store.setFolded(true);
    expect(window.localStorage.getItem(NOTES_FOLDED_KEY)).toBe("1");

    setActivePinia(createPinia());
    const restored = useNotesStore();
    restored.hydrate();
    expect(restored.geometry.x).toBe(120);
    expect(restored.geometry.width).toBe(360);
    expect(restored.folded).toBe(true);
    expect(restored.open).toBe(false);
  });

  it("closeNotes does not auto-open and leaves geometry intact", () => {
    const store = useNotesStore();
    store.hydrate();
    store.openNotes();
    expect(store.open).toBe(true);
    store.closeNotes();
    expect(store.open).toBe(false);
    expect(window.localStorage.getItem(NOTES_WINDOW_STORAGE_KEY)).toBeTruthy();
  });

  it("clearNotes empties body and storage", () => {
    const store = useNotesStore();
    store.hydrate();
    store.setBody("temp");
    vi.runAllTimers();
    store.clearNotes();
    expect(store.body).toBe("");
    expect(window.localStorage.getItem(NOTES_STORAGE_KEY)).toBeNull();
  });
});
