/**
 * The curriculum registry — the one place the application enumerates lessons.
 *
 * `vd3-docs` keeps three hand-written lists of the same pages (route records,
 * a nav tree, and the search index derived from it) and nothing detects when
 * they disagree. Here there is a single list: track modules register their
 * lessons, this module orders and indexes them, and `@/nav` and
 * `@/router` derive the nav tree and the route table from the result. Adding a
 * lesson is a one-file operation; the integrity suite fails if the derivations
 * stop agreeing.
 */

import {
  TIERS,
  type Lesson,
  type LessonId,
  type Tier,
  type TrackId,
} from "./types";
import { TRACKS, trackOrder } from "./tracks";
import { foundationsLessons } from "./lessons/foundations";
import { typesLessons } from "./lessons/types";
import { functionsLessons } from "./lessons/functions";
import { structuresLessons } from "./lessons/structures";
import { typeLevelLessons } from "./lessons/type-level";
import { runtimeBoundaryLessons } from "./lessons/runtime-boundary";
import { asyncLessons } from "./lessons/async";
import { nodeMigrationLessons } from "./lessons/node-migration";
import { toolingLessons } from "./lessons/tooling";
import { testingLessons } from "./lessons/testing";

export * from "./types";
export * from "./tracks";
export * from "./presentation";
export * from "./glossary";
export { isPlaceholder, PLACEHOLDER_MARKER } from "./placeholder";

/** Position of a tier in the ladder, used as the secondary sort key. */
const TIER_ORDER = new Map<Tier, number>(
  TIERS.map((tier, index) => [tier, index]),
);

export const tierOrder = (tier: Tier): number =>
  TIER_ORDER.get(tier) ?? TIERS.length;

/**
 * Every registered track's lessons, concatenated. Registration is explicit:
 * a track that is not listed here does not exist as far as the site is
 * concerned, which is the behaviour we want from a source of truth.
 */
const REGISTERED: readonly Lesson[] = [
  ...foundationsLessons,
  ...typesLessons,
  ...functionsLessons,
  ...structuresLessons,
  ...typeLevelLessons,
  ...runtimeBoundaryLessons,
  ...asyncLessons,
  ...nodeMigrationLessons,
  ...toolingLessons,
  ...testingLessons,
];

/**
 * Every lesson, in curriculum order: track, then tier, then the lesson's own
 * order within its track. The sort is total and derived only from the data, so
 * enumeration is identical across processes regardless of module-import order.
 */
export const allLessons: readonly Lesson[] = [...REGISTERED].sort((a, b) => {
  const byTrack = trackOrder(a.track) - trackOrder(b.track);
  if (byTrack !== 0) return byTrack;
  const byTier = tierOrder(a.tier) - tierOrder(b.tier);
  if (byTier !== 0) return byTier;
  return a.order - b.order;
});

const BY_ID = new Map<LessonId, Lesson>(
  allLessons.map((lesson) => [lesson.id, lesson]),
);

/** Look up a lesson. Returns `undefined` for an unknown id rather than throwing. */
export const lessonById = (id: LessonId): Lesson | undefined => BY_ID.get(id);

const BY_TRACK = new Map<TrackId, Lesson[]>();
for (const lesson of allLessons) {
  const bucket = BY_TRACK.get(lesson.track);
  if (bucket) bucket.push(lesson);
  else BY_TRACK.set(lesson.track, [lesson]);
}

/** A track's lessons in track order. Empty for a track with no lessons yet. */
export const lessonsByTrack = (track: TrackId): readonly Lesson[] =>
  BY_TRACK.get(track) ?? [];

const BY_TIER = new Map<Tier, Lesson[]>(TIERS.map((tier) => [tier, []]));
for (const lesson of allLessons) {
  BY_TIER.get(lesson.tier)?.push(lesson);
}

/** A tier's lessons in curriculum order, across every track. */
export const lessonsByTier = (tier: Tier): readonly Lesson[] =>
  BY_TIER.get(tier) ?? [];

/**
 * A lesson's URL. The track segment is redundant given globally unique ids and
 * is there anyway: it makes the URL self-describing and leaves room for a
 * per-track index page without a route collision.
 */
export const lessonRoute = (lesson: Lesson): string =>
  `/lessons/${lesson.track}/${lesson.id}`;

export interface LessonNeighbours {
  previous?: Lesson;
  next?: Lesson;
}

/**
 * The lessons either side of this one *within its track*. Reading follows a
 * track through its tiers rather than sweeping a tier across ten subjects, so
 * this — not the flat `allLessons` order — is what prev/next should use.
 */
export const lessonNeighbours = (id: LessonId): LessonNeighbours => {
  const lesson = BY_ID.get(id);
  if (!lesson) return {};
  const siblings = lessonsByTrack(lesson.track);
  const index = siblings.findIndex((candidate) => candidate.id === id);
  if (index === -1) return {};
  return {
    previous: siblings[index - 1],
    next: siblings[index + 1],
  };
};

export interface LessonCounts {
  total: number;
  byTier: Record<Tier, number>;
  byTrack: Record<TrackId, number>;
}

/** Lesson totals for the curriculum map and the tier badges on it. */
export const lessonCounts = (): LessonCounts => {
  const byTier = Object.fromEntries(
    TIERS.map((tier) => [tier, lessonsByTier(tier).length]),
  ) as Record<Tier, number>;
  const byTrack = Object.fromEntries(
    TRACKS.map((track) => [track.id, lessonsByTrack(track.id).length]),
  ) as Record<TrackId, number>;
  return { total: allLessons.length, byTier, byTrack };
};
