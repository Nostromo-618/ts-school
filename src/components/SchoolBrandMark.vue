<script setup lang="ts">
/**
 * The TypeScript School mark, inline so it inherits colour and needs no extra
 * request. Kept in step with `public/favicon.svg` — the letterforms and the
 * corner radius are the same drawing at two sizes.
 *
 * Inline SVG rather than an <img>: `v-html` is banned repo-wide and an external
 * file could not follow the theme.
 */
withDefaults(defineProps<{ size?: string; title?: string }>(), {
  size: "2.25rem",
  title: "",
});
</script>

<template>
  <svg
    class="ts-brand-mark"
    :style="{ width: size, height: size }"
    viewBox="0 0 64 64"
    :role="title ? 'img' : 'presentation'"
    :aria-label="title || undefined"
    :aria-hidden="title ? undefined : 'true'"
    focusable="false"
  >
    <rect width="64" height="64" rx="12" fill="currentColor" />
    <path
      fill="var(--vd-color-white, #fff)"
      d="M13 26.5h20v5.4h-7.1V50h-5.8V31.9H13zM52.6 47.2q1.4-2 1.4-4.9 0-2.7-1.4-4.5-1.3-1.8-4.7-3.2l-3.2-1.3q-1.6-.7-2.2-1.4-.6-.7-.6-1.7 0-1.2.9-1.9.9-.7 2.5-.7 2.6 0 5.5 1.9v-5.4q-2.6-1.3-5.9-1.3-3.9 0-6.3 2t-2.4 5.4q0 4.4 5.1 6.6l3 1.3q1.8.8 2.4 1.5.7.8.7 1.9 0 1.3-1 2t-2.9.7q-3.2 0-6.4-2.5v5.8q2.9 1.6 6.7 1.6 4.4 0 7-2q1.4-1 1.8-1.9z"
    />
  </svg>
</template>
