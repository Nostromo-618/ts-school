import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  NOTES_PINNED_KEY,
  NOTES_PIN_SIDE_KEY,
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

  it("persists pin preference and side", () => {
    const store = useNotesStore();
    store.hydrate();
    store.setPinSide("left");
    store.setPinned(true);
    expect(window.localStorage.getItem(NOTES_PINNED_KEY)).toBe("1");
    expect(window.localStorage.getItem(NOTES_PIN_SIDE_KEY)).toBe("left");

    setActivePinia(createPinia());
    const restored = useNotesStore();
    restored.hydrate();
    expect(restored.pinned).toBe(true);
    expect(restored.pinSide).toBe("left");
    expect(restored.open).toBe(false);
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
