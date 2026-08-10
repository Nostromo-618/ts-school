/**
 * Learner progress — localStorage only, schema-validated on read.
 *
 * Unknown, corrupt, or wrong-version payloads are discarded. Nothing here is
 * ever trusted from storage without going through `parseProgress`. SSR never
 * touches localStorage; call `hydrate()` from a client `onMounted`.
 */

import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { allLessons, type LessonId, type TrackId } from "@/curriculum";

export const PROGRESS_STORAGE_KEY = "ts-school-progress";
export const PROGRESS_SCHEMA_VERSION = 1 as const;

export type LessonProgressStatus = "in-progress" | "complete";

export interface LessonProgress {
  status: LessonProgressStatus;
  quizScore?: { correct: number; total: number };
  exercisePassed?: boolean;
  /** ISO-8601 timestamp of the last mutation for this lesson. */
  updatedAt: string;
}

export interface ProgressV1 {
  version: typeof PROGRESS_SCHEMA_VERSION;
  lessons: Record<string, LessonProgress>;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isQuizScore(
  value: unknown,
): value is { correct: number; total: number } {
  if (!isPlainObject(value)) return false;
  return (
    typeof value.correct === "number" &&
    Number.isFinite(value.correct) &&
    typeof value.total === "number" &&
    Number.isFinite(value.total) &&
    value.total >= 0 &&
    value.correct >= 0 &&
    value.correct <= value.total
  );
}

function parseLessonProgress(value: unknown): LessonProgress | undefined {
  if (!isPlainObject(value)) return undefined;
  if (value.status !== "in-progress" && value.status !== "complete") {
    return undefined;
  }
  if (typeof value.updatedAt !== "string") return undefined;

  const entry: LessonProgress = {
    status: value.status,
    updatedAt: value.updatedAt,
  };

  if (value.quizScore !== undefined) {
    if (!isQuizScore(value.quizScore)) return undefined;
    entry.quizScore = value.quizScore;
  }
  if (value.exercisePassed !== undefined) {
    if (typeof value.exercisePassed !== "boolean") return undefined;
    entry.exercisePassed = value.exercisePassed;
  }

  return entry;
}

/**
 * Validate a raw storage value. Returns a clean v1 payload or `undefined` when
 * the shape is not trustworthy.
 */
export function parseProgress(raw: unknown): ProgressV1 | undefined {
  if (!isPlainObject(raw)) return undefined;
  if (raw.version !== PROGRESS_SCHEMA_VERSION) return undefined;
  if (!isPlainObject(raw.lessons)) return undefined;

  const lessons: Record<string, LessonProgress> = {};
  for (const [id, entry] of Object.entries(raw.lessons)) {
    if (typeof id !== "string" || id.length === 0) return undefined;
    const parsed = parseLessonProgress(entry);
    if (!parsed) return undefined;
    lessons[id] = parsed;
  }

  return { version: PROGRESS_SCHEMA_VERSION, lessons };
}

function emptyProgress(): ProgressV1 {
  return { version: PROGRESS_SCHEMA_VERSION, lessons: {} };
}

function nowIso(): string {
  return new Date().toISOString();
}

export const useProgressStore = defineStore("progress", () => {
  const lessons = ref<Record<string, LessonProgress>>({});
  const ready = ref(false);

  function persist(): void {
    if (typeof window === "undefined") return;
    const payload: ProgressV1 = {
      version: PROGRESS_SCHEMA_VERSION,
      lessons: { ...lessons.value },
    };
    try {
      window.localStorage.setItem(
        PROGRESS_STORAGE_KEY,
        JSON.stringify(payload),
      );
    } catch {
      // Quota / private mode — progress stays in-memory for the session.
    }
  }

  function hydrate(): void {
    if (ready.value) return;
    if (typeof window === "undefined") {
      ready.value = true;
      return;
    }
    try {
      const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (raw !== null) {
        const parsed = parseProgress(JSON.parse(raw) as unknown);
        if (parsed) lessons.value = parsed.lessons;
        else window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
      }
    } catch {
      try {
        window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }
    ready.value = true;
  }

  function ensureEntry(lessonId: LessonId): LessonProgress {
    const existing = lessons.value[lessonId];
    if (existing) return existing;
    const created: LessonProgress = {
      status: "in-progress",
      updatedAt: nowIso(),
    };
    lessons.value = { ...lessons.value, [lessonId]: created };
    return created;
  }

  function touch(
    lessonId: LessonId,
    patch: Partial<Omit<LessonProgress, "updatedAt">>,
  ): void {
    const current = ensureEntry(lessonId);
    lessons.value = {
      ...lessons.value,
      [lessonId]: {
        ...current,
        ...patch,
        updatedAt: nowIso(),
      },
    };
    persist();
  }

  function markInProgress(lessonId: LessonId): void {
    const current = lessons.value[lessonId];
    if (current?.status === "complete") return;
    touch(lessonId, { status: "in-progress" });
  }

  function markComplete(lessonId: LessonId): void {
    touch(lessonId, { status: "complete" });
  }

  function recordQuiz(
    lessonId: LessonId,
    correct: number,
    total: number,
  ): void {
    touch(lessonId, {
      quizScore: { correct, total },
    });
  }

  function recordExercisePass(lessonId: LessonId): void {
    touch(lessonId, { exercisePassed: true });
  }

  function statusOf(lessonId: LessonId): LessonProgressStatus | undefined {
    return lessons.value[lessonId]?.status;
  }

  function isComplete(lessonId: LessonId): boolean {
    return lessons.value[lessonId]?.status === "complete";
  }

  function completedCountForTrack(trackId: TrackId): number {
    return allLessons.filter(
      (lesson) =>
        lesson.track === trackId &&
        lessons.value[lesson.id]?.status === "complete",
    ).length;
  }

  /** Wipe in-memory progress and remove the storage key. */
  function clearProgress(): void {
    lessons.value = emptyProgress().lessons;
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }
  }

  const completedTotal = computed(
    () =>
      Object.values(lessons.value).filter(
        (entry) => entry.status === "complete",
      ).length,
  );

  return {
    lessons,
    ready,
    completedTotal,
    hydrate,
    markInProgress,
    markComplete,
    recordQuiz,
    recordExercisePass,
    statusOf,
    isComplete,
    completedCountForTrack,
    clearProgress,
    /** Test seam: replace in-memory state without touching storage. */
    _replaceForTests(next: ProgressV1): void {
      lessons.value = next.lessons;
      ready.value = true;
    },
    /** Test seam: clear memory + storage. */
    _resetForTests(): void {
      lessons.value = emptyProgress().lessons;
      ready.value = false;
      if (typeof window !== "undefined") {
        try {
          window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
        } catch {
          /* ignore */
        }
      }
    },
  };
});
