import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// vitest serves this file over http, so import.meta.url is not a file URL;
// resolve from the vitest root instead.
const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');

const policy = (() => {
  const match = html.match(
    /http-equiv="Content-Security-Policy"\s*\n?\s*content="([^"]+)"/,
  );
  if (!match) throw new Error('index.html carries no CSP meta tag');
  return Object.fromEntries(
    match[1]
      .split(';')
      .map((directive) => directive.trim())
      .filter(Boolean)
      .map((directive) => {
        const [name, ...sources] = directive.split(/\s+/);
        return [name, sources];
      }),
  ) as Record<string, string[]>;
})();

// The policy is load-bearing: ts-school never executes learner-authored source.
// Opt-in AI/search may fetch model weights and use WASM/workers; script-src
// stays self (+ wasm-unsafe-eval for WebAssembly).
describe('index.html content-security-policy', () => {
  it('keeps script-src self-only aside from wasm-unsafe-eval', () => {
    expect(policy['script-src']).toContain("'self'");
    expect(policy['script-src']).toContain("'wasm-unsafe-eval'");
    expect(policy['script-src']).not.toContain("'unsafe-inline'");
    expect(policy['script-src']).not.toContain('https:');
  });

  it('allows style-src unsafe-inline for vd3 theming', () => {
    expect(policy['style-src']).toEqual(["'self'", "'unsafe-inline'"]);
  });

  it('widens connect-src for opt-in Hugging Face / CDN model hosts', () => {
    expect(policy['connect-src']).toContain("'self'");
    expect(policy['connect-src']).toContain('https://huggingface.co');
    expect(policy['connect-src']).toContain('blob:');
  });

  it('allows workers for Transformers / LiteRT', () => {
    expect(policy['worker-src']).toEqual(["'self'", 'blob:']);
  });

  it.each([
    ['default-src', ["'self'"]],
    ['img-src', ["'self'", 'data:']],
    ['font-src', ["'self'"]],
    ['object-src', ["'none'"]],
    ['base-uri', ["'none'"]],
  ])('pins %s', (directive, sources) => {
    expect(policy[directive]).toEqual(sources);
  });

  it('omits the directives a meta policy cannot deliver', () => {
    expect(policy['frame-ancestors']).toBeUndefined();
    expect(policy['report-uri']).toBeUndefined();
    expect(policy.sandbox).toBeUndefined();
  });
});
