<script setup lang="ts">
/**
 * Difficulty badge for a lesson. Centralises the tier → label / variant map
 * from `@/curriculum` so the lesson page, curriculum map, and glossary stay
 * visually consistent.
 */
import { VdBadge } from "@vanduo-oss/vd3";
import { TIER_BADGE_VARIANTS, TIER_LABELS, type Tier } from "@/curriculum";

defineProps<{
  tier: Tier;
}>();
</script>

<template>
  <VdBadge :variant="TIER_BADGE_VARIANTS[tier]" pill>
    {{ TIER_LABELS[tier] }}
  </VdBadge>
</template>
