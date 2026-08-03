import { defineStore } from "pinia";
import { ref } from "vue";
import type { Tier } from "@/curriculum";

/**
 * Sidebar UI state.
 *
 * Ported from `vd3-docs/src/stores/nav.ts`, whose second field was
 * `activeCategoryId` — it had one axis (components against guides). The derived
 * tree here is tabbed by tier, so the field is the selected tier instead.
 *
 * `null` means "follow the route": the sidebar shows the tier of the lesson
 * being read. Choosing a tab pins it until the reader navigates to a lesson at
 * another tier.
 */
export const useNavStore = defineStore("nav", () => {
  const filter = ref("");
  const pinnedTier = ref<Tier | null>(null);

  const setFilter = (value: string): void => {
    filter.value = value;
  };

  const clearFilter = (): void => {
    filter.value = "";
  };

  const pinTier = (tier: Tier | null): void => {
    pinnedTier.value = tier;
  };

  return { filter, pinnedTier, setFilter, clearFilter, pinTier };
});
