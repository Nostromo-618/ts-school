import { describe, expect, it } from 'vitest';
import {
  TIERS,
  TRACKS,
  allLessons,
  lessonById,
  lessonCounts,
  lessonNeighbours,
  lessonRoute,
  lessonsByTier,
  lessonsByTrack,
  tierOrder,
  type Lesson,
  type LessonId,
} from '@/curriculum';

// The curriculum is data, so its consistency is a property to be proved rather
// than a convention to be reviewed. Every assertion here fails loudly with the
// offending id, because a curriculum this size is unreadable as a diff.

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

describe('curriculum registry', () => {
  it('registers at least one lesson', () => {
    expect(allLessons.length).toBeGreaterThan(0);
  });

  it('gives every lesson a unique id', () => {
    const seen = new Map<LessonId, number>();
    for (const lesson of allLessons) {
      seen.set(lesson.id, (seen.get(lesson.id) ?? 0) + 1);
    }
    const duplicates = [...seen.entries()]
      .filter(([, count]) => count > 1)
      .map(([id]) => id);

    expect(duplicates).toEqual([]);
  });

  it('gives every lesson a URL-safe id', () => {
    const unsafe = allLessons
      .filter((lesson) => !ID_PATTERN.test(lesson.id))
      .map((lesson) => lesson.id);

    expect(unsafe).toEqual([]);
  });

  it('gives every lesson a title, summary, and problem statement', () => {
    const incomplete = allLessons
      .filter(
        (lesson) =>
          lesson.title.trim() === '' ||
          lesson.summary.trim() === '' ||
          lesson.problem.trim() === '',
      )
      .map((lesson) => lesson.id);

    expect(incomplete).toEqual([]);
  });

  it('gives every lesson searchable keywords', () => {
    const unkeyworded = allLessons
      .filter((lesson) => lesson.keywords.length === 0)
      .map((lesson) => lesson.id);

    expect(unkeyworded).toEqual([]);
  });

  it('assigns every lesson to a declared track', () => {
    const trackIds = new Set(TRACKS.map((track) => track.id));
    const orphans = allLessons
      .filter((lesson) => !trackIds.has(lesson.track))
      .map((lesson) => lesson.id);

    expect(orphans).toEqual([]);
  });

  it('looks a lesson up by id and returns undefined for an unknown one', () => {
    const first = allLessons[0];

    expect(lessonById(first.id)).toBe(first);
    expect(lessonById('no-such-lesson')).toBeUndefined();
  });

  it('sorts deterministically by track, then tier, then order', () => {
    const key = (lesson: Lesson): string =>
      [
        String(TRACKS.find((track) => track.id === lesson.track)?.order).padStart(
          3,
          '0',
        ),
        String(tierOrder(lesson.tier)),
        String(lesson.order).padStart(3, '0'),
      ].join('/');

    const keys = allLessons.map(key);

    expect(keys).toEqual([...keys].sort());
  });

  it('counts lessons consistently across the registry views', () => {
    const counts = lessonCounts();
    const tierTotal = TIERS.reduce((sum, tier) => sum + counts.byTier[tier], 0);
    const trackTotal = TRACKS.reduce(
      (sum, track) => sum + counts.byTrack[track.id],
      0,
    );

    expect(counts.total).toBe(allLessons.length);
    expect(tierTotal).toBe(allLessons.length);
    expect(trackTotal).toBe(allLessons.length);
    for (const tier of TIERS) {
      expect(lessonsByTier(tier).length).toBe(counts.byTier[tier]);
    }
  });
});

describe('prerequisite graph', () => {
  it('never lists a lesson as its own prerequisite', () => {
    const selfReferencing = allLessons
      .filter((lesson) => lesson.prerequisites.includes(lesson.id))
      .map((lesson) => lesson.id);

    expect(selfReferencing).toEqual([]);
  });

  it('resolves every prerequisite to a registered lesson', () => {
    const dangling: string[] = [];
    for (const lesson of allLessons) {
      for (const prerequisite of lesson.prerequisites) {
        if (!lessonById(prerequisite)) {
          dangling.push(`${lesson.id} -> ${prerequisite}`);
        }
      }
    }

    expect(dangling).toEqual([]);
  });

  it('lists each prerequisite at most once per lesson', () => {
    const repeated = allLessons
      .filter(
        (lesson) =>
          new Set(lesson.prerequisites).size !== lesson.prerequisites.length,
      )
      .map((lesson) => lesson.id);

    expect(repeated).toEqual([]);
  });

  // A real topological sort, not a depth-limited walk: Kahn's algorithm can only
  // consume every node if the graph is acyclic, and whatever it leaves behind is
  // exactly the set of lessons trapped in a cycle.
  it('is acyclic, and a full study order therefore exists', () => {
    const indegree = new Map<LessonId, number>();
    const dependents = new Map<LessonId, LessonId[]>();

    for (const lesson of allLessons) {
      indegree.set(lesson.id, 0);
      dependents.set(lesson.id, []);
    }
    for (const lesson of allLessons) {
      for (const prerequisite of lesson.prerequisites) {
        if (!indegree.has(prerequisite)) continue; // dangling; asserted above
        indegree.set(lesson.id, (indegree.get(lesson.id) ?? 0) + 1);
        dependents.get(prerequisite)?.push(lesson.id);
      }
    }

    const ready = [...indegree.entries()]
      .filter(([, degree]) => degree === 0)
      .map(([id]) => id);
    const ordered: LessonId[] = [];

    while (ready.length > 0) {
      const id = ready.shift() as LessonId;
      ordered.push(id);
      for (const dependent of dependents.get(id) ?? []) {
        const remaining = (indegree.get(dependent) ?? 0) - 1;
        indegree.set(dependent, remaining);
        if (remaining === 0) ready.push(dependent);
      }
    }

    const trapped = allLessons
      .map((lesson) => lesson.id)
      .filter((id) => !ordered.includes(id));

    expect(trapped).toEqual([]);
    expect(ordered).toHaveLength(allLessons.length);
  });

  it('never depends on a lesson of a higher tier', () => {
    const inverted: string[] = [];
    for (const lesson of allLessons) {
      for (const id of lesson.prerequisites) {
        const prerequisite = lessonById(id);
        if (!prerequisite) continue;
        if (tierOrder(prerequisite.tier) > tierOrder(lesson.tier)) {
          inverted.push(
            `${lesson.id} (${lesson.tier}) -> ${prerequisite.id} (${prerequisite.tier})`,
          );
        }
      }
    }

    expect(inverted).toEqual([]);
  });
});

describe('track sequencing', () => {
  it('numbers each track densely from 1', () => {
    const broken: string[] = [];
    for (const track of TRACKS) {
      const orders = lessonsByTrack(track.id).map((lesson) => lesson.order);
      if (orders.length === 0) continue;
      const expected = orders.map((_, index) => index + 1);
      if (JSON.stringify(orders) !== JSON.stringify(expected)) {
        broken.push(`${track.id}: [${orders.join(', ')}]`);
      }
    }

    expect(broken).toEqual([]);
  });

  it('never steps back down the tier ladder within a track', () => {
    const regressions: string[] = [];
    for (const track of TRACKS) {
      const lessons = lessonsByTrack(track.id);
      for (let i = 1; i < lessons.length; i += 1) {
        if (tierOrder(lessons[i].tier) < tierOrder(lessons[i - 1].tier)) {
          regressions.push(
            `${track.id}: ${lessons[i - 1].id} (${lessons[i - 1].tier}) then ${lessons[i].id} (${lessons[i].tier})`,
          );
        }
      }
    }

    expect(regressions).toEqual([]);
  });

  it('walks a track through lessonNeighbours', () => {
    const track = TRACKS.find((candidate) => lessonsByTrack(candidate.id).length > 1);
    expect(track).toBeDefined();

    const lessons = lessonsByTrack(track!.id);
    const first = lessonNeighbours(lessons[0].id);
    const last = lessonNeighbours(lessons[lessons.length - 1].id);
    const middle = lessonNeighbours(lessons[1].id);

    expect(first.previous).toBeUndefined();
    expect(first.next).toBe(lessons[1]);
    expect(last.next).toBeUndefined();
    expect(middle.previous).toBe(lessons[0]);
  });

  it('returns no neighbours for an unknown lesson', () => {
    expect(lessonNeighbours('no-such-lesson')).toEqual({});
  });
});

describe('lesson routes', () => {
  it('namespaces every route under its track', () => {
    for (const lesson of allLessons) {
      expect(lessonRoute(lesson)).toBe(`/lessons/${lesson.track}/${lesson.id}`);
    }
  });

  it('produces a unique route per lesson', () => {
    const routes = allLessons.map(lessonRoute);

    expect(new Set(routes).size).toBe(routes.length);
  });
});
