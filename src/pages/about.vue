<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <section id="about" class="ts-page vd-stack" data-gap="fib-34">
    <header class="vd-stack" data-gap="fib-8">
      <h1>About TypeScript School</h1>
      <p class="ts-lead">
        A static teaching site whose every lesson is a pair: the JavaScript that
        quietly breaks, and the TypeScript that catches it — checked live by a
        real compiler in your browser.
      </p>
    </header>

    <section class="vd-stack" data-gap="fib-8" aria-labelledby="about-promise">
      <h2 id="about-promise">The promise</h2>
      <p>
        Nothing is hand-waved. The TypeScript pane is editable. A Web Worker
        runs the same TypeScript compiler this repo pins for
        <code>vue-tsc</code>, ESLint, and CI. A lesson cannot claim “TypeScript
        catches this” unless the compiler actually says so.
      </p>
    </section>

    <section class="vd-stack" data-gap="fib-8" aria-labelledby="about-audience">
      <h2 id="about-audience">Who it is for</h2>
      <p>
        Working Node.js developers who already ship JavaScript — closures,
        promises, streams, production incidents — and want a defensible ramp
        into types, the runtime boundary, and the strictness ladder without
        pretending they have never written a server.
      </p>
    </section>

    <section class="vd-stack" data-gap="fib-8" aria-labelledby="about-checker">
      <h2 id="about-checker">Why TypeScript 6.0.3, not 7</h2>
      <p>
        TypeScript 7 is a Go native rewrite aimed at CLI speed. It ships
        <strong>no programmatic API</strong> you can embed in a browser, so it
        cannot power live lesson diagnostics. This site therefore pins
        <code>typescript@6.0.3</code> — the last JavaScript-hosted (Strada)
        compiler — for the in-browser worker and for every CI gate that must
        agree with what the learner sees. That constraint is a teaching point,
        not a temporary oversight; see the
        <RouterLink to="/history">history timeline</RouterLink>.
      </p>
    </section>

    <section class="vd-stack" data-gap="fib-8" aria-labelledby="about-stack">
      <h2 id="about-stack">Built on</h2>
      <p>
        Vue 3, Vite, and vite-ssg (every route prerendered), dogfooding
        <code>@vanduo-oss/vd3</code> and <code>@vanduo-oss/vd3-cbun</code>. No
        CDN fonts or scripts at runtime; libs for the worker are same-origin.
        Progress, when enabled, lives in versioned localStorage — never trusted
        blindly.
      </p>
    </section>

    <p class="ts-hero-actions">
      <RouterLink to="/curriculum" class="vd-btn vd-btn-primary">
        Open the curriculum map
      </RouterLink>
      <RouterLink to="/history" class="vd-btn vd-btn-secondary">
        Read the history
      </RouterLink>
    </p>
  </section>
</template>
