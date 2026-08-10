<script setup lang="ts">
/**
 * Escaped Labs markdown for curriculum prose (inline code pills, etc.).
 * Source strings stay backticks-only — never raw HTML in lesson data.
 */
import { computed } from "vue";
import { renderProseHtml, renderProseHtmlInline } from "@/lib/prose-markdown";

const props = withDefaults(
  defineProps<{
    text: string;
    /** Unwrap a single <p> for captions / buttons / spans. */
    inline?: boolean;
  }>(),
  { inline: false },
);

const html = computed(() =>
  props.inline
    ? renderProseHtmlInline(props.text)
    : renderProseHtml(props.text),
);

const tag = computed(() => (props.inline ? "span" : "div"));
</script>

<template>
  <component
    :is="tag"
    class="ts-prose"
    :class="{ 'ts-prose-inline': inline }"
    v-html="html"
  />
</template>
