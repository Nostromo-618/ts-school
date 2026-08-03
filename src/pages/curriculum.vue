<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import { VdBadge, VdIcon } from "@vanduo-oss/vd3";
import {
  TIERS,
  TIER_BADGE_VARIANTS,
  TIER_ICONS,
  TIER_LABELS,
  TRACKS,
  lessonCounts,
  lessonRoute,
  lessonsByTrack,
  type Tier,
} from "@/curriculum";

type TierFilter = Tier | "all";

const counts = lessonCounts();
const filter = ref<TierFilter>("all");

const filters: { value: TierFilter; label: string; count: number }[] = [
  { value: "all", label: "Everything", count: counts.total },
  ...TIERS.map((tier) => ({
    value: tier as TierFilter,
    label: TIER_LABELS[tier],
    count: counts.byTier[tier],
  })),
];

/**
 * Tracks with their lessons, filtered by tier. A track with nothing left after
 * filtering drops out entirely rather than rendering an empty card.
 */
const visibleTracks = computed(() =>
  TRACKS.map((track) => ({
    track,
    lessons: lessonsByTrack(track.id).filter(
      (lesson) => filter.value === "all" || lesson.tier === filter.value,
    ),
  })).filter((entry) => entry.lessons.length > 0),
);
</script>

<template>
  <section id="curriculum" class="ts-page vd-stack" data-gap="fib-21">
    <header class="vd-stack" data-gap="fib-8">
      <h1>The curriculum</h1>
      <p class="ts-lead">
        {{ counts.total }} lessons across {{ TRACKS.length }} tracks, each
        pairing the JavaScript that breaks with the TypeScript that fixes it.
        Read a track top to bottom, or take a whole tier across every track.
      </p>
      <dl class="ts-tier-summary">
        <div v-for="tier in TIERS" :key="tier" class="ts-tier-summary-item">
          <dt>
            <VdIcon :name="TIER_ICONS[tier]" size="sm" />
            {{ TIER_LABELS[tier] }}
          </dt>
          <dd>{{ counts.byTier[tier] }} lessons</dd>
        </div>
      </dl>
    </header>

    <div class="ts-filter-bar" role="group" aria-label="Filter by tier">
      <button
        v-for="option in filters"
        :key="option.value"
        type="button"
        class="vd-btn vd-btn-sm"
        :class="filter === option.value ? 'vd-btn-primary' : 'vd-btn-outline'"
        :aria-pressed="filter === option.value"
        @click="filter = option.value"
      >
        {{ option.label }}
        <span class="vd-text-muted">({{ option.count }})</span>
      </button>
    </div>

    <p v-if="visibleTracks.length === 0" class="vd-text-muted" role="status">
      No lessons at this tier yet.
    </p>

    <section
      v-for="entry in visibleTracks"
      :key="entry.track.id"
      class="vd-card ts-track"
      :aria-labelledby="`track-${entry.track.id}`"
    >
      <header class="vd-card-header vd-stack" data-gap="fib-3">
        <h2 :id="`track-${entry.track.id}`" class="ts-track-title">
          <VdIcon :name="entry.track.icon" />
          {{ entry.track.title }}
          <span class="vd-text-muted vd-text-sm">
            {{ entry.lessons.length }}
          </span>
        </h2>
        <p class="vd-text-muted vd-text-sm">{{ entry.track.description }}</p>
        <!--
          Progress seam: `add-learner-features` renders a <VdProgress> here,
          fed by the persisted progress store, showing how many of this track's
          lessons the reader has completed. Nothing else on this page needs to
          change for that.
        -->
      </header>

      <ol class="ts-track-lessons">
        <li
          v-for="lesson in entry.lessons"
          :key="lesson.id"
          class="ts-track-lesson"
        >
          <VdBadge :variant="TIER_BADGE_VARIANTS[lesson.tier]" pill>
            {{ TIER_LABELS[lesson.tier] }}
          </VdBadge>
          <div class="ts-track-lesson-body">
            <RouterLink :to="lessonRoute(lesson)" class="ts-track-lesson-title">
              {{ lesson.title }}
            </RouterLink>
            <p class="vd-text-muted vd-text-sm">{{ lesson.summary }}</p>
          </div>
        </li>
      </ol>
    </section>
  </section>
</template>
