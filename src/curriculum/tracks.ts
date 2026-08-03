/**
 * The ten subject tracks, in curriculum order.
 *
 * Order is a teaching decision, not an alphabetisation: a reader working
 * straight down the list meets the language before the type system, the type
 * system before its edges, and the edges before the tooling that enforces them.
 * The Node.js migration track sits late on purpose — it is the destination this
 * site is aimed at, and it reads best once the reader can already narrow a
 * union and type a callback.
 */

import type { Track, TrackId } from "./types";

export const TRACKS: readonly Track[] = [
  {
    id: "foundations",
    title: "Foundations",
    icon: "compass",
    order: 1,
    description:
      "Why a JavaScript developer would want types at all, what tsc does with them, and how to read what it says back.",
  },
  {
    id: "types",
    title: "Types & narrowing",
    icon: "shapes",
    order: 2,
    description:
      "Primitives, literals, unions, and the control-flow analysis that turns a union into the one type you actually have.",
  },
  {
    id: "functions",
    title: "Functions & generics",
    icon: "function",
    order: 3,
    description:
      "Parameters, returns, callbacks, overloads, and the generics that let one function keep its caller's types.",
  },
  {
    id: "structures",
    title: "Objects, classes & modules",
    icon: "cube",
    order: 4,
    description:
      "Interfaces against type aliases, class members and visibility, and how modules carry types across file boundaries.",
  },
  {
    id: "type-level",
    title: "Type-level programming",
    icon: "function",
    order: 5,
    description:
      "Conditional, mapped, and template-literal types — computing types from types, and knowing when to stop.",
  },
  {
    id: "runtime-boundary",
    title: "The runtime boundary",
    icon: "shield-check",
    order: 6,
    description:
      "Where static types end and untrusted input begins: unknown, type guards, parsing, and validating what came off the wire.",
  },
  {
    id: "async",
    title: "Async, errors & Result",
    icon: "arrows-clockwise",
    order: 7,
    description:
      "Promises, async iteration, the fact that catch gives you unknown, and typed alternatives to throwing.",
  },
  {
    id: "node-migration",
    title: "Node.js migration",
    icon: "hard-drives",
    order: 8,
    description:
      "Taking a real Node service from JavaScript to TypeScript: CommonJS to ESM, @types, node: builtins, env, streams, and fs.",
  },
  {
    id: "tooling",
    title: "Tooling & the strictness ladder",
    icon: "wrench",
    order: 9,
    description:
      "tsconfig flag by flag, module resolution, build pipelines, and turning strictness up without stopping the world.",
  },
  {
    id: "testing",
    title: "Testing with types",
    icon: "test-tube",
    order: 10,
    description:
      "Typed tests, typed mocks, and asserting on types themselves so a refactor cannot silently change a public signature.",
  },
] as const;

/** Track ids in curriculum order. */
export const TRACK_IDS: readonly TrackId[] = TRACKS.map((track) => track.id);

const TRACK_BY_ID = new Map<TrackId, Track>(
  TRACKS.map((track) => [track.id, track]),
);

/** Track order index, used as the primary sort key of the registry. */
const TRACK_ORDER = new Map<TrackId, number>(
  TRACKS.map((track) => [track.id, track.order]),
);

export const trackById = (id: TrackId): Track | undefined =>
  TRACK_BY_ID.get(id);

/**
 * Sort weight for a track. Falls back past the last real track so an id that
 * somehow escapes the union sorts last instead of colliding with `foundations`.
 */
export const trackOrder = (id: TrackId): number =>
  TRACK_ORDER.get(id) ?? TRACKS.length + 1;
