<script setup lang="ts">
/**
 * The JS | TS dual pane.
 *
 * Desktop (≥992px): side-by-side. Mobile: `VdTabs`. The JavaScript pane is
 * always read-only. The TypeScript pane is live-checked only when it is not a
 * placeholder — stubs never construct a Worker.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { VdTabs } from "@vanduo-oss/vd3";
import { VdCodeEditor } from "@vanduo-oss/vd3-cbun/code-editor";
import { isPlaceholder, type CodePane, type TsCodePane } from "@/curriculum";
import type { TypecheckOptions } from "@/typecheck";
import DiagnosticsList from "./DiagnosticsList.vue";
import LiveTsPane from "./LiveTsPane.vue";
import { toPrerenderedDiagnostics } from "./prerender";

const props = defineProps<{
  js: CodePane;
  ts: TsCodePane;
  options?: TypecheckOptions;
}>();

const MOBILE_QUERY = "(max-width: 991px)";

const isMobile = ref(false);
const activeTab = ref("ts");
const tsCode = ref(props.ts.code);

watch(
  () => props.ts.code,
  (next) => {
    tsCode.value = next;
  },
);

const stub = computed(() => isPlaceholder(props.ts));
const initialDiagnostics = computed(() =>
  toPrerenderedDiagnostics(props.ts.expectedDiagnostics),
);

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
    <!-- Mobile: tabbed. Only one layout mounts so the live pane is not doubled. -->
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
          <span class="vd-text-muted vd-text-sm">{{ js.caption }}</span>
        </div>
        <VdCodeEditor
          :model-value="js.code"
          language="javascript"
          read-only
          :line-numbers="true"
          aria-label="JavaScript lesson source"
        />
      </div>

      <LiveTsPane
        v-if="!stub"
        v-show="activeTab === 'ts'"
        v-model="tsCode"
        :caption="ts.caption"
        :initial-diagnostics="initialDiagnostics"
        :options="options"
      />
      <div
        v-else-if="activeTab === 'ts'"
        class="ts-pane ts-pane-ts vd-stack"
        data-gap="fib-5"
      >
        <div class="ts-pane-header">
          <span class="ts-pane-label">TypeScript</span>
          <span class="vd-text-muted vd-text-sm">{{ ts.caption }}</span>
        </div>
        <VdCodeEditor
          :model-value="ts.code"
          language="typescript"
          read-only
          :line-numbers="true"
          aria-label="TypeScript lesson source"
        />
        <DiagnosticsList :diagnostics="initialDiagnostics" />
      </div>
    </VdTabs>

    <!-- Desktop: side by side. -->
    <div v-else class="ts-dual-pane-grid">
      <div class="ts-pane ts-pane-js vd-stack" data-gap="fib-5">
        <div class="ts-pane-header">
          <span class="ts-pane-label">JavaScript</span>
          <span class="vd-text-muted vd-text-sm">{{ js.caption }}</span>
        </div>
        <VdCodeEditor
          :model-value="js.code"
          language="javascript"
          read-only
          :line-numbers="true"
          aria-label="JavaScript lesson source"
        />
      </div>

      <LiveTsPane
        v-if="!stub"
        v-model="tsCode"
        :caption="ts.caption"
        :initial-diagnostics="initialDiagnostics"
        :options="options"
      />
      <div v-else class="ts-pane ts-pane-ts vd-stack" data-gap="fib-5">
        <div class="ts-pane-header">
          <span class="ts-pane-label">TypeScript</span>
          <span class="vd-text-muted vd-text-sm">{{ ts.caption }}</span>
        </div>
        <VdCodeEditor
          :model-value="ts.code"
          language="typescript"
          read-only
          :line-numbers="true"
          aria-label="TypeScript lesson source"
        />
        <DiagnosticsList :diagnostics="initialDiagnostics" />
      </div>
    </div>
  </section>
</template>
