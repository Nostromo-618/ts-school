<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <section id="about" class="ts-page vd-stack" data-gap="fib-34">
    <header class="vd-stack" data-gap="fib-8">
      <h1>About TypeScript School</h1>
      <p class="ts-lead">
        A static teaching site whose every lesson is a pair: the JavaScript that
        quietly breaks, and the TypeScript that catches it — with diagnostics
        generated at build time by the same Strada compiler this repo verifies
        in CI.
      </p>
    </header>

    <section class="vd-stack" data-gap="fib-8" aria-labelledby="about-promise">
      <h2 id="about-promise">The promise</h2>
      <p>
        Nothing is hand-waved. Each lesson’s diagnostic list comes from
        <code>typescript-strada@6.0.3</code> at build time; the compiler-truth
        suite re-runs that checker in CI. A lesson cannot claim “TypeScript
        catches this” unless the compiler actually says so. The TypeScript pane
        is editable for practice, but the list shows the
        <strong>authored lesson state</strong> — it does not re-check as you
        type.
      </p>
    </section>

    <section class="vd-stack" data-gap="fib-8" aria-labelledby="about-checking">
      <h2 id="about-checking">How checking works</h2>
      <p>
        Lesson diagnostics are frozen snapshots from build-time Strada output
        for the authored TypeScript. You can edit the pane to experiment; the
        list stays on the lesson’s starting code until content updates.
        Exercises use <strong>Check</strong> to compare your code to the
        authored solution (normalized whitespace). Live typechecking belongs in
        your editor and CI — not in this static site. See
        <RouterLink to="/lessons/tooling/typescript-versions-and-the-go-port"
          >TypeScript 6, 7, and the Go port</RouterLink
        >
        for the dual-install story.
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
      <h2 id="about-checker">TypeScript 7 + Strada for diagnostics</h2>
      <p>
        TypeScript 7 is a Go native rewrite aimed at CLI speed. It ships
        <strong>no programmatic createProgram API</strong> you can embed in a
        browser, so in-worker checking is gone. This site installs
        <code>typescript@7</code> for tooling and
        <code>typescript-strada@6.0.3</code> (the last JavaScript-hosted Strada
        compiler) to generate lesson diagnostics at build time and to power the
        compiler-truth suite. The browser never downloads a compiler; see the
        <RouterLink to="/history">history timeline</RouterLink>.
      </p>
    </section>

    <section class="vd-stack" data-gap="fib-8" aria-labelledby="about-stack">
      <h2 id="about-stack">Built on</h2>
      <p>
        Vue 3, Vite, and vite-ssg (every route prerendered), dogfooding
        <code>@vanduo-oss/vd3</code> and <code>@vanduo-oss/vd3-cbun</code>. No
        CDN fonts or scripts at runtime. Progress, when enabled, lives in
        versioned localStorage — never trusted blindly.
      </p>
    </section>

    <section class="vd-stack" data-gap="fib-8" aria-labelledby="about-terms">
      <h2 id="about-terms">Terms &amp; disclaimer</h2>
      <p>
        TypeScript School is a hobby educational project. Use requires accepting
        a short disclaimer covering liability, AI-assisted content transparency,
        and the MIT license for the code. You can re-read it anytime on the
        <RouterLink to="/terms">Terms</RouterLink> page. Opening the Ask
        assistant shows an additional mandatory AI risk notice (local model
        resources, hallucinations, and edit Accept). Source license:
        <a href="/LICENSE" rel="noopener">MIT LICENSE</a>
        ·
        <a href="/THIRD-PARTY-NOTICES.md" rel="noopener">third-party notices</a>
        (also in the repository root).
      </p>
    </section>

    <p class="ts-hero-actions">
      <RouterLink to="/curriculum" class="vd-btn vd-btn-primary">
        Open the curriculum map
      </RouterLink>
      <RouterLink to="/history" class="vd-btn vd-btn-secondary">
        Read the history
      </RouterLink>
      <RouterLink to="/terms" class="vd-btn vd-btn-ghost-primary">
        Read the terms
      </RouterLink>
    </p>
  </section>
</template>
