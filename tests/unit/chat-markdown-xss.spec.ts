import { describe, expect, it } from "vitest";
import {
  isSchoolInternalHref,
  renderAssistantHtml,
} from "@/ai/chat-markdown";

describe("assistant markdown XSS hardening", () => {
  it("escapes script tags and event handlers from model text", () => {
    const html = renderAssistantHtml(
      '<script>alert(1)</script><img src=x onerror="alert(2)">Hello',
    );
    expect(html).not.toMatch(/<script[\s>]/i);
    expect(html).not.toMatch(/<img[\s>]/i);
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("Hello");
  });

  it("does not treat javascript: as an internal href", () => {
    expect(isSchoolInternalHref("javascript:alert(1)")).toBe(false);
    expect(isSchoolInternalHref("/curriculum")).toBe(true);
    expect(isSchoolInternalHref("//evil.example")).toBe(false);
  });

  it("escapes raw HTML angle brackets in prose", () => {
    const html = renderAssistantHtml("Use <div> carefully");
    expect(html).toContain("&lt;div&gt;");
    expect(html).not.toContain("<div>");
  });
});
