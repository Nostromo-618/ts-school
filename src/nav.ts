/**
 * The navigation tree — derived, not written.
 *
 * The `NavTree` / `NavTab` / `NavCategory` / `NavSection` / `NavPage` shapes are
 * taken verbatim from `vd3-docs/src/nav.ts` so the ported sidebar, sidebar
 * filter, and search store consume this module with no adaptation. Only the
 * producer differs: `vd3-docs` hand-maintains a 900-line literal, while here the
 * whole tree is computed from the curriculum registry.
 *
 * Tabs are tiers and categories are tracks. Tier is the pacing decision this
 * site is built around, so a reader who opens the sidebar sees "what should I
 * read next at my level" across all ten tracks. The transposed view — a track
 * top to bottom through its tiers — is what `/curriculum` and
 * `lessonNeighbours()` provide.
 */

import {
  TIERS,
  TIER_ICONS,
  TIER_LABELS,
  TRACKS,
  allLessons,
  lessonRoute,
  type Lesson,
  type Tier,
} from "@/curriculum";

export interface NavSection {
  id: string;
  title: string;
  route: string;
  icon?: string;
  keywords: string[];
  file?: string;
}

export interface NavCategory {
  id: string;
  title: string;
  icon?: string;
  sections: NavSection[];
}

export interface NavTab {
  id: string;
  title: string;
  icon?: string;
  categories: NavCategory[];
}

export interface NavPage {
  id: string;
  title: string;
  route: string;
  icon?: string;
  keywords: string[];
}

export interface NavTree {
  pages: NavPage[];
  tabs: NavTab[];
}

/**
 * The site's standalone pages. These are the only hand-written entries in the
 * tree, because they are the only pages that are not lessons.
 */
const PAGES: NavPage[] = [
  {
    id: "home",
    title: "Home",
    route: "/",
    icon: "house",
    keywords: ["home", "start", "typescript school"],
  },
  {
    id: "curriculum",
    title: "Curriculum",
    route: "/curriculum",
    icon: "map-trifold",
    keywords: ["curriculum", "map", "syllabus", "tracks", "tiers", "overview"],
  },
  {
    id: "glossary",
    title: "Glossary",
    route: "/glossary",
    icon: "book-bookmark",
    keywords: ["glossary", "terms", "definitions", "vocabulary", "jargon"],
  },
  {
    id: "history",
    title: "History",
    route: "/history",
    icon: "clock-countdown",
    keywords: [
      "history",
      "timeline",
      "javascript",
      "nodejs",
      "typescript",
      "adoption",
      "es5",
    ],
  },
  {
    id: "about",
    title: "About",
    route: "/about",
    icon: "info",
    keywords: ["about", "typescript school", "mission", "compiler", "why"],
  },
  {
    id: "terms",
    title: "Terms",
    route: "/terms",
    icon: "file-text",
    keywords: [
      "terms",
      "disclaimer",
      "liability",
      "AI Act",
      "transparency",
      "MIT",
      "license",
    ],
  },
  {
    id: "profile",
    title: "Profile",
    route: "/profile",
    icon: "user",
    keywords: [
      "profile",
      "progress",
      "notes",
      "export",
      "clear",
      "local data",
      "privacy",
    ],
  },
];

const toSection = (lesson: Lesson): NavSection => ({
  id: lesson.id,
  title: lesson.title,
  route: lessonRoute(lesson),
  icon: TRACKS.find((track) => track.id === lesson.track)?.icon,
  // The summary joins the keyword list so search matches prose the reader
  // actually saw, not just the terms an author remembered to tag.
  keywords: [...lesson.keywords, lesson.summary],
});

const buildTree = (lessons: readonly Lesson[]): NavTree => {
  const tabs: NavTab[] = [];

  for (const tier of TIERS) {
    const categories: NavCategory[] = [];

    for (const track of TRACKS) {
      const sections = lessons
        .filter((lesson) => lesson.tier === tier && lesson.track === track.id)
        .sort((a, b) => a.order - b.order)
        .map(toSection);

      // A track with nothing at this tier contributes no category, so the
      // sidebar never renders an empty heading.
      if (sections.length > 0) {
        categories.push({
          id: track.id,
          title: track.title,
          icon: track.icon,
          sections,
        });
      }
    }

    if (categories.length > 0) {
      tabs.push({
        id: tier,
        title: TIER_LABELS[tier],
        icon: TIER_ICONS[tier],
        categories,
      });
    }
  }

  return { pages: PAGES, tabs };
};

/** The derived tree. Computed once at module load from the registry. */
export const nav: NavTree = buildTree(allLessons);

/**
 * Standalone pages rendered as primary-navbar text links.
 * Home is the brand; Profile is the actions icon; Terms lives in the footer.
 */
export const navbarLinkPages = (tree: NavTree = nav): NavPage[] =>
  tree.pages.filter(
    (page) =>
      page.route !== "/" &&
      page.route !== "/profile" &&
      page.route !== "/terms",
  );

/** Every section in the tree, flattened in tab-then-category order. */
export const navSections = (tree: NavTree = nav): NavSection[] =>
  tree.tabs.flatMap((tab) =>
    tab.categories.flatMap((category) => category.sections),
  );

/** The tier tab a lesson route belongs to, for keeping the sidebar in step. */
export const tierForRoute = (
  route: string,
  tree: NavTree = nav,
): Tier | null => {
  for (const tab of tree.tabs) {
    for (const category of tab.categories) {
      if (category.sections.some((section) => section.route === route)) {
        return tab.id as Tier;
      }
    }
  }
  return null;
};
