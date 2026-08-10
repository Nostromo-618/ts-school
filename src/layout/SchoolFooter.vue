<script setup lang="ts">
/**
 * Site footer. `VdFooter` supplies the shell and copyright row; sections are
 * laid out with `vd-footer-3col` on an inner wrapper (not the `:columns` prop).
 * The prop puts the grid on `<footer>`, which only has one child — the
 * container — so three tracks collapse the content into a third of the width.
 *
 * The "Start here" column is derived: first beginner lesson of the first three
 * tracks, so it follows the curriculum instead of going stale beside it.
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
  { label: "Terms", to: "/terms" },
];
</script>

<template>
  <VdFooter size="sm" class="ts-site-footer">
    <div class="vd-footer-3col ts-footer-columns">
      <section class="vd-footer-section">
        <div class="ts-footer-brand">
          <SchoolBrandMark size="2rem" />
          <span class="ts-brand-text">
            <span class="ts-brand-name">TypeScript</span>
            <span class="ts-brand-word">School</span>
          </span>
        </div>
        <p class="vd-text-muted vd-text-sm ts-footer-blurb">
          Every lesson is a pair: the JavaScript that breaks, and the TypeScript
          that catches it — diagnostics from the real compiler, generated at
          build time and verified in CI.
        </p>
      </section>

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

    <template #copyright>
      <p class="vd-text-center vd-text-muted vd-text-sm">
        {{ year }} TypeScript School. Built on
        <a
          href="https://github.com/vanduo-oss/vd3"
          class="vd-footer-link"
          rel="noopener noreferrer"
          target="_blank"
          >vd3</a
        >
        and
        <a
          href="https://github.com/vanduo-oss/vd3-cbun"
          class="vd-footer-link"
          rel="noopener noreferrer"
          target="_blank"
          >vd3-cbun</a
        >.
      </p>
    </template>
  </VdFooter>
</template>

<style>
/*
 * Compact site footer (~40% shorter vertically). size="sm" already cuts
 * package padding-y; the rest tightens copyright chrome, type, and list gaps
 * without changing dark-theme color tokens.
 */
.ts-site-footer.vd-footer {
  --vd-footer-section-spacing: var(--vd-space-fib-13, 1.3125rem);
  --vd-footer-padding-y-sm: var(--vd-space-fib-13, 1.3125rem);
}

.ts-site-footer .ts-footer-brand {
  gap: var(--vd-space-fib-5, 0.5rem);
  margin-bottom: var(--vd-space-fib-5, 0.5rem);
  font-size: 1rem;
}

.ts-site-footer .ts-footer-blurb {
  line-height: 1.35;
  font-size: var(--vd-font-size-sm, 0.8125rem);
}

.ts-site-footer .vd-footer-heading {
  font-size: var(--vd-font-size-md, 0.9375rem);
  margin-bottom: var(--vd-space-fib-5, 0.5rem);
}

.ts-site-footer .vd-footer-list-item {
  margin-bottom: 0.25rem;
  line-height: 1.3;
}

.ts-site-footer .vd-footer-link {
  font-size: var(--vd-font-size-sm, 0.8125rem);
}

.ts-site-footer .vd-footer-copyright {
  margin-top: var(--vd-space-fib-13, 1.3125rem);
  padding-top: var(--vd-space-fib-8, 0.8125rem);
}
</style>
