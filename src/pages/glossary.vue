<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import { VdBadge, VdIcon, VdInput } from "@vanduo-oss/vd3";
import ProseHtml from "@/components/ProseHtml.vue";
import {
  TIERS,
  TIER_BADGE_VARIANTS,
  TIER_LABELS,
  glossaryTerms,
  lessonById,
  lessonRoute,
  type Tier,
} from "@/curriculum";

type TierFilter = Tier | "all";

const terms = glossaryTerms();
const query = ref("");
const tier = ref<TierFilter>("all");

const filters: { value: TierFilter; label: string }[] = [
  { value: "all", label: "Every tier" },
  ...TIERS.map((value) => ({
    value: value as TierFilter,
    label: TIER_LABELS[value],
  })),
];

const visible = computed(() => {
  const q = query.value.trim().toLowerCase();
  return terms.filter((term) => {
    if (tier.value !== "all" && term.tier !== tier.value) return false;
    if (q.length === 0) return true;
    return (
      term.term.toLowerCase().includes(q) ||
      term.definition.toLowerCase().includes(q) ||
      (term.aliases ?? []).some((alias) => alias.toLowerCase().includes(q))
    );
  });
});

/** Related lessons, resolved and dropped if the id no longer exists. */
const lessonsFor = (ids: readonly string[]) =>
  ids.map((id) => lessonById(id)).filter((lesson) => lesson !== undefined);
</script>

<template>
  <section id="glossary" class="ts-page vd-stack" data-gap="fib-21">
    <header class="vd-stack" data-gap="fib-8">
      <h1>Glossary</h1>
      <p class="ts-lead">
        The vocabulary TypeScript's error messages assume you already have.
        Every term is tagged with the tier it starts mattering at and links to
        the lessons that teach it.
      </p>
    </header>

    <div class="ts-filter-bar">
      <div role="group" aria-label="Filter by tier">
        <button
          v-for="option in filters"
          :key="option.value"
          type="button"
          class="vd-btn vd-btn-sm"
          :class="tier === option.value ? 'vd-btn-primary' : 'vd-btn-outline'"
          :aria-pressed="tier === option.value"
          @click="tier = option.value"
        >
          {{ option.label }}
        </button>
      </div>

      <label class="ts-filter-search">
        <span class="vd-visually-hidden">Search the glossary</span>
        <VdIcon name="magnifying-glass" size="sm" />
        <VdInput
          v-model="query"
          type="search"
          placeholder="Search terms and definitions…"
          autocomplete="off"
        />
      </label>
    </div>

    <p class="vd-text-muted vd-text-sm" role="status">
      Showing {{ visible.length }} of {{ terms.length }} terms.
    </p>

    <dl class="ts-glossary">
      <div
        v-for="term in visible"
        :id="term.id"
        :key="term.id"
        class="ts-glossary-entry"
      >
        <dt class="ts-glossary-term">
          <span class="ts-glossary-name">{{ term.term }}</span>
          <VdBadge :variant="TIER_BADGE_VARIANTS[term.tier]" pill>
            {{ TIER_LABELS[term.tier] }}
          </VdBadge>
        </dt>
        <dd class="ts-glossary-definition">
          <ProseHtml :text="term.definition" />
          <p v-if="term.aliases?.length" class="vd-text-muted vd-text-xs">
            Also written: {{ term.aliases.join(", ") }}
          </p>
          <ul class="ts-glossary-links">
            <li v-for="lesson in lessonsFor(term.related)" :key="lesson.id">
              <RouterLink :to="lessonRoute(lesson)">{{
                lesson.title
              }}</RouterLink>
            </li>
          </ul>
        </dd>
      </div>
    </dl>
  </section>
</template>
