<script setup lang="ts">
/**
 * The sidebar's filter box.
 *
 * A separate component because the filter lives in the nav store rather than in
 * the sidebar's own state: the sidebar is remounted on every route change, and
 * a reader who has filtered to "streams" should not lose it by opening one of
 * the results.
 */
import { computed } from "vue";
import { VdIcon, VdInput } from "@vanduo-oss/vd3";
import { useNavStore } from "@/stores/nav";

const store = useNavStore();

const filter = computed({
  get: () => store.filter,
  set: (value: string | number) => store.setFilter(String(value)),
});
</script>

<template>
  <div class="ts-sidebar-filter">
    <VdIcon name="funnel-simple" size="sm" />
    <VdInput
      id="ts-sidebar-filter-input"
      v-model="filter"
      type="search"
      size="sm"
      placeholder="Filter lessons…"
      autocomplete="off"
      aria-label="Filter lessons"
      data-sidebar-filter
    />
  </div>
</template>
