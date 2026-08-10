/// <reference types="vite/client" />

// Injected by Vite `define` from package.json (see vite.config.ts).
declare const __APP_VERSION__: string;

/** Chromium Device Memory API — often capped at 8; absent in Firefox/Safari typings. */
interface Navigator {
  readonly deviceMemory?: number;
}

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<
    Record<string, never>,
    Record<string, never>,
    unknown
  >;
  export default component;
}

// Side-effect CSS bundles imported in main.ts. The vd3 line ships real types
// for its JS/Vue subpaths, so only the style entry points need an ambient
// declaration. Only the cbun bundles we actually use are declared — adding one
// here should mean a component from that bundle is genuinely on a page.
declare module "@vanduo-oss/vd3/css";
declare module "@vanduo-oss/vd3-cbun/charts/css";
declare module "@vanduo-oss/vd3-cbun/code-editor/css";
declare module "@vanduo-oss/vd3-cbun/flowchart/css";
