import { describe, expect, it } from 'vitest';
import { GLOSSARY, glossaryTerms, lessonById, TIERS } from '@/curriculum';

// The glossary links into the curriculum, so it rots the moment a lesson is
// renamed. These assertions turn that rot into a failed build.

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

describe('glossary', () => {
  it('defines terms', () => {
    expect(GLOSSARY.length).toBeGreaterThan(0);
  });

  it('gives every term a unique, anchor-safe id', () => {
    const ids = GLOSSARY.map((term) => term.id);
    const unsafe = ids.filter((id) => !ID_PATTERN.test(id));

    expect(unsafe).toEqual([]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every term a label and a definition', () => {
    const empty = GLOSSARY.filter(
      (term) => term.term.trim() === '' || term.definition.trim() === '',
    ).map((term) => term.id);

    expect(empty).toEqual([]);
  });

  it('tiers every term', () => {
    const tiers = new Set<string>(TIERS);
    const untiered = GLOSSARY.filter((term) => !tiers.has(term.tier)).map(
      (term) => term.id,
    );

    expect(untiered).toEqual([]);
  });

  it('links every term to at least one lesson that exists', () => {
    const broken: string[] = [];
    for (const term of GLOSSARY) {
      if (term.related.length === 0) {
        broken.push(`${term.id}: no related lessons`);
        continue;
      }
      for (const id of term.related) {
        if (!lessonById(id)) broken.push(`${term.id} -> ${id}`);
      }
    }

    expect(broken).toEqual([]);
  });

  it('never links a term to a lesson above its own tier', () => {
    // A reader browsing the beginner glossary should not be sent to an advanced
    // lesson as the definitive explanation of a word they just met.
    const order = new Map(TIERS.map((tier, index) => [tier, index]));
    const inverted: string[] = [];
    for (const term of GLOSSARY) {
      const first = lessonById(term.related[0]);
      if (!first) continue;
      if ((order.get(first.tier) ?? 0) > (order.get(term.tier) ?? 0)) {
        inverted.push(`${term.id} (${term.tier}) -> ${first.id} (${first.tier})`);
      }
    }

    expect(inverted).toEqual([]);
  });

  it('sorts alphabetically for rendering, case-insensitively', () => {
    const sorted = glossaryTerms().map((term) => term.term);
    const expected = [...sorted].sort((a, b) =>
      a.localeCompare(b, 'en', { sensitivity: 'base' }),
    );

    expect(sorted).toEqual(expected);
    expect(sorted).toHaveLength(GLOSSARY.length);
  });
});
