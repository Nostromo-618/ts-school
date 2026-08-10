import { describe, expect, it } from "vitest";
import { renderNotesHtml } from "@/lib/notes-markdown";

describe("notes markdown XSS hardening", () => {
  it("escapes script tags and event handlers", () => {
    const html = renderNotesHtml(
      '<script>alert(1)</script><img src=x onerror="alert(2)">Hello',
    );
    expect(html).not.toMatch(/<script[\s>]/i);
    expect(html).not.toMatch(/<img[\s>]/i);
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("Hello");
  });

  it("does not create javascript: navigable links as safe anchors", () => {
    const html = renderNotesHtml("[x](javascript:alert(1))");
    expect(html).not.toMatch(/href\s*=\s*["']javascript:/i);
  });

  it("marks TypeScript fences with a language class", () => {
    const html = renderNotesHtml("```ts\nconst x: number = 1;\n```");
    expect(html).toMatch(/language-ts|language-typescript/i);
    expect(html).toContain("const x");
  });
});
