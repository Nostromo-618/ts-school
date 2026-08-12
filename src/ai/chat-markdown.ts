/**
 * Assistant-bubble HTML: Labs markdown + school route/title linkify.
 */
import { labsMarkdownToHtml } from "@vanduo-oss/vdl-ai-chat/markdown";
import { allLessons, lessonRoute } from "@/curriculum";
import { nav } from "@/nav";

const STANDALONE_ROUTES = new Set(nav.pages.map((p) => p.route));

/** Longest titles first so "Why types at all" wins over shorter substrings. */
function titleRouteEntries(): Array<{ title: string; route: string }> {
  const entries: Array<{ title: string; route: string }> = [];
  for (const page of nav.pages) {
    if (page.route && page.title)
      entries.push({ title: page.title, route: page.route });
  }
  for (const lesson of allLessons) {
    entries.push({ title: lesson.title, route: lessonRoute(lesson) });
  }
  return entries.sort((a, b) => b.title.length - a.title.length);
}

let cachedTitleEntries: Array<{ title: string; route: string }> | null = null;

function getTitleEntries(): Array<{ title: string; route: string }> {
  if (!cachedTitleEntries) cachedTitleEntries = titleRouteEntries();
  return cachedTitleEntries;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isInternalAppPath(href: string): boolean {
  if (!href.startsWith("/")) return false;
  if (href.startsWith("//")) return false;
  if (href.startsWith("/lessons/")) return true;
  const bare = href.split(/[?#]/)[0] || href;
  return STANDALONE_ROUTES.has(bare) || bare === "/";
}

const BARE_ROUTE_RE =
  /(^|[^A-Za-z0-9"'>=;])(\/(?:lessons\/[a-z0-9-]+\/[a-z0-9-]+|curriculum|glossary|history|about|terms|profile|farewell)(?:[?#][^\s<"']*)?)/gi;

/**
 * Wrap bare app paths in plain text only — never inside HTML tags/attrs
 * (absolute GitHub Pages hrefs contain `/glossary`, `/lessons/…`, etc.).
 */
export function linkifyBareRoutes(html: string): string {
  return html
    .split(/(<[^>]+>)/g)
    .map((part) => {
      if (part.startsWith("<")) return part;
      return part.replace(
        BARE_ROUTE_RE,
        (full, prefix: string, path: string) => {
          if (!isInternalAppPath(path)) return full;
          return `${prefix}<a href="${path}" rel="noopener noreferrer">${path}</a>`;
        },
      );
    })
    .join("");
}

/**
 * Turn known page/lesson titles (outside existing tags) into links.
 * Skips text already inside an <a>…</a>.
 */
export function linkifyKnownTitles(html: string): string {
  const parts = html.split(/(<a\b[^>]*>[\s\S]*?<\/a>)/gi);
  const entries = getTitleEntries();
  return parts
    .map((part) => {
      if (/^<a\b/i.test(part)) return part;
      let out = part;
      for (const { title, route } of entries) {
        if (title.length < 4) continue;
        const re = new RegExp(
          `(?<![\\w/])(${escapeRegExp(title)})(?![\\w])`,
          "g",
        );
        out = out.replace(re, (match) => {
          // Avoid double-wrapping if already an href target nearby
          return `<a href="${route}" rel="noopener noreferrer">${match}</a>`;
        });
      }
      return out;
    })
    .join("");
}

/** Full pipeline for assistant message HTML. */
export function renderAssistantHtml(text: string): string {
  const md = labsMarkdownToHtml(String(text || ""));
  return linkifyKnownTitles(linkifyBareRoutes(md));
}

export function isSchoolInternalHref(href: string): boolean {
  try {
    if (href.startsWith("/")) return isInternalAppPath(href);
    const url = new URL(href, "http://localhost");
    return isInternalAppPath(url.pathname + url.search + url.hash);
  } catch {
    return false;
  }
}
