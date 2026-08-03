<script setup lang="ts">
/**
 * The lesson sidebar: one tier tab, one group per track, one link per lesson.
 *
 * `vd3-docs` toggles its sidebar between two hand-written groups; the derived
 * tree here is tabbed by tier, so the toggle becomes a three-way control. The
 * selected tier follows the route by default — opening an intermediate lesson
 * selects the intermediate tab — so the lessons in view are the ones at the
 * reader's current level. A manual choice pins the tab until the reader
 * navigates to a lesson at a different tier.
 *
 * Styling is the package's `vd-sidenav-*` list contract. Those classes are
 * standalone: only `.vd-sidenav` itself is a fixed drawer, so the nav, section,
 * item, and link rules work in an in-page column.
 */
import { computed, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { VdIcon } from "@vanduo-oss/vd3";
import { TIERS, TIER_ICONS, TIER_LABELS, type Tier } from "@/curriculum";
import { nav, tierForRoute, type NavCategory, type NavSection } from "@/nav";
import { useNavStore } from "@/stores/nav";
import SchoolSidebarFilter from "./SchoolSidebarFilter.vue";

const route = useRoute();
const store = useNavStore();

/** Tabs that exist, in tier order. A tier with no lessons has no tab. */
const tabs = computed(() =>
  TIERS.filter((tier) => nav.tabs.some((tab) => tab.id === tier)),
);

const routeTier = computed<Tier | null>(() => tierForRoute(route.path));

const activeTier = computed<Tier>(
  () => store.pinnedTier ?? routeTier.value ?? tabs.value[0] ?? "beginner",
);

// Navigating to a lesson at another tier releases a pinned tab, so the sidebar
// never shows a tier the reader has just navigated away from.
watch(routeTier, (tier) => {
  if (tier && store.pinnedTier && tier !== store.pinnedTier) {
    store.pinTier(null);
  }
});

const matches = (section: NavSection): boolean => {
  const q = store.filter.trim().toLowerCase();
  if (q.length === 0) return true;
  return (
    section.title.toLowerCase().includes(q) ||
    section.keywords.some((keyword) => keyword.toLowerCase().includes(q))
  );
};

/** Track groups for the active tier, with empty groups dropped. */
const groups = computed<NavCategory[]>(() => {
  const tab = nav.tabs.find((candidate) => candidate.id === activeTier.value);
  if (!tab) return [];
  return tab.categories
    .map((category) => ({
      ...category,
      sections: category.sections.filter(matches),
    }))
    .filter((category) => category.sections.length > 0);
});

const visibleCount = computed(() =>
  groups.value.reduce((total, group) => total + group.sections.length, 0),
);

// Collapsed on small screens, where the sidebar would otherwise push the lesson
// below the fold. The `is-open` class is what the media query keys off.
const expanded = ref(false);
</script>

<template>
  <div class="ts-sidebar">
    <div
      class="ts-sidebar-tiers"
      role="group"
      aria-label="Choose a difficulty tier"
    >
      <button
        v-for="tier in tabs"
        :key="tier"
        type="button"
        class="vd-btn vd-btn-sm"
        :class="activeTier === tier ? 'vd-btn-primary' : 'vd-btn-outline'"
        :aria-pressed="activeTier === tier"
        @click="store.pinTier(tier)"
      >
        <VdIcon :name="TIER_ICONS[tier]" size="sm" />
        {{ TIER_LABELS[tier] }}
      </button>
    </div>

    <SchoolSidebarFilter />

    <button
      type="button"
      class="vd-btn vd-btn-secondary vd-btn-sm ts-sidebar-toggle"
      :aria-expanded="expanded"
      aria-controls="ts-sidebar-nav"
      @click="expanded = !expanded"
    >
      <VdIcon name="list" size="sm" />
      Lessons ({{ visibleCount }})
    </button>

    <nav
      id="ts-sidebar-nav"
      class="ts-sidebar-nav"
      :class="{ 'is-open': expanded }"
      aria-label="Lessons"
    >
      <ul class="vd-sidenav-nav">
        <template v-for="group in groups" :key="group.id">
          <li class="vd-sidenav-section">{{ group.title }}</li>
          <li
            v-for="section in group.sections"
            :key="section.id"
            class="vd-sidenav-item"
            :class="{ active: route.path === section.route }"
          >
            <RouterLink
              :to="section.route"
              class="vd-sidenav-link"
              :data-section="section.id"
              @click="expanded = false"
            >
              {{ section.title }}
            </RouterLink>
          </li>
        </template>
      </ul>

      <p v-if="groups.length === 0" class="vd-text-muted vd-text-sm">
        Nothing at this tier matches “{{ store.filter }}”.
      </p>
    </nav>
  </div>
</template>
