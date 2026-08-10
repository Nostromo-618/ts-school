<script setup lang="ts">
import { RouterLink } from "vue-router";

type TechLink = { label: string; href: string };

type TechItem = {
  name: string;
  href: string;
  blurb: string;
  extraLinks?: TechLink[];
};

type TechGroup = {
  id: string;
  title: string;
  intro?: string;
  items: TechItem[];
};

const techGroups: TechGroup[] = [
  {
    id: "app-shell",
    title: "App shell",
    intro:
      "A static Vue app: every public route is prerendered; no CDN fonts or scripts at runtime.",
    items: [
      {
        name: "Vue 3",
        href: "https://vuejs.org/",
        blurb: "UI framework for the shell, lessons, and overlays.",
      },
      {
        name: "Vite",
        href: "https://vite.dev/",
        blurb: "Dev server and production bundler.",
      },
      {
        name: "vite-ssg",
        href: "https://github.com/antfu-collective/vite-ssg",
        blurb: "Static-site generation — routes are prerendered at build time.",
      },
      {
        name: "vue-router",
        href: "https://router.vuejs.org/",
        blurb: "Client and prerender routing for pages and lessons.",
      },
      {
        name: "Pinia",
        href: "https://pinia.vuejs.org/",
        blurb: "Client state (progress, notes, search, Ask, theme).",
      },
      {
        name: "@unhead/vue",
        href: "https://unhead.unjs.io/",
        blurb: "Document head titles and meta for prerendered pages.",
      },
    ],
  },
  {
    id: "design-system",
    title: "Design system",
    intro:
      "The site dogfoods published vanduo packages rather than a one-off CSS kit.",
    items: [
      {
        name: "@vanduo-oss/vd3",
        href: "https://github.com/vanduo-oss/vd3",
        blurb:
          "Layout primitives, buttons, forms, timeline, footer, and self-hosted fonts/icons.",
        extraLinks: [
          {
            label: "npm",
            href: "https://www.npmjs.com/package/@vanduo-oss/vd3",
          },
        ],
      },
      {
        name: "@vanduo-oss/vd3-cbun",
        href: "https://github.com/vanduo-oss/vd3-cbun",
        blurb: "Charts and content bundles used on pages like History.",
        extraLinks: [
          {
            label: "npm",
            href: "https://www.npmjs.com/package/@vanduo-oss/vd3-cbun",
          },
        ],
      },
      {
        name: "@vanduo-oss/vdl-engines",
        href: "https://github.com/vanduo-oss/labs",
        blurb:
          "Search and chat engine helpers from vanduo labs (local file dependency until published to npm).",
      },
    ],
  },
  {
    id: "typescript",
    title: "TypeScript dual install",
    intro:
      "Primary CLI is TypeScript 7; build-time lesson diagnostics still need the Strada (JS) Compiler API. Details on the History page and the tooling lesson.",
    items: [
      {
        name: "TypeScript 7",
        href: "https://www.typescriptlang.org/",
        blurb:
          "Native Go CLI (typescript@7) for project tooling — not embedded in the browser.",
      },
      {
        name: "typescript-strada",
        href: "https://www.npmjs.com/package/@typescript/typescript6",
        blurb:
          "Local alias of typescript@6.0.3 / the Microsoft Strada API line (@typescript/typescript6) for createProgram, diagnostic generation, compiler-truth, and vue-tsc.",
      },
      {
        name: "vue-tsc",
        href: "https://github.com/vuejs/language-tools",
        blurb:
          "Vue SFC typecheck via a Strada-aware wrapper (native TS 7 has no ./lib/tsc API for this).",
      },
    ],
  },
  {
    id: "quality",
    title: "Quality & accessibility",
    items: [
      {
        name: "Vitest",
        href: "https://vitest.dev/",
        blurb:
          "Unit tests, including the compiler-truth suite over lesson diagnostics.",
        extraLinks: [
          { label: "jsdom", href: "https://github.com/jsdom/jsdom" },
          {
            label: "@vue/test-utils",
            href: "https://test-utils.vuejs.org/",
          },
        ],
      },
      {
        name: "Playwright",
        href: "https://playwright.dev/",
        blurb:
          "End-to-end coverage (Chromium Desktop/Mobile in the release gate).",
      },
      {
        name: "axe-core",
        href: "https://github.com/dequelabs/axe-core",
        blurb: "Accessibility scans via @axe-core/playwright in e2e.",
        extraLinks: [
          {
            label: "@axe-core/playwright",
            href: "https://www.npmjs.com/package/@axe-core/playwright",
          },
        ],
      },
      {
        name: "ESLint",
        href: "https://eslint.org/",
        blurb:
          "Lint with typescript-eslint / eslint-plugin-vue (parser runs through a Strada wrapper).",
        extraLinks: [
          {
            label: "typescript-eslint",
            href: "https://typescript-eslint.io/",
          },
        ],
      },
      {
        name: "Prettier",
        href: "https://prettier.io/",
        blurb: "Format check for src TypeScript, Vue, and CSS.",
      },
      {
        name: "Stylelint",
        href: "https://stylelint.io/",
        blurb: "CSS lint over src/**/*.css with stylelint-config-standard.",
      },
    ],
  },
  {
    id: "search-ai",
    title: "Search & optional on-device AI",
    intro:
      "Curriculum browsing works without models. Ask and hybrid search are opt-in; see Terms for the AI risk notice.",
    items: [
      {
        name: "Fuse.js",
        href: "https://www.fusejs.io/",
        blurb:
          "Fuzzy text search over the curriculum index (bundled, CSP-friendly).",
      },
      {
        name: "Transformers.js",
        href: "https://huggingface.co/docs/transformers.js",
        blurb:
          "@huggingface/transformers at build time to generate search embedding vectors (not required for core browsing).",
        extraLinks: [
          {
            label: "Hugging Face",
            href: "https://huggingface.co/",
          },
        ],
      },
      {
        name: "LiteRT-LM",
        href: "https://ai.google.dev/edge/litert-lm/js",
        blurb:
          "@litert-lm/core runs optional local chat in the browser (WebGPU); weights are not shipped in the static dist.",
        extraLinks: [
          {
            label: "@litert-lm/core",
            href: "https://www.npmjs.com/package/@litert-lm/core",
          },
        ],
      },
      {
        name: "Gemma",
        href: "https://ai.google.dev/gemma",
        blurb:
          "Optional on-device model weights (e.g. litert-community Gemma builds on Hugging Face) for the Ask assistant.",
      },
    ],
  },
  {
    id: "toolchain",
    title: "Toolchain & CI",
    items: [
      {
        name: "pnpm",
        href: "https://pnpm.io/",
        blurb: "Package manager (pinned; engines require pnpm ≥ 11).",
      },
      {
        name: "mise",
        href: "https://mise.jdx.dev/",
        blurb: "Pins Node 24 and pnpm for reproducible local and CI shells.",
      },
      {
        name: "Node.js",
        href: "https://nodejs.org/",
        blurb:
          "Runtime for scripts, vite-ssg, and the release gate (Node ≥ 24).",
      },
      {
        name: "GitHub Actions",
        href: "https://docs.github.com/en/actions",
        blurb:
          "CI on main (lint, tests, build, Playwright) and a separate Pages deploy workflow.",
      },
    ],
  },
  {
    id: "process",
    title: "How it is built",
    intro:
      "Hobby project — no corporate sponsorship implied. Specs and an AI-assisted editor are part of the workflow, disclosed on Terms.",
    items: [
      {
        name: "OpenSpec",
        href: "https://openspec.dev/",
        blurb:
          "Change proposals, specs, and archived tasks drive non-trivial work in this repo.",
      },
      {
        name: "Cursor",
        href: "https://cursor.com/",
        blurb:
          "Cursor IDE used for AI-assisted development of the site and curriculum tooling.",
      },
    ],
  },
];
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

    <section class="vd-stack" data-gap="fib-13" aria-labelledby="about-stack">
      <div class="vd-stack" data-gap="fib-8">
        <h2 id="about-stack">Built with</h2>
        <p>
          Honest inventory of what ships this hobby site — frameworks,
          design-system packages, the TypeScript dual install, quality tools,
          optional local AI, and the editor/process used to develop it.
          Progress, when enabled, lives in versioned localStorage — never
          trusted blindly. Model weights and AI limits are covered on
          <RouterLink to="/terms">Terms</RouterLink>; the Strada-vs-TS-7 story
          continues on <RouterLink to="/history">History</RouterLink>.
        </p>
      </div>

      <section
        v-for="group in techGroups"
        :id="`about-tech-${group.id}`"
        :key="group.id"
        class="vd-stack"
        data-gap="fib-8"
        :aria-labelledby="`about-tech-${group.id}-title`"
      >
        <div class="vd-stack" data-gap="fib-3">
          <h3 :id="`about-tech-${group.id}-title`">{{ group.title }}</h3>
          <p v-if="group.intro" class="vd-text-muted">{{ group.intro }}</p>
        </div>
        <dl class="ts-tech-list">
          <div
            v-for="item in group.items"
            :key="item.name"
            class="ts-tech-item"
          >
            <dt class="ts-tech-name">
              <a
                :href="item.href"
                rel="noopener noreferrer"
                target="_blank"
                >{{ item.name }}</a
              >
              <template v-if="item.extraLinks?.length">
                <span class="vd-text-muted" aria-hidden="true"> · </span>
                <template
                  v-for="(link, index) in item.extraLinks"
                  :key="link.href"
                >
                  <a
                    :href="link.href"
                    class="vd-text-sm"
                    rel="noopener noreferrer"
                    target="_blank"
                    >{{ link.label }}</a
                  ><span
                    v-if="index < (item.extraLinks?.length ?? 0) - 1"
                    class="vd-text-muted"
                    aria-hidden="true"
                  >
                    ·
                  </span>
                </template>
              </template>
            </dt>
            <dd class="ts-tech-blurb">{{ item.blurb }}</dd>
          </div>
        </dl>
      </section>
    </section>

    <section class="vd-stack" data-gap="fib-8" aria-labelledby="about-terms">
      <h2 id="about-terms">Terms &amp; disclaimer</h2>
      <p>
        TypeScript School is a hobby educational project. Use requires accepting
        a short disclaimer covering liability, AI-assisted content and Ask
        assistant risks (local model resources, hallucinations, edit Accept),
        and the MIT license for the code. You can re-read it anytime on the
        <RouterLink to="/terms">Terms</RouterLink> page. Source license:
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
