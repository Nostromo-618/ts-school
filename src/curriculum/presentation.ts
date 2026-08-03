/**
 * How curriculum data is labelled in the interface.
 *
 * Kept out of `types.ts` — which describes the data — and out of the pages that
 * render it, so the tier ladder reads identically on the sidebar, the
 * curriculum map, the glossary, and the lesson page. `add-lesson-engine`'s
 * `TierBadge` should consume these rather than restating them.
 */

import type { Tier } from "./types";

export const TIER_LABELS: Record<Tier, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

/** Phosphor icon names, without the `ph-` prefix. */
export const TIER_ICONS: Record<Tier, string> = {
  beginner: "plant",
  intermediate: "stairs",
  advanced: "brain",
};

/**
 * `VdBadge` variants for each tier — a green-to-amber heat ladder. `danger` is
 * deliberately unused: an advanced lesson is harder, not broken, and reusing
 * the error colour for difficulty would make real error badges ambiguous.
 */
export const TIER_BADGE_VARIANTS: Record<Tier, "success" | "info" | "warning"> =
  {
    beginner: "success",
    intermediate: "info",
    advanced: "warning",
  };
