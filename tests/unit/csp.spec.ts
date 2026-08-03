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

// The policy is load-bearing: ts-school compiles learner-authored source and
// must never gain a way to execute it. Widening a directive should have to
// break a test first.
describe('index.html content-security-policy', () => {
  it.each([
    ['default-src', ["'self'"]],
    ['script-src', ["'self'"]],
    ['style-src', ["'self'", "'unsafe-inline'"]],
    ['worker-src', ["'self'", 'blob:']],
    ['connect-src', ["'self'"]],
    ['img-src', ["'self'", 'data:']],
    ['font-src', ["'self'"]],
    ['object-src', ["'none'"]],
    ['base-uri', ["'none'"]],
  ])('pins %s', (directive, sources) => {
    expect(policy[directive]).toEqual(sources);
  });

  // Browsers ignore frame-ancestors in a meta policy and log an error for it,
  // so it belongs on a response header instead. Keep it out of the meta tag.
  it('omits the directives a meta policy cannot deliver', () => {
    expect(policy['frame-ancestors']).toBeUndefined();
    expect(policy['report-uri']).toBeUndefined();
    expect(policy.sandbox).toBeUndefined();
  });

  it('allows inline styles but never inline or remote scripts', () => {
    expect(policy['style-src']).toContain("'unsafe-inline'");
    expect(policy['script-src']).not.toContain("'unsafe-inline'");
    expect(policy['script-src']).not.toContain("'unsafe-eval'");
    expect(policy['script-src']).toEqual(["'self'"]);
  });
});
