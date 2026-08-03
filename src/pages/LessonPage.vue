<script setup lang="ts">
/**
 * PLACEHOLDER — replaced by `add-lesson-engine`.
 *
 * One route component renders every lesson: the route table supplies the id,
 * this component resolves the `Lesson` from the registry. That contract is the
 * finished one. What is placeholder is the *body*: the dual-pane editor, the
 * live diagnostics list, the quiz and exercise blocks all belong to the lesson
 * engine, and until they exist this page renders the lesson's metadata and says
 * plainly that the body is not written yet.
 *
 * The lesson-engine agent replaces everything below the `lesson` lookup. It
 * should not need to touch `src/router.ts`, `src/nav.ts`, or `src/curriculum/`.
 */
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { VdBadge, VdIcon } from "@vanduo-oss/vd3";
import {
  TIER_BADGE_VARIANTS,
  TIER_LABELS,
  isPlaceholder,
  lessonById,
  lessonNeighbours,
  lessonRoute,
  trackById,
} from "@/curriculum";

const props = defineProps<{ lessonId: string }>();

const lesson = computed(() => lessonById(props.lessonId));
const track = computed(() =>
  lesson.value ? trackById(lesson.value.track) : undefined,
);
const neighbours = computed(() => lessonNeighbours(props.lessonId));
const prerequisites = computed(() =>
  (lesson.value?.prerequisites ?? [])
    .map((id) => lessonById(id))
    .filter((candidate) => candidate !== undefined),
);
const isUnwritten = computed(
  () => lesson.value !== undefined && isPlaceholder(lesson.value.ts),
);
</script>

<template>
  <article v-if="lesson" class="ts-page vd-stack" data-gap="fib-21">
    <header class="vd-stack" data-gap="fib-8">
      <nav class="vd-breadcrumb" aria-label="Breadcrumb">
        <ol class="vd-breadcrumb-list">
          <li class="vd-breadcrumb-item">
            <RouterLink to="/curriculum" class="vd-breadcrumb-link">
              Curriculum
            </RouterLink>
          </li>
          <li class="vd-breadcrumb-item">
            <span aria-current="page">{{ track?.title ?? lesson.track }}</span>
          </li>
        </ol>
      </nav>

      <h1>{{ lesson.title }}</h1>

      <div class="vd-inline" data-gap="fib-5">
        <VdBadge :variant="TIER_BADGE_VARIANTS[lesson.tier]" pill>
          {{ TIER_LABELS[lesson.tier] }}
        </VdBadge>
        <span class="vd-text-muted vd-text-sm">
          <VdIcon :name="track?.icon ?? 'circle'" size="sm" />
          {{ track?.title ?? lesson.track }}
        </span>
      </div>

      <p class="ts-lead">{{ lesson.summary }}</p>
    </header>

    <section class="vd-stack" data-gap="fib-5" aria-labelledby="lesson-problem">
      <h2 id="lesson-problem">The problem</h2>
      <p>{{ lesson.problem }}</p>
    </section>

    <section
      v-if="prerequisites.length > 0"
      class="vd-stack"
      data-gap="fib-5"
      aria-labelledby="lesson-prerequisites"
    >
      <h2 id="lesson-prerequisites">Read these first</h2>
      <ul>
        <li v-for="prerequisite in prerequisites" :key="prerequisite.id">
          <RouterLink :to="lessonRoute(prerequisite)">
            {{ prerequisite.title }}
          </RouterLink>
        </li>
      </ul>
    </section>

    <!-- Replaced by DualPane + DiagnosticsList in `add-lesson-engine`. -->
    <p v-if="isUnwritten" class="vd-alert vd-alert-info" role="status">
      This lesson is on the map but not written yet. Its JavaScript and
      TypeScript panes, insights, and exercise arrive with the content tiers.
    </p>

    <nav class="ts-lesson-pager" aria-label="Lesson navigation">
      <RouterLink
        v-if="neighbours.previous"
        :to="lessonRoute(neighbours.previous)"
        class="vd-btn vd-btn-secondary vd-btn-sm"
      >
        <VdIcon name="arrow-left" size="sm" />
        {{ neighbours.previous.title }}
      </RouterLink>
      <span v-else></span>
      <RouterLink
        v-if="neighbours.next"
        :to="lessonRoute(neighbours.next)"
        class="vd-btn vd-btn-secondary vd-btn-sm"
      >
        {{ neighbours.next.title }}
        <VdIcon name="arrow-right" size="sm" />
      </RouterLink>
    </nav>
  </article>

  <!-- Unreachable through the derived routes; guards a hand-typed lessonId. -->
  <section v-else class="ts-page vd-stack" data-gap="fib-13">
    <h1>Lesson not found</h1>
    <p class="vd-text-muted">
      No lesson is registered under <code>{{ lessonId }}</code
      >.
    </p>
    <p>
      <RouterLink to="/curriculum" class="vd-btn vd-btn-primary">
        Back to the curriculum
      </RouterLink>
    </p>
  </section>
</template>
