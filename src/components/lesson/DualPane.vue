<script setup lang="ts">
/**
 * The JS | TS dual pane.
 *
 * Desktop (≥992px): side-by-side. Mobile: `VdTabs`. Diagnostics are static
 * (build-time Strada output), not live-checked.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { VdTabs } from "@vanduo-oss/vd3";
import { VdCodeEditor } from "@vanduo-oss/vd3-cbun/code-editor";
import ProseHtml from "@/components/ProseHtml.vue";
import { isPlaceholder, type CodePane, type TsCodePane } from "@/curriculum";
import type { TsDiagnostic } from "@/typecheck";
import DiagnosticsList from "./DiagnosticsList.vue";
import EditableTsPane from "./EditableTsPane.vue";
import { useLessonEditorStore } from "@/stores/lessonEditor";

const props = defineProps<{
  js: CodePane;
  ts: TsCodePane;
  diagnostics: readonly TsDiagnostic[];
  lessonId: string;
}>();

const MOBILE_QUERY = "(max-width: 991px)";

const isMobile = ref(false);
const activeTab = ref("ts");
const editor = useLessonEditorStore();

watch(
  () => props.lessonId,
  (id) => {
    editor.bindLesson(id, props.ts.code, editor.exerciseCode);
  },
  { immediate: true },
);

const tsCode = computed({
  get: () => editor.tsCode || props.ts.code,
  set: (value: string) => editor.setTsCode(value),
});

const stub = computed(() => isPlaceholder(props.ts));
const paneDiagnostics = computed(() => [...props.diagnostics]);

const tabs = [
  { id: "js", label: "JavaScript" },
  { id: "ts", label: "TypeScript" },
];

let media: MediaQueryList | undefined;
function syncMobile(): void {
  isMobile.value = media?.matches ?? false;
}

onMounted(() => {
  media = window.matchMedia(MOBILE_QUERY);
  syncMobile();
  media.addEventListener("change", syncMobile);
});

onBeforeUnmount(() => {
  media?.removeEventListener("change", syncMobile);
});
</script>

<template>
  <section class="ts-dual-pane" aria-label="JavaScript and TypeScript panes">
    <VdTabs
      v-if="isMobile"
      v-model="activeTab"
      :tabs="tabs"
      class="ts-dual-pane-tabs"
    >
      <div
        v-show="activeTab === 'js'"
        class="ts-pane ts-pane-js vd-stack"
        data-gap="fib-5"
      >
        <div class="ts-pane-header">
          <span class="ts-pane-label">JavaScript</span>
          <span class="vd-text-muted vd-text-sm"
            ><ProseHtml inline :text="js.caption"
          /></span>
        </div>
        <VdCodeEditor
          :model-value="js.code"
          language="javascript"
          read-only
          :line-numbers="true"
          aria-label="JavaScript lesson source"
        />
      </div>

      <EditableTsPane
        v-if="!stub"
        v-show="activeTab === 'ts'"
        v-model="tsCode"
        :caption="ts.caption"
        :diagnostics="paneDiagnostics"
      />
      <div
        v-else-if="activeTab === 'ts'"
        class="ts-pane ts-pane-ts vd-stack"
        data-gap="fib-5"
      >
        <div class="ts-pane-header">
          <span class="ts-pane-label">TypeScript</span>
          <span class="vd-text-muted vd-text-sm"
            ><ProseHtml inline :text="ts.caption"
          /></span>
        </div>
        <VdCodeEditor
          :model-value="ts.code"
          language="typescript"
          read-only
          :line-numbers="true"
          aria-label="TypeScript lesson source"
        />
        <DiagnosticsList :diagnostics="paneDiagnostics" />
      </div>
    </VdTabs>

    <div v-else class="ts-dual-pane-grid">
      <div class="ts-pane ts-pane-js vd-stack" data-gap="fib-5">
        <div class="ts-pane-header">
          <span class="ts-pane-label">JavaScript</span>
          <span class="vd-text-muted vd-text-sm"
            ><ProseHtml inline :text="js.caption"
          /></span>
        </div>
        <VdCodeEditor
          :model-value="js.code"
          language="javascript"
          read-only
          :line-numbers="true"
          aria-label="JavaScript lesson source"
        />
      </div>

      <EditableTsPane
        v-if="!stub"
        v-model="tsCode"
        :caption="ts.caption"
        :diagnostics="paneDiagnostics"
      />
      <div v-else class="ts-pane ts-pane-ts vd-stack" data-gap="fib-5">
        <div class="ts-pane-header">
          <span class="ts-pane-label">TypeScript</span>
          <span class="vd-text-muted vd-text-sm"
            ><ProseHtml inline :text="ts.caption"
          /></span>
        </div>
        <VdCodeEditor
          :model-value="ts.code"
          language="typescript"
          read-only
          :line-numbers="true"
          aria-label="TypeScript lesson source"
        />
        <DiagnosticsList :diagnostics="paneDiagnostics" />
      </div>
    </div>
  </section>
</template>
