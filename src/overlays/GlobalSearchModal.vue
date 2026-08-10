<script setup lang="ts">
/**
 * The cmd+K command palette.
 *
 * Ported from `vd3-docs/src/overlays/GlobalSearchModal.vue`, with two
 * substantive changes.
 *
 * The donor highlights a match by building an HTML string and rendering it with
 * `v-html`, escaping the surrounding text through an `innerHTML` round trip.
 * Both are ESLint errors here, and rightly so. The store instead returns each
 * title pre-split into before/match/after, and the template puts the middle
 * segment in a real `<mark>` element — same result, no HTML string, and nothing
 * to get the escaping wrong on.
 *
 * The shell is `VdModal` wrapping the package's `vd-doc-search-*` markup, rather
 * than the donor's site-local `.global-search-*` classes, which live in a
 * 3,700-line stylesheet this repository does not carry. `VdModal` brings the
 * backdrop, the focus trap, Escape, and focus restoration with it.
 */
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { VdModal } from "@vanduo-oss/vd3";
import { useSearchStore, type SearchResult } from "@/stores/search";

const search = useSearchStore();
const router = useRouter();
const inputRef = ref<HTMLInputElement | null>(null);

const openModal = async (): Promise<void> => {
  search.open();
  // Two ticks, not one: `VdModal` awaits a tick of its own before activating
  // its focus trap and focusing the panel, so a single tick would put the
  // caret in the input and the modal would immediately take it back.
  await nextTick();
  await nextTick();
  inputRef.value?.focus();
};

const onSelect = (route: string): void => {
  // Close first so VdModal tears down its focus trap before navigation.
  // Callers that handle Enter must preventDefault — otherwise restoring
  // focus to the navbar search button during the same keydown activates it
  // and immediately reopens the palette.
  search.close();
  void router.push(route);
};

const indexOf = (result: SearchResult): number =>
  search.ordered.findIndex(
    (candidate) => candidate.entry.id === result.entry.id,
  );

const isEditable = (element: EventTarget | null): boolean => {
  if (!(element instanceof HTMLElement)) return false;
  return (
    element.tagName === "INPUT" ||
    element.tagName === "TEXTAREA" ||
    element.isContentEditable
  );
};

const onKeydown = (event: KeyboardEvent): void => {
  if (
    (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) ||
    event.key === "/"
  ) {
    // `/` is a normal character inside a field; only the bare page gets it.
    if (event.key === "/" && isEditable(event.target)) return;
    event.preventDefault();
    void openModal();
    return;
  }
  if (!search.isOpen) return;
  if (event.key === "ArrowDown") {
    event.preventDefault();
    search.move(1);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    search.move(-1);
  } else if (event.key === "Enter") {
    event.preventDefault();
    const target = search.ordered[search.activeIndex];
    if (target) {
      onSelect(target.entry.route);
    } else {
      search.searchNow();
    }
  }
  // Escape is VdModal's; it closes the dialog and restores focus.
};

watch(
  () => search.query,
  () => search.setActiveIndex(0),
);

const hasQuery = computed(() => search.query.trim().length >= 2);

const onOpenRequest = (): void => {
  void openModal();
};

onMounted(() => {
  window.addEventListener("ts:open-search", onOpenRequest);
  window.addEventListener("keydown", onKeydown);
});
onUnmounted(() => {
  window.removeEventListener("ts:open-search", onOpenRequest);
  window.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <VdModal
    :open="search.isOpen"
    glass
    size="lg"
    title="Search the curriculum"
    class="ts-search-modal"
    @close="search.close()"
  >
    <div class="vd-doc-search">
      <div class="vd-doc-search-input-wrapper">
        <i
          class="vd-doc-search-icon ph ph-magnifying-glass"
          aria-hidden="true"
        ></i>
        <input
          ref="inputRef"
          v-model="search.query"
          type="search"
          class="vd-doc-search-input"
          placeholder="Search lessons, tracks, and pages…"
          autocomplete="off"
          aria-label="Search the curriculum"
        />
      </div>

      <div class="vd-doc-search-results is-open">
        <ul
          v-if="search.ordered.length > 0"
          class="vd-doc-search-results-list"
          role="listbox"
          aria-label="Search results"
        >
          <template v-for="group in search.groups" :key="group.categoryPath">
            <li class="vd-doc-search-result-category ts-search-group">
              {{ group.categoryPath }}
            </li>
            <li
              v-for="result in group.results"
              :key="result.entry.id"
              class="vd-doc-search-result"
              role="option"
              :class="{ 'is-active': indexOf(result) === search.activeIndex }"
              :aria-selected="indexOf(result) === search.activeIndex"
              @click="onSelect(result.entry.route)"
              @mousemove="search.setActiveIndex(indexOf(result))"
            >
              <div class="vd-doc-search-result-icon">
                <i :class="`ph ph-${result.entry.icon}`" aria-hidden="true"></i>
              </div>
              <div class="vd-doc-search-result-content">
                <!-- Three text nodes and a <mark>; never an HTML string. -->
                <div class="vd-doc-search-result-title">
                  {{ result.segments.before
                  }}<mark v-if="result.segments.match">{{
                    result.segments.match
                  }}</mark
                  >{{ result.segments.after }}
                </div>
                <div class="vd-doc-search-result-category">
                  {{ result.entry.category }}
                </div>
              </div>
            </li>
          </template>
        </ul>

        <div v-else-if="hasQuery" class="vd-doc-search-empty">
          <div class="vd-doc-search-empty-icon">
            <i class="ph ph-magnifying-glass" aria-hidden="true"></i>
          </div>
          <div class="vd-doc-search-empty-title">No results found</div>
          <div class="vd-doc-search-empty-text">
            Try a different word, or browse the curriculum map.
          </div>
        </div>

        <div v-else class="vd-doc-search-empty">
          <div class="vd-doc-search-empty-icon">
            <i class="ph ph-magnifying-glass" aria-hidden="true"></i>
          </div>
          <div class="vd-doc-search-empty-text">
            Search every lesson, track, and page. Two characters is enough.
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="vd-doc-search-footer">
        <span class="vd-doc-search-footer-item">
          <kbd>↑</kbd><kbd>↓</kbd> to navigate
        </span>
        <span class="vd-doc-search-footer-item"> <kbd>↵</kbd> to open </span>
        <span class="vd-doc-search-footer-item"> <kbd>esc</kbd> to close </span>
        <span
          v-if="search.semanticReady"
          class="vd-doc-search-footer-item ts-search-semantic-ready"
        >
          Hybrid ready
        </span>
        <span
          v-else-if="search.statusMessage"
          class="vd-doc-search-footer-item"
        >
          {{ search.statusMessage }}
        </span>
      </div>
    </template>
  </VdModal>
</template>
