import type { Router } from "vue-router";
import { NeptuneSearch } from "@vanduo-oss/vdl-engines/neptune-search.js";
import { validateToolCall } from "@vanduo-oss/vdl-engines/guardrails/tools.js";
import Fuse from "fuse.js";
import {
  TRACKS,
  allLessons,
  lessonById,
  lessonRoute,
  lessonsByTrack,
  trackById,
  type Lesson,
} from "@/curriculum";
import { LESSON_DIAGNOSTICS } from "@/curriculum/generated/diagnostics";
import { nav } from "@/nav";
import { buildLearnerProgressSummary } from "@/lib/learner-progress";
import { useLessonEditorStore } from "@/stores/lessonEditor";

/** Fixed tutor policy — always appended; never dropped on load/send. */
export const SCHOOL_CHAT_POLICY = [
  "STARTER RULE: If the learner asks where to begin, start, or what to learn first, answer in one short paragraph and include a markdown link to curriculumPrimer.firstLesson — e.g. [Why types at all](/lessons/foundations/why-types). Do not invent titles like Basic Types or What is TypeScript.",
  "Prefer tools (search_curriculum, get_lesson, navigate_lesson, get_learner_progress) when looking up other lessons or progress; do not invent lesson titles or routes.",
  "Only cite lessons and pages present in the context JSON or in tool results.",
  "When citing a page or lesson, use markdown links: [Title](/route).",
  "LEARNING PLAN: When suggesting what to study next, use only curriculumPrimer / registry lessons and learnerProgress (or get_learner_progress). Prefer nextIncompleteLessonIds and incomplete tracks in registry order. Never invent lesson titles or routes that are not in context or tool results.",
  "Do not invent compiler diagnostics beyond the provided build-time snapshot. Never claim live tsc.",
  "Editor writes require learner confirmation in the UI.",
  "Keep answers concise.",
].join(" ");

export type SchoolLocationKind =
  | "home"
  | "lesson"
  | "curriculum"
  | "glossary"
  | "history"
  | "about"
  | "terms"
  | "profile"
  | "farewell"
  | "other";

export function schoolLocationKind(
  path: string,
  lessonId: string | null,
): SchoolLocationKind {
  if (lessonId) return "lesson";
  const bare = (path.split(/[?#]/)[0] || "/").replace(/\/+$/, "") || "/";
  if (bare === "/") return "home";
  if (bare === "/curriculum") return "curriculum";
  if (bare === "/glossary") return "glossary";
  if (bare === "/history") return "history";
  if (bare === "/about") return "about";
  if (bare === "/terms") return "terms";
  if (bare === "/profile") return "profile";
  if (bare === "/farewell") return "farewell";
  return "other";
}

function curriculumPrimer() {
  const firstTrack = TRACKS[0];
  const firstLesson = firstTrack ? lessonsByTrack(firstTrack.id)[0] : undefined;
  return {
    firstLesson: firstLesson
      ? {
          id: firstLesson.id,
          title: firstLesson.title,
          route: lessonRoute(firstLesson),
          track: firstLesson.track,
        }
      : null,
    pages: nav.pages.map((p) => ({
      id: p.id,
      title: p.title,
      route: p.route,
    })),
    tracks: TRACKS.map((track) => ({
      id: track.id,
      title: track.title,
    })),
    lessonCount: allLessons.length,
  };
}

export const SCHOOL_TOOL_DEFS = [
  {
    name: "search_curriculum",
    description: "Hybrid search over TypeScript School lessons and pages.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query" },
      },
      required: ["query"],
    },
  },
  {
    name: "get_lesson",
    description: "Fetch structured metadata for a lesson by id.",
    parameters: {
      type: "object",
      properties: {
        lessonId: { type: "string" },
      },
      required: ["lessonId"],
    },
  },
  {
    name: "read_ts_editor",
    description:
      "Read the current TypeScript pane and exercise editor buffers.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "propose_ts_edit",
    description:
      "Propose a full replacement for the TypeScript lesson pane. Requires learner confirmation before apply.",
    parameters: {
      type: "object",
      properties: {
        code: { type: "string" },
        target: {
          type: "string",
          enum: ["ts", "exercise"],
          description: "Which editor buffer to update",
        },
      },
      required: ["code"],
    },
  },
  {
    name: "apply_ts_edit",
    description:
      "Queue an apply for a previously proposed edit. Still requires learner Accept in the UI.",
    parameters: {
      type: "object",
      properties: {
        code: { type: "string" },
        target: { type: "string", enum: ["ts", "exercise"] },
      },
      required: ["code"],
    },
  },
  {
    name: "navigate_lesson",
    description: "Navigate the app to a lesson route by lesson id.",
    parameters: {
      type: "object",
      properties: {
        lessonId: { type: "string" },
      },
      required: ["lessonId"],
    },
  },
  {
    name: "get_learner_progress",
    description:
      "Read-only summary of the learner’s local progress (completed / in-progress counts, per-track, recent and next incomplete lesson ids). Use for learning-plan advice; never invent lessons.",
    parameters: { type: "object", properties: {} },
  },
] as const;

export type SchoolToolName = (typeof SCHOOL_TOOL_DEFS)[number]["name"];

let sharedSearch: NeptuneSearch | null = null;

async function getSearch(): Promise<NeptuneSearch> {
  if (sharedSearch) return sharedSearch;
  const base = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  sharedSearch = new NeptuneSearch({
    indexUrl: `${base}search/search-index.json`,
    vectorsUrl: `${base}search/vectors.json`,
    maxResults: 8,
    loadFuse: async () => ({ default: Fuse }),
  });
  await sharedSearch.initFuzzy();
  return sharedSearch;
}

function lessonSummary(lesson: Lesson) {
  const track = trackById(lesson.track);
  const diagnostics = LESSON_DIAGNOSTICS[lesson.id]?.pane ?? [];
  return {
    id: lesson.id,
    title: lesson.title,
    tier: lesson.tier,
    track: lesson.track,
    trackTitle: track?.title,
    route: lessonRoute(lesson),
    summary: lesson.summary,
    problem: lesson.problem,
    insight: lesson.insight,
    keywords: lesson.keywords,
    diagnostics: diagnostics.map((d) => ({
      code: d.code,
      message: d.message,
      line: d.line,
    })),
    hasExercise: Boolean(lesson.exercise),
    exercisePrompt: lesson.exercise?.prompt,
  };
}

function currentLessonPack(lessonId: string | null) {
  if (!lessonId) return null;
  const lesson = lessonById(lessonId);
  if (!lesson) return { error: "unknown_lesson", lessonId };
  const editor = useLessonEditorStore();
  return {
    ...lessonSummary(lesson),
    currentTsCode: (editor.tsCode || lesson.ts.code).slice(0, 4000),
    currentExerciseCode: (
      editor.exerciseCode ||
      lesson.exercise?.starter ||
      ""
    ).slice(0, 2000),
  };
}

export function buildSchoolChatContext(options: {
  path: string;
  lessonId: string | null;
}): {
  location: { path: string; kind: SchoolLocationKind };
  curriculumPrimer: ReturnType<typeof curriculumPrimer>;
  currentLesson: ReturnType<typeof currentLessonPack>;
  learnerProgress: ReturnType<typeof buildLearnerProgressSummary>;
} {
  const path = options.path || "/";
  return {
    location: {
      path,
      kind: schoolLocationKind(path, options.lessonId),
    },
    curriculumPrimer: curriculumPrimer(),
    currentLesson: currentLessonPack(options.lessonId),
    learnerProgress: buildLearnerProgressSummary(),
  };
}

/** System-prompt `extra` string: policy + context JSON. */
export function composeSchoolSystemExtra(options: {
  path: string;
  lessonId: string | null;
}): string {
  const ctx = buildSchoolChatContext(options);
  return `${SCHOOL_CHAT_POLICY}\nContext JSON:\n${JSON.stringify(ctx)}`;
}

/** @deprecated Prefer composeSchoolSystemExtra / buildSchoolChatContext. */
export function buildLessonContextPack(lessonId: string | null): string {
  if (!lessonId) return "No lesson is currently open.";
  const lesson = lessonById(lessonId);
  if (!lesson) return `Unknown lesson id: ${lessonId}`;
  const pack = currentLessonPack(lessonId);
  return JSON.stringify(pack);
}

export function createSchoolToolExecutor(options: {
  router: Router;
  getLessonId: () => string | null;
}) {
  const editor = useLessonEditorStore();

  return async function execute(
    name: string,
    args: Record<string, unknown>,
  ): Promise<unknown> {
    const validation = validateToolCall({
      name,
      args,
      allowlist: SCHOOL_TOOL_DEFS.map((t) => t.name),
    });
    if (!validation.allowed) {
      return { error: validation.code, message: validation.message };
    }

    switch (name as SchoolToolName) {
      case "search_curriculum": {
        const query = String(args.query || "");
        const search = await getSearch();
        const result = await search.search(query, { mode: "fuzzy" });
        return {
          query,
          hits: (result.merged || []).map((hit) => ({
            id: hit.doc.id,
            title: hit.doc.title,
            route: hit.doc.route,
            score: hit.score,
            source: hit.source,
            snippet: String(hit.doc.bodyText || "").slice(0, 180),
          })),
        };
      }
      case "get_lesson": {
        const id = String(args.lessonId || "");
        const lesson = lessonById(id);
        if (!lesson) return { error: "lesson.not_found", lessonId: id };
        return lessonSummary(lesson);
      }
      case "read_ts_editor": {
        return {
          lessonId: options.getLessonId(),
          tsCode: editor.tsCode,
          exerciseCode: editor.exerciseCode,
          hasPendingEdit: editor.hasPendingEdit,
        };
      }
      case "propose_ts_edit":
      case "apply_ts_edit": {
        const code = String(args.code ?? "");
        const target = args.target === "exercise" ? "exercise" : "ts";
        if (!code.trim()) {
          return { error: "edit.empty", message: "code must be non-empty" };
        }
        if (target === "exercise") editor.proposeExerciseEdit(code);
        else editor.proposeTsEdit(code);
        return {
          status: "pending_confirmation",
          target,
          message:
            "Edit queued. The learner must Accept in the UI before the editor changes.",
          previewChars: code.length,
        };
      }
      case "navigate_lesson": {
        const id = String(args.lessonId || "");
        const lesson = lessonById(id);
        if (!lesson) return { error: "lesson.not_found", lessonId: id };
        await options.router.push(lessonRoute(lesson));
        return { ok: true, route: lessonRoute(lesson) };
      }
      case "get_learner_progress": {
        return buildLearnerProgressSummary();
      }
      default:
        return { error: "tool.unknown", name };
    }
  };
}
