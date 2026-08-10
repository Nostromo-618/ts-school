/**
 * Notes preview HTML — Labs markdown (escaped) + dangerous-protocol strip.
 * Same CSP bar as assistant chat: no raw HTML via v-html without this pipeline.
 */
import { labsMarkdownToHtml } from "@vanduo-oss/vdl-ai-chat/markdown";

const DANGEROUS_HREF =
  /\shref\s*=\s*(["'])\s*(?:javascript|vbscript|data)\s*:/gi;

/**
 * Render notes markdown for preview. Fenced code keeps language-* classes from
 * the Labs pipeline so site CSS can distinguish TS fences. Dangerous URL
 * schemes are stripped so preview links are not navigable as script vectors.
 */
export function renderNotesHtml(text: string): string {
  const html = labsMarkdownToHtml(String(text || ""));
  return html.replace(DANGEROUS_HREF, " data-blocked-href=$1");
}
