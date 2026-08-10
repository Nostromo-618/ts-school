<script setup lang="ts">
/**
 * Re-readable terms page for visitors who already accepted. The mandatory gate
 * still owns first-time consent; this page is the footer/About entry point.
 */
import {
  AI_ACT_EUR_LEX_URL,
  DISCLAIMER_INTRO,
  DISCLAIMER_SECTIONS,
  DISCLAIMER_TITLE,
  TOC_VERSION,
} from "@/content/disclaimer";
</script>

<template>
  <section id="terms" class="ts-page vd-stack" data-gap="fib-34">
    <header class="vd-stack" data-gap="fib-8">
      <h1>{{ DISCLAIMER_TITLE }}</h1>
      <p class="ts-lead">{{ DISCLAIMER_INTRO }}</p>
      <p class="vd-text-muted vd-text-sm">Terms version {{ TOC_VERSION }}</p>
    </header>

    <section
      v-for="section in DISCLAIMER_SECTIONS"
      :key="section.heading"
      class="vd-stack"
      data-gap="fib-8"
    >
      <h2>{{ section.heading }}</h2>
      <p>{{ section.body }}</p>
      <p v-if="section.linkHref">
        <a :href="section.linkHref" rel="noopener noreferrer" target="_blank">
          {{ section.linkLabel ?? section.linkHref }}
        </a>
      </p>
    </section>

    <p class="vd-text-muted vd-text-sm">
      AI Act transparency reference:
      <a :href="AI_ACT_EUR_LEX_URL" rel="noopener noreferrer" target="_blank">
        EUR-Lex Regulation (EU) 2024/1689
      </a>
      . Project code/content license:
      <a href="/LICENSE" rel="noopener">MIT</a>
      ·
      <a href="/THIRD-PARTY-NOTICES.md" rel="noopener">Third-party notices</a>
      . Opening the Ask assistant requires a separate AI risk acceptance (local
      model, hallucinations, and edit Confirm).
    </p>
  </section>
</template>
