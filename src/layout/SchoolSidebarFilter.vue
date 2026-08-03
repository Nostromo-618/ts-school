<script setup lang="ts">
/**
 * The sidebar's filter box.
 *
 * A separate component because the filter lives in the nav store rather than in
 * the sidebar's own state: the sidebar is remounted on every route change, and
 * a reader who has filtered to "streams" should not lose it by opening one of
 * the results.
 */
import { VdIcon } from "@vanduo-oss/vd3";
import { useNavStore } from "@/stores/nav";

const store = useNavStore();

const onInput = (event: Event): void => {
  store.setFilter((event.target as HTMLInputElement).value);
};
</script>

<template>
  <div class="ts-sidebar-filter">
    <label class="vd-visually-hidden" for="ts-sidebar-filter-input">
      Filter lessons
    </label>
    <VdIcon name="funnel-simple" size="sm" />
    <input
      id="ts-sidebar-filter-input"
      :value="store.filter"
      type="search"
      class="vd-input"
      placeholder="Filter lessons…"
      autocomplete="off"
      data-sidebar-filter
      @input="onInput"
    />
  </div>
</template>
