<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { useTimeline } from "@vanduo-oss/vd3";
import { VdBarChart, VdLineChart } from "@vanduo-oss/vd3-cbun/charts";
import {
  HISTORY_CHART_DISCLAIMER,
  adoptionLineMeta,
  adoptionLinePoints,
  milestones,
  stackShareMeta,
  stackSharePoints,
  timelineToneClass,
} from "@/data/history";

const timelineRoot = ref<HTMLElement | null>(null);
useTimeline(timelineRoot);

const lineData = adoptionLinePoints.map((point) => ({
  year: point.year,
  typescript: point.typescript,
  javascript: point.javascript,
}));

const barData = stackSharePoints.map((point) => ({
  stack: point.stack,
  share: point.share,
}));

const lineSeries = [
  { name: "TypeScript (illustrative)", y: "typescript" },
  { name: "JavaScript (illustrative)", y: "javascript" },
];
</script>

<template>
  <section id="history" class="ts-page vd-stack" data-gap="fib-34">
    <header class="vd-stack" data-gap="fib-8">
      <h1>From JavaScript to TypeScript</h1>
      <p class="ts-lead">
        A short arc: the language you already ship, the runtime that made it a
        server language, and the type checker that sits beside it — including
        why this school still runs TypeScript 6.0.3 in the browser while the
        compiler itself moves to Go.
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
        <h2 id="history-charts">Adoption shapes</h2>
        <p class="vd-text-muted">{{ HISTORY_CHART_DISCLAIMER }}</p>
      </div>

      <div class="ts-history-charts">
        <figure class="ts-history-chart vd-stack" data-gap="fib-8">
          <figcaption class="vd-stack" data-gap="fib-3">
            <h3 class="ts-history-chart-title">{{ adoptionLineMeta.name }}</h3>
            <p class="vd-text-muted vd-text-sm">
              Relative index over time — teaching the rise of typed JS beside
              plain JavaScript, not counting downloads.
            </p>
          </figcaption>
          <VdLineChart
            :data="lineData"
            x="year"
            :series="lineSeries"
            :legend="true"
            :y-include-zero="true"
            :height="320"
            title="Illustrative relative adoption index"
            description="Illustrative line chart comparing TypeScript and JavaScript relative indexes by year."
            :x-axis="{ label: 'Year' }"
            :y-axis="{ label: 'Relative index' }"
          />
        </figure>

        <figure class="ts-history-chart vd-stack" data-gap="fib-8">
          <figcaption class="vd-stack" data-gap="fib-3">
            <h3 class="ts-history-chart-title">{{ stackShareMeta.name }}</h3>
            <p class="vd-text-muted vd-text-sm">
              A fictional Node-team cohort choosing how much type-checking they
              run day to day.
            </p>
          </figcaption>
          <VdBarChart
            :data="barData"
            x="stack"
            y="share"
            :y-include-zero="true"
            :height="320"
            title="Illustrative stack share among Node teams"
            description="Illustrative bar chart of stack choices among a fictional Node team survey."
            :x-axis="{ label: 'Stack' }"
            :y-axis="{ label: 'Share (%)' }"
          />
        </figure>
      </div>
    </section>

    <p>
      <RouterLink to="/about">Why this school pins TypeScript 6.0.3</RouterLink>
      ·
      <RouterLink to="/curriculum">Browse the curriculum</RouterLink>
    </p>
  </section>
</template>
