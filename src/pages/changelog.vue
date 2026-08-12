<script setup lang="ts">
/**
 * Release notes for dev-v0.2.0 and recent work on this branch.
 * Static page — prerendered like About and Terms.
 */

type ChangeEntry = {
  title: string;
  items: string[];
};

const releases: ChangeEntry[] = [
  {
    title: "dev-v0.2.0 (in progress)",
    items: [
      "Consume published @vanduo-oss/vdl-ai-chat and vdl-hybrid-search from npm instead of vendored copies.",
      "Ask assistant: LiteRT Cache Storage so reload reuses downloaded weights; same-origin ORT WASM for CSP-safe semantic search.",
      "Ask tutor hardening — jailbreak policy alerts, tool-backed curriculum search, explore campaign findings documented under data/ask-explore/v0.2.0/.",
      "Pending edit banner moved beside the composer with a soft attention pulse.",
      "Persist Ask chat history in localStorage (ts-school-ai-chat-history); sidebar clear-chat control; Profile export/clear; TOC v5 privacy copy.",
      "Theme defaults: indigo primary, radius 0.5 (vd3 themeDefaults in main.ts).",
      "CI: public Pages deploy, Linux Chromium visual baselines, release-gate fixes.",
    ],
  },
  {
    title: "Earlier on main (pre-v0.2.0)",
    items: [
      "Full curriculum prose polish and lesson solution sections.",
      "Learner Profile, notes modal, Neptune hybrid search, and local Gemma Ask sidebar.",
      "Build-time Strada diagnostics with typescript@7 tooling; vite-ssg static prerender.",
    ],
  },
];
</script>

<template>
  <section id="changelog" class="ts-page vd-stack" data-gap="fib-34">
    <header class="vd-stack" data-gap="fib-8">
      <h1>Changelog</h1>
      <p class="ts-lead">
        Meaningful changes on the dev-v0.2.0 line and recent releases. This page
        is informational — the
        <a href="https://github.com/vanduo-oss/ts-school">repository</a>
        commit history is the source of truth.
      </p>
    </header>

    <section
      v-for="release in releases"
      :key="release.title"
      class="vd-stack"
      data-gap="fib-13"
    >
      <h2>{{ release.title }}</h2>
      <ul class="ts-changelog-list">
        <li v-for="item in release.items" :key="item">{{ item }}</li>
      </ul>
    </section>
  </section>
</template>

<style scoped>
.ts-changelog-list {
  margin: 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: var(--vd-space-fib-5, 0.5rem);
  line-height: 1.5;
}
</style>
