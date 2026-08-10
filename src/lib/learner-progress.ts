/**
 * Compact learner progress summary for AI context / get_learner_progress.
 */

import { TRACKS, allLessons, lessonsByTrack, type TrackId } from "@/curriculum";
import { useProgressStore } from "@/stores/progress";

export interface LearnerProgressTrackSummary {
  trackId: TrackId;
  trackTitle: string;
  completed: number;
  total: number;
  inProgress: number;
}

export interface LearnerProgressSummary {
  completedCount: number;
  inProgressCount: number;
  lessonCount: number;
  byTrack: LearnerProgressTrackSummary[];
  recentLessonIds: string[];
  nextIncompleteLessonIds: string[];
}

const RECENT_LIMIT = 8;
const NEXT_LIMIT = 5;

export function buildLearnerProgressSummary(): LearnerProgressSummary {
  const progress = useProgressStore();
  const lessons = progress.lessons;

  let completedCount = 0;
  let inProgressCount = 0;
  const dated: Array<{ id: string; updatedAt: string }> = [];

  for (const [id, entry] of Object.entries(lessons)) {
    if (entry.status === "complete") completedCount += 1;
    else if (entry.status === "in-progress") inProgressCount += 1;
    dated.push({ id, updatedAt: entry.updatedAt });
  }

  dated.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  const recentLessonIds = dated.slice(0, RECENT_LIMIT).map((d) => d.id);

  const byTrack: LearnerProgressTrackSummary[] = TRACKS.map((track) => {
    const trackLessons = lessonsByTrack(track.id);
    let completed = 0;
    let inProgress = 0;
    for (const lesson of trackLessons) {
      const entry = lessons[lesson.id];
      if (entry?.status === "complete") completed += 1;
      else if (entry?.status === "in-progress") inProgress += 1;
    }
    return {
      trackId: track.id,
      trackTitle: track.title,
      completed,
      total: trackLessons.length,
      inProgress,
    };
  });

  const nextIncompleteLessonIds: string[] = [];
  for (const lesson of allLessons) {
    if (nextIncompleteLessonIds.length >= NEXT_LIMIT) break;
    if (lessons[lesson.id]?.status === "complete") continue;
    nextIncompleteLessonIds.push(lesson.id);
  }

  return {
    completedCount,
    inProgressCount,
    lessonCount: allLessons.length,
    byTrack,
    recentLessonIds,
    nextIncompleteLessonIds,
  };
}
