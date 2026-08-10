<script setup lang="ts">
/**
 * One route component for every lesson. The route table supplies the id; this
 * page resolves the `Lesson` from the registry and composes the dual-pane
 * engine, insights, optional quiz/exercise blocks, and security / diagram.
 */
import { computed, onMounted, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import { VdAlert, VdIcon } from "@vanduo-oss/vd3";
import { VdFlowchart } from "@vanduo-oss/vd3-cbun/flowchart";
import ProseHtml from "@/components/ProseHtml.vue";
import DualPane from "@/components/lesson/DualPane.vue";
import ExerciseBlock from "@/components/lesson/ExerciseBlock.vue";
import QuizBlock from "@/components/lesson/QuizBlock.vue";
import TierBadge from "@/components/lesson/TierBadge.vue";
import {
  isPlaceholder,
  lessonById,
  lessonNeighbours,
  lessonRoute,
  trackById,
  type SecurityNote,
} from "@/curriculum";
import { LESSON_DIAGNOSTICS } from "@/curriculum/generated/diagnostics";
import { toPrerenderedDiagnostics } from "@/components/lesson/prerender";
import { useProgressStore } from "@/stores/progress";

const props = defineProps<{ lessonId: string }>();

const progress = useProgressStore();
const quizDone = ref(false);
const exerciseDone = ref(false);

const lesson = computed(() => lessonById(props.lessonId));
const lessonDiagnostics = computed(() => LESSON_DIAGNOSTICS[props.lessonId]);
const paneDiagnostics = computed(() => {
  const generated = lessonDiagnostics.value?.pane;
  if (generated) return [...generated];
  const current = lesson.value;
  if (!current) return [];
  return toPrerenderedDiagnostics(current.ts.expectedDiagnostics);
});
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
const isComplete = computed(() => progress.isComplete(props.lessonId));

function syncLessonProgress(id: string): void {
  progress.hydrate();
  progress.markInProgress(id);
  const entry = progress.lessons[id];
  quizDone.value = entry?.quizScore !== undefined;
  exerciseDone.value = entry?.exercisePassed === true;
}

watch(
  () => props.lessonId,
  (id) => {
    syncLessonProgress(id);
  },
);

onMounted(() => {
  syncLessonProgress(props.lessonId);
});

function maybeAutoComplete(): void {
  const current = lesson.value;
  if (!current || isComplete.value) return;
  const needsQuiz = (current.quiz?.length ?? 0) > 0;
  const needsExercise = current.exercise !== undefined;
  if (needsQuiz && !quizDone.value) return;
  if (needsExercise && !exerciseDone.value) return;
  if (!needsQuiz && !needsExercise) return;
  progress.markComplete(props.lessonId);
}

function onQuizComplete(): void {
  quizDone.value = true;
  maybeAutoComplete();
}

function onExercisePass(): void {
  exerciseDone.value = true;
  maybeAutoComplete();
}

function markComplete(): void {
  progress.markComplete(props.lessonId);
}

const SECURITY_VARIANTS: Record<
  SecurityNote["severity"],
  "info" | "warning" | "danger"
> = {
  info: "info",
  caution: "warning",
  critical: "danger",
};
</script>

<template>
  <article v-if="lesson" class="ts-page vd-stack" data-gap="fib-21">
    <header class="vd-stack" data-gap="fib-8">
      <!--
        The package's `vd-breadcrumbs`/`vd-breadcrumb` markup written out rather
        than routed through its `VdBreadcrumb` component, for two reasons: the
        crumbs need to be `RouterLink`s so they navigate client-side, and every
        separator variant the component can pass renders its glyph on the list
        element via `::before` rather than between the items, which produces a
        stray leading character. The list's own `--vd-breadcrumb-separator`
        already handles it, so this uses the classes and skips the modifier.
      -->
      <nav class="vd-breadcrumbs" aria-label="Breadcrumb">
        <ol class="vd-breadcrumb">
          <li class="vd-breadcrumb-item">
            <RouterLink to="/curriculum" class="vd-breadcrumb-link">
              Curriculum
            </RouterLink>
          </li>
          <li
            class="vd-breadcrumb-item vd-breadcrumb-current"
            aria-current="page"
          >
            {{ track?.title ?? lesson.track }}
          </li>
        </ol>
      </nav>

      <h1>{{ lesson.title }}</h1>

      <div class="vd-inline" data-gap="fib-5">
        <TierBadge :tier="lesson.tier" />
        <span class="vd-text-muted vd-text-sm">
          <VdIcon :name="track?.icon ?? 'circle'" size="sm" />
          {{ track?.title ?? lesson.track }}
        </span>
      </div>

      <ProseHtml class="ts-lead" :text="lesson.summary" />
    </header>

    <section class="vd-stack" data-gap="fib-5" aria-labelledby="lesson-problem">
      <h2 id="lesson-problem">The problem</h2>
      <ProseHtml :text="lesson.problem" />
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

    <VdAlert v-if="isUnwritten" variant="info" role="status">
      This lesson is on the map but not written yet. Its JavaScript and
      TypeScript panes, insights, and exercise arrive with the content tiers.
    </VdAlert>

    <DualPane
      :lesson-id="lesson.id"
      :js="lesson.js"
      :ts="lesson.ts"
      :diagnostics="paneDiagnostics"
    />

    <section
      v-if="lesson.insight.length > 0"
      class="vd-stack"
      data-gap="fib-5"
      aria-labelledby="lesson-insight"
    >
      <h2 id="lesson-insight">Takeaways</h2>
      <ul>
        <li v-for="(item, index) in lesson.insight" :key="index">
          <ProseHtml :text="item" />
        </li>
      </ul>
    </section>

    <VdAlert
      v-if="lesson.security"
      :variant="SECURITY_VARIANTS[lesson.security.severity]"
      :title="lesson.security.title"
    >
      <ProseHtml :text="lesson.security.body" />
    </VdAlert>

    <section
      v-if="lesson.diagram"
      class="vd-stack"
      data-gap="fib-5"
      aria-labelledby="lesson-diagram"
    >
      <h2 id="lesson-diagram">Diagram</h2>
      <VdFlowchart :data="lesson.diagram" readonly auto-fit />
    </section>

    <QuizBlock
      v-if="lesson.quiz && lesson.quiz.length > 0"
      :lesson-id="lesson.id"
      :questions="lesson.quiz"
      @complete="onQuizComplete"
    />

    <ExerciseBlock
      v-if="lesson.exercise"
      :lesson-id="lesson.id"
      :exercise="lesson.exercise"
      :starter-diagnostics="lessonDiagnostics?.starter"
      :solution-diagnostics="lessonDiagnostics?.solution"
      @pass="onExercisePass"
    />

    <section
      v-if="lesson.references && lesson.references.length > 0"
      class="vd-stack"
      data-gap="fib-5"
      aria-labelledby="lesson-references"
    >
      <h2 id="lesson-references">References</h2>
      <ul>
        <li v-for="reference in lesson.references" :key="reference.href">
          <a :href="reference.href" rel="noopener noreferrer" target="_blank">
            {{ reference.title }}
          </a>
          <span v-if="reference.note" class="vd-text-muted">
            — {{ reference.note }}
          </span>
        </li>
      </ul>
    </section>

    <div class="ts-lesson-complete vd-inline" data-gap="fib-8">
      <button
        v-if="!isComplete"
        type="button"
        class="vd-btn vd-btn-secondary vd-btn-sm"
        @click="markComplete"
      >
        Mark complete
      </button>
      <p v-else class="vd-text-muted vd-text-sm" role="status">
        Marked complete.
      </p>
    </div>

    <nav class="ts-lesson-pager" aria-label="Lesson navigation">
      <RouterLink
        v-if="neighbours.previous"
        :to="lessonRoute(neighbours.previous)"
        class="vd-btn vd-btn-secondary"
      >
        <VdIcon name="arrow-left" size="md" />
        {{ neighbours.previous.title }}
      </RouterLink>
      <span v-else></span>
      <RouterLink
        v-if="neighbours.next"
        :to="lessonRoute(neighbours.next)"
        class="vd-btn vd-btn-secondary"
      >
        {{ neighbours.next.title }}
        <VdIcon name="arrow-right" size="md" />
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
