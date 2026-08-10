import { describe, expect, it } from "vitest";
import {
  renderProseHtml,
  renderProseHtmlInline,
} from "@/lib/prose-markdown";

describe("curriculum prose markdown", () => {
  it("turns backticks into code elements", () => {
    const html = renderProseHtml("Emit is optional: `noEmit` skips the checker.");
    expect(html).toContain("<code>noEmit</code>");
    expect(html).not.toContain("`noEmit`");
  });

  it("escapes script tags and event handlers", () => {
    const html = renderProseHtml(
      '<script>alert(1)</script><img src=x onerror="alert(2)">Hello `ok`',
    );
    expect(html).not.toMatch(/<script[\s>]/i);
    expect(html).not.toMatch(/<img[\s>]/i);
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("<code>ok</code>");
  });

  it("escapes raw HTML angle brackets in prose", () => {
    const html = renderProseHtml("Use <div> carefully with `Foo`");
    expect(html).toContain("&lt;div&gt;");
    expect(html).not.toContain("<div>");
    expect(html).toContain("<code>Foo</code>");
  });

  it("unwraps a single paragraph for inline captions", () => {
    const html = renderProseHtmlInline("Uses `in` for narrowing.");
    expect(html).toBe("Uses <code>in</code> for narrowing.");
    expect(html).not.toMatch(/^<p>/i);
  });
});
