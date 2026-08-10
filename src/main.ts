import { ViteSSG } from "vite-ssg";
import { createPinia } from "pinia";
import { VanduoVue } from "@vanduo-oss/vd3";
import App from "./App.vue";
import { buildRoutes } from "./router";
import { hasDeclinedDisclaimer } from "./lib/disclaimer";
import { installVd3ThemeStoragePrefix } from "./lib/vd3-theme-storage";
import "@vanduo-oss/vd3/css";
// Only the cbun bundles ts-school actually renders: charts on the adoption
// pages, the code editor in both lesson panes, flowcharts for narrowing and
// compiler-pipeline diagrams. Draw and music-player stay out of the bundle.
import "@vanduo-oss/vd3-cbun/charts/css";
import "@vanduo-oss/vd3-cbun/code-editor/css";
import "@vanduo-oss/vd3-cbun/flowchart/css";
import "./styles/app.css";

// vd3 hardcodes `vanduo-*` storage keys (no official prefix option in 1.2.2).
// Remap to `ts-school-*` before any useThemePreference() hydration.
installVd3ThemeStoragePrefix();

const routes = buildRoutes();

export const createApp = ViteSSG(
  App,
  {
    // vite-ssg feeds this to the vue-router history base
    // (createWebHistory(routerOptions.base)); without it the router defaults to
    // "/" even when the site is built under a sub-path, which makes every
    // RouterLink render unprefixed and the root URL hydrate to NotFound.
    // import.meta.env.BASE_URL is "/" unless VITE_BASE says otherwise.
    base: import.meta.env.BASE_URL,
    routes,
    scrollBehavior(to, _from, savedPosition) {
      // Preserve position on browser back/forward
      if (savedPosition) return savedPosition;
      // Honor deep-link anchors (offset for the fixed navbar)
      if (to.hash) return { el: to.hash, top: 80, behavior: "instant" };
      // Default: jump to top of the new page (instant, since html has
      // scroll-behavior: smooth which would otherwise animate the jump)
      return { top: 0, behavior: "instant" };
    },
  },
  ({ app, router }) => {
    app.use(createPinia());
    // Site defaults for new visitors (no ts-school-* theme prefs yet).
    // Stored prefs always win — vd3 loadPreference uses getItem ?? default.
    // Lato is self-hosted in vd3 (font-src 'self'); radius is rem without unit.
    // ThemeDefaults has a single NEUTRAL (no light/dark keys); stone is the
    // light/global baseline. Dark charcoal is applied by the theme store.
    app.use(VanduoVue, {
      themeDefaults: {
        PRIMARY_LIGHT: "violet",
        PRIMARY_DARK: "violet",
        NEUTRAL: "stone",
        RADIUS: "0.375",
        FONT: "lato",
      },
    });

    // Client-only: session farewell flag must keep declined visitors on
    // /farewell. SSR/prerender never sees sessionStorage.
    router.beforeEach((to) => {
      if (typeof sessionStorage === "undefined") return true;
      if (hasDeclinedDisclaimer() && to.name !== "farewell") {
        return { name: "farewell" };
      }
      return true;
    });

    // Deliberately no `initialState`: vite-ssg serializes any non-empty state
    // into an INLINE <script>, which `script-src 'self'` blocks. Nothing here
    // needs SSR-hydrated state — learner progress lives in localStorage and is
    // read on the client — so leaving it empty keeps the CSP clean. Anything
    // that later wants prerendered data should pass it as route meta or a
    // same-origin JSON fetch, not through the initial-state script.
  },
);
