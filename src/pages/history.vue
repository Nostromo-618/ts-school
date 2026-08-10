<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { useTimeline } from "@vanduo-oss/vd3";
import { VdBarChart, VdLineChart } from "@vanduo-oss/vd3-cbun/charts";
import {
  HISTORY_DATA_INTRO,
  formatCitation,
  milestones,
  npmWeeklyMeta,
  npmWeeklyPoints,
  octoverseGrowthMeta,
  octoverseGrowthPoints,
  runtimeStoryCitations,
  runtimeUsageMeta,
  runtimeUsagePoints,
  soLanguageMeta,
  soLanguagePoints,
  timelineToneClass,
  tsBalanceMeta,
  tsBalancePoints,
} from "@/data/history";

const timelineRoot = ref<HTMLElement | null>(null);
useTimeline(timelineRoot);

const npmLineData = npmWeeklyPoints.map((point) => ({
  year: point.year,
  downloadsMillions: Math.round((point.downloads / 1_000_000) * 10) / 10,
}));

const soLineData = soLanguagePoints.map((point) => ({
  year: point.year,
  typescript: point.typescript,
  javascript: point.javascript,
}));

const soSeries = [
  { name: "TypeScript", y: "typescript" },
  { name: "JavaScript", y: "javascript" },
];

const balanceBarData = tsBalancePoints.map((point) => ({
  bucket: point.bucket,
  percent: point.percent,
}));

const runtimeBarData = runtimeUsagePoints.map((point) => ({
  runtime: point.runtime,
  percent: point.percent,
}));

const octoverseBarData = octoverseGrowthPoints.map((point) => ({
  language: point.language,
  yoyPercent: point.yoyPercent,
}));
</script>

<template>
  <section id="history" class="ts-page vd-stack" data-gap="fib-34">
    <header class="vd-stack" data-gap="fib-8">
      <h1>From JavaScript to TypeScript</h1>
      <p class="ts-lead">
        A short arc: the language you already ship, the runtimes that execute
        it, and the type checker beside it — including why this school generates
        lesson diagnostics at build time with Strada 6.0.3 while typescript@7
        powers the CLI.
      </p>
    </header>

    <section
      ref="timelineRoot"
      class="vd-stack"
      data-gap="fib-13"
      aria-labelledby="history-timeline"
    >
      <h2 id="history-timeline">Milestones</h2>
      <ol class="vd-timeline vd-timeline-animated">
        <li
          v-for="milestone in milestones"
          :key="milestone.id"
          class="vd-timeline-item"
          :class="timelineToneClass(milestone.tone)"
        >
          <span class="vd-timeline-marker" aria-hidden="true" />
          <div class="vd-timeline-content">
            <p class="vd-timeline-date">{{ milestone.date }}</p>
            <h3 class="vd-timeline-title">{{ milestone.title }}</h3>
            <p class="vd-timeline-text">{{ milestone.body }}</p>
          </div>
        </li>
      </ol>
    </section>

    <section
      class="vd-stack"
      data-gap="fib-21"
      aria-labelledby="history-charts"
    >
      <div class="vd-stack" data-gap="fib-8">
        <h2 id="history-charts">Adoption in public numbers</h2>
        <p class="vd-text-muted">{{ HISTORY_DATA_INTRO }}</p>
      </div>

      <div class="ts-history-charts">
        <figure
          class="ts-history-chart ts-history-chart-wide vd-stack"
          data-gap="fib-8"
        >
          <figcaption class="vd-stack" data-gap="fib-3">
            <h3 class="ts-history-chart-title">{{ npmWeeklyMeta.name }}</h3>
            <p class="vd-text-muted vd-text-sm">{{ npmWeeklyMeta.caption }}</p>
          </figcaption>
          <VdLineChart
            :data="npmLineData"
            x="year"
            y="downloadsMillions"
            :legend="false"
            :y-include-zero="true"
            :height="280"
            :description="npmWeeklyMeta.a11yDescription"
            :x-axis="{ label: npmWeeklyMeta.xLabel }"
            :y-axis="{ label: npmWeeklyMeta.yLabel }"
          />
          <footer class="ts-history-sources vd-text-sm">
            <p v-if="npmWeeklyMeta.notes" class="vd-text-muted">
              {{ npmWeeklyMeta.notes }}
            </p>
            <ul>
              <li v-for="c in npmWeeklyMeta.citations" :key="c.url">
                <a :href="c.url" rel="noopener noreferrer" target="_blank">{{
                  c.label
                }}</a>
                <span class="vd-text-muted"> — {{ formatCitation(c) }}</span>
              </li>
            </ul>
          </footer>
        </figure>

        <figure class="ts-history-chart vd-stack" data-gap="fib-8">
          <figcaption class="vd-stack" data-gap="fib-3">
            <h3 class="ts-history-chart-title">{{ soLanguageMeta.name }}</h3>
            <p class="vd-text-muted vd-text-sm">{{ soLanguageMeta.caption }}</p>
          </figcaption>
          <ul class="ts-history-legend" aria-hidden="true">
            <li v-for="(series, index) in soSeries" :key="series.name">
              <span class="ts-history-legend-swatch" :data-series="index" />
              {{ series.name }}
            </li>
          </ul>
          <VdLineChart
            :data="soLineData"
            x="year"
            :series="soSeries"
            :legend="false"
            :y-include-zero="true"
            :height="280"
            :description="soLanguageMeta.a11yDescription"
            :x-axis="{ label: soLanguageMeta.xLabel }"
            :y-axis="{ label: soLanguageMeta.yLabel }"
          />
          <footer class="ts-history-sources vd-text-sm">
            <p v-if="soLanguageMeta.notes" class="vd-text-muted">
              {{ soLanguageMeta.notes }}
            </p>
            <ul>
              <li v-for="c in soLanguageMeta.citations" :key="c.url">
                <a :href="c.url" rel="noopener noreferrer" target="_blank">{{
                  c.label
                }}</a>
                <span class="vd-text-muted"> — {{ formatCitation(c) }}</span>
              </li>
            </ul>
          </footer>
        </figure>

        <figure class="ts-history-chart vd-stack" data-gap="fib-8">
          <figcaption class="vd-stack" data-gap="fib-3">
            <h3 class="ts-history-chart-title">{{ tsBalanceMeta.name }}</h3>
            <p class="vd-text-muted vd-text-sm">{{ tsBalanceMeta.caption }}</p>
          </figcaption>
          <VdBarChart
            :data="balanceBarData"
            x="bucket"
            y="percent"
            :y-include-zero="true"
            :height="280"
            :description="tsBalanceMeta.a11yDescription"
            :x-axis="{ label: tsBalanceMeta.xLabel }"
            :y-axis="{ label: tsBalanceMeta.yLabel }"
          />
          <footer class="ts-history-sources vd-text-sm">
            <p v-if="tsBalanceMeta.notes" class="vd-text-muted">
              {{ tsBalanceMeta.notes }}
            </p>
            <ul>
              <li v-for="c in tsBalanceMeta.citations" :key="c.url">
                <a :href="c.url" rel="noopener noreferrer" target="_blank">{{
                  c.label
                }}</a>
                <span class="vd-text-muted"> — {{ formatCitation(c) }}</span>
              </li>
            </ul>
          </footer>
        </figure>

        <figure class="ts-history-chart vd-stack" data-gap="fib-8">
          <figcaption class="vd-stack" data-gap="fib-3">
            <h3 class="ts-history-chart-title">{{ runtimeUsageMeta.name }}</h3>
            <p class="vd-text-muted vd-text-sm">
              {{ runtimeUsageMeta.caption }}
            </p>
          </figcaption>
          <VdBarChart
            :data="runtimeBarData"
            x="runtime"
            y="percent"
            :y-include-zero="true"
            :height="280"
            :description="runtimeUsageMeta.a11yDescription"
            :x-axis="{ label: runtimeUsageMeta.xLabel }"
            :y-axis="{ label: runtimeUsageMeta.yLabel }"
          />
          <footer class="ts-history-sources vd-text-sm">
            <ul>
              <li v-for="c in runtimeUsageMeta.citations" :key="c.url">
                <a :href="c.url" rel="noopener noreferrer" target="_blank">{{
                  c.label
                }}</a>
                <span class="vd-text-muted"> — {{ formatCitation(c) }}</span>
              </li>
            </ul>
          </footer>
        </figure>

        <figure class="ts-history-chart vd-stack" data-gap="fib-8">
          <figcaption class="vd-stack" data-gap="fib-3">
            <h3 class="ts-history-chart-title">
              {{ octoverseGrowthMeta.name }}
            </h3>
            <p class="vd-text-muted vd-text-sm">
              {{ octoverseGrowthMeta.caption }}
            </p>
          </figcaption>
          <VdBarChart
            :data="octoverseBarData"
            x="language"
            y="yoyPercent"
            :y-include-zero="true"
            :height="280"
            :description="octoverseGrowthMeta.a11yDescription"
            :x-axis="{ label: octoverseGrowthMeta.xLabel }"
            :y-axis="{ label: octoverseGrowthMeta.yLabel }"
          />
          <footer class="ts-history-sources vd-text-sm">
            <p v-if="octoverseGrowthMeta.notes" class="vd-text-muted">
              {{ octoverseGrowthMeta.notes }}
            </p>
            <ul>
              <li v-for="c in octoverseGrowthMeta.citations" :key="c.url">
                <a :href="c.url" rel="noopener noreferrer" target="_blank">{{
                  c.label
                }}</a>
                <span class="vd-text-muted"> — {{ formatCitation(c) }}</span>
              </li>
            </ul>
          </footer>
        </figure>
      </div>
    </section>

    <section
      class="vd-stack"
      data-gap="fib-13"
      aria-labelledby="history-runtimes"
    >
      <div class="vd-stack" data-gap="fib-8">
        <h2 id="history-runtimes">Runtimes catch up to typed JavaScript</h2>
        <p>
          For most of TypeScript’s life, “run TypeScript” meant a separate
          transpile step (tsc, Babel, esbuild, swc, tsx). Deno and Bun made
          <em>execute .ts</em> feel native first; Node.js followed with built-in
          type stripping. None of these replace the checker — they strip or
          transpile types so V8 / JavaScriptCore can run the leftover
          JavaScript.
        </p>
      </div>

      <article class="vd-stack" data-gap="fib-8" aria-labelledby="history-deno">
        <h3 id="history-deno">
          Deno — secure defaults, TypeScript from day one
        </h3>
        <p>
          Deno (1.0 in 2020) was Ryan Dahl’s redesign of the Node experience:
          permissions denied by default, web-standard APIs (fetch, Request,
          URL), and TypeScript as a first-class input. Under the hood Deno still
          transpile-then-run; <code>deno check</code> (or tsc) remains how you
          get real type errors. The early URL-import bet softened once npm
          compatibility landed — Deno 2.x treats the npm ecosystem as table
          stakes, not a rival.
        </p>
        <p>
          Recent Deno releases keep tightening that Node bridge while shipping
          toolchain features (transpile/pack/CI helpers, desktop targets,
          Deploy). For learners: Deno is where “typed JS + secure runtime +
          batteries” shows up as one product, not a pile of CLI plugins.
        </p>
        <p class="ts-history-inline-cite vd-text-sm vd-text-muted">
          Sources:
          <a
            :href="runtimeStoryCitations.denoBlog.url"
            rel="noopener noreferrer"
            target="_blank"
            >{{ runtimeStoryCitations.denoBlog.label }}</a
          >,
          <a
            :href="runtimeStoryCitations.deno29.url"
            rel="noopener noreferrer"
            target="_blank"
            >{{ runtimeStoryCitations.deno29.label }}</a
          >.
        </p>
      </article>

      <article class="vd-stack" data-gap="fib-8" aria-labelledby="history-bun">
        <h3 id="history-bun">
          Bun — speed, Node compatibility, all-in-one tooling
        </h3>
        <p>
          Bun (1.0 in 2023) aims to replace several tools at once: runtime,
          bundler, test runner, and package manager, with TypeScript and JSX
          accepted without a config ceremony. It runs on JavaScriptCore and
          invests heavily in being a drop-in for Node APIs — the bet is that
          performance and DX win if npm packages Just Work.
        </p>
        <p>
          In late 2025 Bun joined Anthropic while remaining open source; 2026
          releases keep stacking Node-compatibility fixes and built-in APIs.
          State of JS 2024 already showed Bun ahead of Deno among “runtimes I
          regularly use” in that sample — still a fraction of Node, but a real
          second option for scripts, CLIs, and greenfield services.
        </p>
        <p class="ts-history-inline-cite vd-text-sm vd-text-muted">
          Sources:
          <a
            :href="runtimeStoryCitations.bunBlog.url"
            rel="noopener noreferrer"
            target="_blank"
            >{{ runtimeStoryCitations.bunBlog.label }}</a
          >,
          <a
            :href="runtimeStoryCitations.bunAnthropic.url"
            rel="noopener noreferrer"
            target="_blank"
            >{{ runtimeStoryCitations.bunAnthropic.label }}</a
          >,
          <a
            :href="runtimeUsageMeta.citations[0].url"
            rel="noopener noreferrer"
            target="_blank"
            >State of JS 2024 runtimes</a
          >.
        </p>
      </article>

      <article
        class="vd-stack"
        data-gap="fib-8"
        aria-labelledby="history-node-ts"
      >
        <h3 id="history-node-ts">
          Node.js — type stripping, fetch, and erasable syntax
        </h3>
        <p>
          Node’s TypeScript story flipped between 2024 and 2025. Experimental
          <code>--experimental-strip-types</code> (22.6) became the default for
          erasable syntax (23.6 / 22.18) and then <strong>stable</strong> (25.2
          / 24.12). Today you can often run <code>node app.ts</code> when the
          file uses only erasable TypeScript: annotations, interfaces, type-only
          imports. Node replaces that syntax with whitespace — no emit, no type
          checking, no <code>tsconfig</code> path rewriting.
        </p>
        <p>
          What still needs a transformer or a separate build: enums, parameter
          properties, namespaces with runtime code, decorators, and anything
          that depends on <code>tsconfig</code> paths or downleveling. That
          lines up with TypeScript’s own
          <code>erasableSyntaxOnly</code> direction and with this school’s
          emphasis on types-as-erased claims. Pair Node’s runner with
          <code>tsc --noEmit</code> (or Strada / TS7 in CI) when you care about
          correctness — the same split Deno and Bun already taught.
        </p>
        <p>
          Broader Node improvements that matter to TS learners: stable
          <code>fetch</code> and web streams, a built-in test runner, watch
          mode, and a clearer ESM story. JetBrains’ 2024 ecosystem survey also
          put TypeScript among the languages with the strongest multi-year
          adoption climb (about 12% in 2017 to the mid-30s by 2024) — another
          lens beside Stack Overflow and GitHub.
        </p>
        <p class="ts-history-inline-cite vd-text-sm vd-text-muted">
          Sources:
          <a
            :href="runtimeStoryCitations.nodeTypescript.url"
            rel="noopener noreferrer"
            target="_blank"
            >{{ runtimeStoryCitations.nodeTypescript.label }}</a
          >,
          <a
            :href="runtimeStoryCitations.nodeLearn.url"
            rel="noopener noreferrer"
            target="_blank"
            >{{ runtimeStoryCitations.nodeLearn.label }}</a
          >,
          <a
            :href="runtimeStoryCitations.jetbrains2024.url"
            rel="noopener noreferrer"
            target="_blank"
            >{{ runtimeStoryCitations.jetbrains2024.label }}</a
          >.
        </p>
      </article>
    </section>

    <p>
      <RouterLink to="/about#about-checker"
        >How this school dual-installs TypeScript 7 and Strada</RouterLink
      >
      ·
      <RouterLink to="/curriculum">Browse the curriculum</RouterLink>
    </p>
  </section>
</template>
