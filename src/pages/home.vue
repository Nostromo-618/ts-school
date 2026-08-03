<script setup lang="ts">
// Placeholder home page. It exists so the scaffold has a route that
// prerenders real markup; the real landing page arrives with the curriculum
// and supporting-pages changes.
const version = __APP_VERSION__;
</script>

<template>
  <section id="home" class="ts-page vd-stack vd-stack-xl">
    <header class="vd-stack vd-stack-md">
      <h1 class="vd-h1">TypeScript School</h1>
      <p class="ts-lead">
        Every lesson is a pair: the JavaScript that breaks on the left, the
        TypeScript that fixes it on the right — and the right pane is live
        against a real compiler.
      </p>
    </header>

    <p class="vd-text-muted">
      Scaffold v{{ version }}. The curriculum, the dual-pane lesson engine, and
      the in-browser type checker land in the changes that follow.
    </p>
  </section>
</template>
