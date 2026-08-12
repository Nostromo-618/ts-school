import type { RouteRecordRaw } from "vue-router";
import HomePage from "@/pages/home.vue";
import NotFoundPage from "@/pages/not-found.vue";
import LessonPage from "@/pages/LessonPage.vue";
import CurriculumPage from "@/pages/curriculum.vue";
import GlossaryPage from "@/pages/glossary.vue";
import HistoryPage from "@/pages/history.vue";
import AboutPage from "@/pages/about.vue";
import TermsPage from "@/pages/terms.vue";
import FarewellPage from "@/pages/farewell.vue";
import ProfilePage from "@/pages/profile.vue";
import ChangelogPage from "@/pages/changelog.vue";
import { allLessons, lessonRoute, trackById } from "@/curriculum";

/**
 * Every lesson as a static route, derived from the registry.
 *
 * Static rather than a single `/lessons/:track/:id` dynamic route because
 * `vite-ssg` prerenders the route table it is given: one dynamic route
 * prerenders one page, while N static routes prerender N. Each record carries
 * the lesson id in `props` and its metadata in `meta`, so `LessonPage.vue`
 * resolves the lesson itself and `App.vue` gets a per-route title and
 * description with no extra lookup.
 */
const lessonRoutes = (): RouteRecordRaw[] =>
  allLessons.map((lesson) => ({
    path: lessonRoute(lesson),
    name: `lesson-${lesson.id}`,
    component: LessonPage,
    props: { lessonId: lesson.id },
    meta: {
      title: lesson.title,
      description: lesson.summary,
      keywords: lesson.keywords,
      tier: lesson.tier,
      track: lesson.track,
      trackTitle: trackById(lesson.track)?.title,
      // Selects the sidebar frame in App.vue. The curriculum map is already an
      // index of every lesson, so it deliberately does not carry this.
      layout: "lesson",
    },
  }));

/**
 * The application's route table.
 *
 * This is the single seam through which routes enter the app: `main.ts` calls
 * it once and never sees a route literal. Lesson routes are spliced in below,
 * ahead of the catch-all — order matters, since `/:pathMatch(.*)*` swallows
 * anything after it.
 */
export const buildRoutes = (): RouteRecordRaw[] => {
  const routes: RouteRecordRaw[] = [];

  routes.push({
    path: "/",
    name: "home",
    component: HomePage,
    meta: {
      title: "TypeScript School",
      description:
        "Learn TypeScript by fixing real JavaScript — every diagnostic from Strada at build time, verified in CI.",
      keywords: ["typescript", "javascript", "types", "learn"],
    },
  });

  routes.push({
    path: "/curriculum",
    name: "curriculum",
    component: CurriculumPage,
    meta: {
      title: "Curriculum",
      description:
        "The full TypeScript School map: every lesson, by track and tier, from why types at all to the compiler's own internals.",
      keywords: ["curriculum", "syllabus", "lessons", "tracks", "tiers", "map"],
    },
  });

  routes.push({
    path: "/glossary",
    name: "glossary",
    component: GlossaryPage,
    meta: {
      title: "Glossary",
      description:
        "Every TypeScript term this site uses, tagged with the tier it starts mattering at and linked to the lessons that teach it.",
      keywords: ["glossary", "terms", "definitions", "vocabulary", "jargon"],
    },
  });

  routes.push({
    path: "/history",
    name: "history",
    component: HistoryPage,
    meta: {
      title: "History",
      description:
        "JavaScript, Node.js, and TypeScript milestones from ES5 through the TypeScript 7 Go port — and why lesson diagnostics use Strada 6.0.3 at build time alongside typescript@7.",
      keywords: [
        "history",
        "timeline",
        "javascript",
        "nodejs",
        "typescript",
        "adoption",
      ],
    },
  });

  routes.push({
    path: "/about",
    name: "about",
    component: AboutPage,
    meta: {
      title: "About",
      description:
        "What TypeScript School is, who it is for, and how build-time Strada diagnostics and solution-match exercises work with typescript@7.",
      keywords: ["about", "typescript school", "mission", "compiler"],
    },
  });

  routes.push({
    path: "/terms",
    name: "terms",
    component: TermsPage,
    meta: {
      title: "Terms",
      description:
        "TypeScript School terms of use and disclaimer: hobby project, as-is warranty waiver, AI-assisted content transparency, and MIT license note.",
      keywords: [
        "terms",
        "disclaimer",
        "liability",
        "AI Act",
        "transparency",
        "MIT",
      ],
    },
  });

  routes.push({
    path: "/farewell",
    name: "farewell",
    component: FarewellPage,
    meta: {
      title: "Farewell",
      description:
        "You declined the site terms. Re-read the disclaimer when you are ready to continue.",
      keywords: [],
    },
  });

  routes.push({
    path: "/changelog",
    name: "changelog",
    component: ChangelogPage,
    meta: {
      title: "Changelog",
      description:
        "Release notes for TypeScript School dev-v0.2.0 — Ask persistence, published vdl packages, theme updates, and CI improvements.",
      keywords: ["changelog", "release notes", "dev-v0.2.0", "updates"],
    },
  });

  routes.push({
    path: "/profile",
    name: "profile",
    component: ProfilePage,
    meta: {
      title: "Profile",
      description:
        "Review local learning progress, notes, and browser data — export or clear what TypeScript School stores on this device.",
      keywords: [
        "profile",
        "progress",
        "notes",
        "export",
        "clear",
        "local data",
      ],
    },
  });

  routes.push(...lessonRoutes());

  routes.push({
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFoundPage,
    meta: { title: "Page not found", keywords: [] },
  });

  return routes;
};
