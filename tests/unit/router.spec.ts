import { describe, expect, it } from 'vitest';
import { buildRoutes } from '@/router';

// buildRoutes() is the seam the curriculum change appends lesson routes to, so
// its shape is a contract rather than an implementation detail.
describe('buildRoutes', () => {
  it('returns the placeholder home route', () => {
    const routes = buildRoutes();
    const home = routes.find((route) => route.path === '/');

    expect(home).toBeDefined();
    expect(home?.name).toBe('home');
    expect(home?.component).toBeDefined();
  });

  it('ends with the catch-all so later routes can be spliced in front', () => {
    const routes = buildRoutes();
    const last = routes[routes.length - 1];

    expect(last.path).toBe('/:pathMatch(.*)*');
    expect(last.name).toBe('not-found');
  });

  it('gives every route a title for the per-route head', () => {
    for (const route of buildRoutes()) {
      expect(typeof route.meta?.title).toBe('string');
    }
  });

  it('returns a fresh array on each call', () => {
    expect(buildRoutes()).not.toBe(buildRoutes());
  });
});
