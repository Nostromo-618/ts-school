import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { allLessons, lessonRoute } from '@/curriculum';
import { navSections } from '@/nav';
import { useSearchStore } from '@/stores/search';

// The search index is the second consumer of the derived nav tree, and the one
// a reader notices first when it is wrong.

describe('search store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('indexes every lesson plus the standalone pages', () => {
    const store = useSearchStore();
    const routes = new Set(store.entries.map((entry) => entry.route));

    for (const lesson of allLessons) {
      expect(routes.has(lessonRoute(lesson))).toBe(true);
    }
    expect(routes.has('/curriculum')).toBe(true);
    expect(store.entries.length).toBe(navSections().length + 3);
  });

  it('stays quiet below the minimum query length', () => {
    const store = useSearchStore();
    store.query = 'a';

    expect(store.results).toEqual([]);
  });

  it('matches titles, keywords, and routes', () => {
    const store = useSearchStore();

    store.query = 'narrowing';
    expect(store.results.length).toBeGreaterThan(0);

    // "prototype pollution" appears in a lesson's keywords, not its title.
    store.query = 'prototype pollution';
    const keywordHit = store.results.find(
      (result) => result.entry.id.endsWith('deserialization-attack-surface'),
    );
    expect(keywordHit).toBeDefined();

    store.query = '/lessons/node-migration/';
    expect(store.results.length).toBeGreaterThan(0);
  });

  it('ranks title matches above keyword and route matches', () => {
    const store = useSearchStore();
    store.query = 'generics';
    const scores = store.results.map((result) => result.score);

    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });

  it('splits the title so the view can emphasise without markup', () => {
    const store = useSearchStore();
    store.query = 'generics';
    const hit = store.results.find(
      (result) => result.segments.match.length > 0,
    );

    expect(hit).toBeDefined();
    const { before, match, after } = hit!.segments;
    expect(before + match + after).toBe(hit!.entry.title);
    expect(match.toLowerCase()).toBe('generics');
  });

  it('groups results and keeps the keyboard order in step with the render', () => {
    const store = useSearchStore();
    store.query = 'type';

    const flattened = store.groups.flatMap((group) => group.results);
    expect(store.ordered).toEqual(flattened);
    expect(store.ordered.length).toBe(store.results.length);
  });

  it('wraps the cursor at both ends', () => {
    const store = useSearchStore();
    store.query = 'type';
    const count = store.ordered.length;
    expect(count).toBeGreaterThan(1);

    store.move(-1);
    expect(store.activeIndex).toBe(count - 1);
    store.move(1);
    expect(store.activeIndex).toBe(0);
  });

  it('clears the query when closed', () => {
    const store = useSearchStore();
    store.open();
    store.query = 'unions';
    store.close();

    expect(store.isOpen).toBe(false);
    expect(store.query).toBe('');
    expect(store.activeIndex).toBe(0);
  });
});
