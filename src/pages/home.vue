<script setup lang="ts">
import { RouterLink } from "vue-router";
import { VdIcon } from "@vanduo-oss/vd3";
import {
  TIERS,
  TIER_ICONS,
  TIER_LABELS,
  TRACKS,
  lessonCounts,
  lessonRoute,
  lessonsByTrack,
} from "@/curriculum";

const counts = lessonCounts();

/** The literal first lesson of the curriculum, so the CTA never goes stale. */
const firstLesson = lessonsByTrack(TRACKS[0].id)[0];
</script>

<template>
  <section id="home" class="ts-page vd-stack" data-gap="fib-34">
    <header class="vd-stack" data-gap="fib-13">
      <h1>Learn TypeScript by fixing JavaScript</h1>
      <p class="ts-lead">
        Every lesson is a pair. On the left, idiomatic JavaScript that is
        quietly wrong. On the right, the TypeScript that catches it — live
        against a real compiler running in your browser, not a screenshot of
        one.
      </p>
      <div class="ts-hero-actions">
        <RouterLink
          v-if="firstLesson"
          :to="lessonRoute(firstLesson)"
          class="vd-btn vd-btn-primary"
        >
          Start at the beginning
          <VdIcon name="arrow-right" size="sm" />
        </RouterLink>
        <RouterLink to="/curriculum" class="vd-btn vd-btn-secondary">
          See the whole map
        </RouterLink>
      </div>
    </header>

    <section class="vd-stack" data-gap="fib-13" aria-labelledby="home-shape">
      <h2 id="home-shape">{{ counts.total }} lessons, three tiers</h2>
      <p class="vd-text-muted">
        Written for a working Node.js developer. Read a track top to bottom, or
        take a whole tier across all {{ TRACKS.length }} of them.
      </p>
      <ul class="ts-tier-cards">
        <li v-for="tier in TIERS" :key="tier" class="vd-card">
          <div class="vd-card-body vd-stack" data-gap="fib-5">
            <h3 class="ts-tier-card-title">
              <VdIcon :name="TIER_ICONS[tier]" />
              {{ TIER_LABELS[tier] }}
            </h3>
            <p class="vd-text-muted vd-text-sm">
              {{ counts.byTier[tier] }} lessons
            </p>
          </div>
        </li>
      </ul>
    </section>

    <section class="vd-stack" data-gap="fib-13" aria-labelledby="home-tracks">
      <h2 id="home-tracks">The tracks</h2>
      <ul class="ts-track-grid">
        <li v-for="track in TRACKS" :key="track.id" class="ts-track-grid-item">
          <VdIcon :name="track.icon" />
          <div>
            <p class="ts-track-grid-title">{{ track.title }}</p>
            <p class="vd-text-muted vd-text-sm">{{ track.description }}</p>
          </div>
        </li>
      </ul>
      <p>
        <RouterLink to="/curriculum">Browse every lesson</RouterLink>
        ·
        <RouterLink to="/glossary">Look up a term</RouterLink>
      </p>
    </section>
  </section>
</template>
