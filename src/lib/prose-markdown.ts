/**
 * Curriculum prose HTML — Labs markdown (escaped). Backticks → <code>.
 * No chat linkify; keep separate from notes sidebar helpers.
 */
import { labsMarkdownToHtml } from "@vanduo-oss/vdl-engines/labs-md-to-html.js";

/** Block HTML (typically wrapped in <p>…</p>). */
export function renderProseHtml(text: string): string {
  return labsMarkdownToHtml(String(text || ""));
}

/**
 * Inline-friendly HTML: unwrap a single outer <p> so captions and button
 * labels do not nest block paragraphs inside spans/buttons.
 */
export function renderProseHtmlInline(text: string): string {
  const html = renderProseHtml(text).trim();
  const single = /^<p>([\s\S]*)<\/p>$/i.exec(html);
  if (single && !/<p\b/i.test(single[1])) {
    return single[1];
  }
  return html;
}
