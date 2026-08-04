<script setup lang="ts">
/**
 * Site footer. `VdFooter` from the package supplies the container, the columns,
 * and the copyright row; this component supplies the content.
 *
 * The "Start here" column is derived rather than typed out: it links the first
 * beginner lesson of the first three tracks, so it follows the curriculum
 * instead of going stale beside it.
 */
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { VdFooter } from "@vanduo-oss/vd3";
import { TRACKS, lessonRoute, lessonsByTrack } from "@/curriculum";
import SchoolBrandMark from "@/components/SchoolBrandMark.vue";

const year = new Date().getFullYear();

const startHere = computed(() =>
  TRACKS.slice(0, 3)
    .map((track) => lessonsByTrack(track.id)[0])
    .filter((lesson) => lesson !== undefined)
    .map((lesson) => ({ label: lesson.title, to: lessonRoute(lesson) })),
);

const siteLinks = [
  { label: "Curriculum", to: "/curriculum" },
  { label: "Glossary", to: "/glossary" },
  { label: "History", to: "/history" },
  { label: "About", to: "/about" },
];
</script>

<template>
  <VdFooter :columns="3">
    <div class="vd-row">
      <div class="vd-col-12 vd-col-md-4">
        <section class="vd-footer-section">
          <div class="ts-footer-brand">
            <SchoolBrandMark size="2.5rem" />
            <span class="ts-brand-text">
              <span class="ts-brand-name">TypeScript</span>
              <span class="ts-brand-word">School</span>
            </span>
          </div>
          <p class="vd-text-muted vd-text-sm">
            Every lesson is a pair: the JavaScript that breaks, and the
            TypeScript that catches it — checked by the real compiler.
          </p>
        </section>
      </div>

      <div class="vd-col-12 vd-col-md-4">
        <section class="vd-footer-section">
          <h2 class="vd-footer-heading">The site</h2>
          <ul class="vd-footer-list">
            <li
              v-for="link in siteLinks"
              :key="link.to"
              class="vd-footer-list-item"
            >
              <RouterLink :to="link.to" class="vd-footer-link">
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </section>
      </div>

      <div class="vd-col-12 vd-col-md-4">
        <section class="vd-footer-section">
          <h2 class="vd-footer-heading">Start here</h2>
          <ul class="vd-footer-list">
            <li
              v-for="link in startHere"
              :key="link.to"
              class="vd-footer-list-item"
            >
              <RouterLink :to="link.to" class="vd-footer-link">
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </section>
      </div>
    </div>

    <template #copyright>
      <p class="vd-text-center vd-text-muted vd-text-sm">
        {{ year }} TypeScript School. Built on Vanduo UI.
      </p>
    </template>
  </VdFooter>
</template>
