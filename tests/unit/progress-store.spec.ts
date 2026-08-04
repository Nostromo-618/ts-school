import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import {
  PROGRESS_SCHEMA_VERSION,
  PROGRESS_STORAGE_KEY,
  parseProgress,
  useProgressStore,
} from "@/stores/progress";

describe("parseProgress", () => {
  it("accepts a valid v1 payload", () => {
    const parsed = parseProgress({
      version: 1,
      lessons: {
        "why-types": {
          status: "complete",
          quizScore: { correct: 2, total: 3 },
          exercisePassed: true,
          updatedAt: "2026-08-04T12:00:00.000Z",
        },
      },
    });

    expect(parsed?.version).toBe(PROGRESS_SCHEMA_VERSION);
    expect(parsed?.lessons["why-types"]?.status).toBe("complete");
  });

  it("rejects a wrong version", () => {
    expect(
      parseProgress({
        version: 99,
        lessons: {},
      }),
    ).toBeUndefined();
  });

  it("rejects a non-object", () => {
    expect(parseProgress(null)).toBeUndefined();
    expect(parseProgress("nope")).toBeUndefined();
  });

  it("rejects a corrupt lesson entry", () => {
    expect(
      parseProgress({
        version: 1,
        lessons: {
          "why-types": { status: "done", updatedAt: "x" },
        },
      }),
    ).toBeUndefined();
  });
});

describe("useProgressStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    window.localStorage.clear();
  });

  it("round-trips through localStorage", () => {
    const store = useProgressStore();
    store.hydrate();
    store.markComplete("why-types");
    store.recordQuiz("why-types", 2, 3);
    store.recordExercisePass("why-types");

    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    expect(raw).toBeTruthy();

    setActivePinia(createPinia());
    const restored = useProgressStore();
    restored.hydrate();

    expect(restored.isComplete("why-types")).toBe(true);
    expect(restored.lessons["why-types"]?.quizScore).toEqual({
      correct: 2,
      total: 3,
    });
    expect(restored.lessons["why-types"]?.exercisePassed).toBe(true);
  });

  it("discards a corrupt payload on hydrate", () => {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, "{not-json");
    const store = useProgressStore();
    store.hydrate();
    expect(store.lessons).toEqual({});
    expect(window.localStorage.getItem(PROGRESS_STORAGE_KEY)).toBeNull();
  });

  it("discards a wrong-version payload on hydrate", () => {
    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({ version: 2, lessons: { x: { status: "complete" } } }),
    );
    const store = useProgressStore();
    store.hydrate();
    expect(store.lessons).toEqual({});
  });

  it("does not downgrade a completed lesson to in-progress", () => {
    const store = useProgressStore();
    store.hydrate();
    store.markComplete("why-types");
    store.markInProgress("why-types");
    expect(store.isComplete("why-types")).toBe(true);
  });
});
