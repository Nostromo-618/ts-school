<script setup lang="ts">
/**
 * The lesson frame: sidebar column beside the content column.
 *
 * `DocsLayout` in `vd3-docs`, renamed and simplified — its `data-doc-tab`
 * attribute existed to switch card styling between two documentation modes this
 * site does not have. What remains is the grid, which uses the package's
 * responsive column classes so the sidebar stacks above the content below the
 * large breakpoint.
 *
 * Applied only to routes whose `meta.layout` is "lesson". The curriculum map is
 * already an index of every lesson, so putting a 201-item sidebar beside it
 * would be the same list twice.
 */
import SchoolSidebar from "./SchoolSidebar.vue";
</script>

<template>
  <div class="vd-container-responsive ts-lesson-frame">
    <div class="vd-row">
      <aside class="vd-col-12 vd-col-lg-3" aria-label="Lesson navigation">
        <SchoolSidebar />
      </aside>
      <div class="vd-col-12 vd-col-lg-9">
        <slot />
      </div>
    </div>
  </div>
</template>
