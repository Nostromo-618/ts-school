<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <section id="not-found" class="ts-page ts-page-centered vd-stack vd-stack-xl">
    <p class="ts-error-code" aria-hidden="true">404</p>
    <h1 class="vd-h2">Page not found</h1>
    <p class="vd-text-muted">
      That URL isn't part of the curriculum. Head back to the start, or open the
      full map.
    </p>
    <p class="ts-hero-actions">
      <RouterLink to="/" class="vd-btn vd-btn-primary">Home</RouterLink>
      <RouterLink to="/curriculum" class="vd-btn vd-btn-secondary">
        Curriculum
      </RouterLink>
    </p>
  </section>
</template>
