# TypeScript School

A static teaching site for TypeScript. Every lesson is a **pair**: the
idiomatic-but-fragile JavaScript on the left, the TypeScript that fixes it on
the right — and the TypeScript pane is live. Edit it and a real `tsc` running
in a Web Worker answers with real diagnostics. A Vitest suite runs the same
compiler over every lesson in CI, so a lesson cannot claim "TypeScript catches
this" unless the compiler actually says so.

Private and local-only: nothing is published, and there is no deploy pipeline.

## Status

Scaffold only. The repository currently holds the toolchain, build, quality
gates, and a placeholder home page. The docs shell, curriculum model, typecheck
worker, lesson engine, and content each land as their own OpenSpec change —
see `openspec/changes/` and `openspec/changes/archive/`.

## Stack

Vue 3.5 · Vite 8 · `vite-ssg` 28 (prerenders every route) · vue-router 5 ·
Pinia 3 · `@unhead/vue`, consuming the published
[`@vanduo-oss/vd3`](https://www.npmjs.com/package/@vanduo-oss/vd3) 1.2.1 and
[`@vanduo-oss/vd3-cbun`](https://www.npmjs.com/package/@vanduo-oss/vd3-cbun)
1.3.1 design-system packages.

## Getting started

The toolchain is pinned in `mise.toml` (node 24.17.0, pnpm 11.18.0). A bare
shell may resolve a different node, so run through mise:

```bash
mise trust
mise exec -- pnpm install
mise exec -- pnpm dev
```

| Script                  | What it does                                     |
| ----------------------- | ------------------------------------------------ |
| `pnpm dev`              | Vite dev server                                   |
| `pnpm build`            | `vite-ssg build` — prerenders every route         |
| `pnpm preview`          | Serve the built site on port 8787                 |
| `pnpm lint` / `:fix`    | ESLint over the repo                              |
| `pnpm stylelint`        | Stylelint over `src/**/*.css`                     |
| `pnpm format` / `:check`| Prettier over `src`                               |
| `pnpm typecheck`        | `vue-tsc --noEmit`                                |
| `pnpm test`             | Vitest unit suites in `tests/unit/`               |
| `pnpm test:e2e`         | Playwright, Chromium Desktop, from `tests/e2e/`   |

## Do not upgrade TypeScript

`typescript` is pinned to **exactly `6.0.3`** and must stay there.

TypeScript 7.0 is a Go native binary. It ships **no programmatic API** and
cannot type-check in a browser; Microsoft targets 7.1 for a new API. The
in-browser checker that makes every lesson live needs the JS (Strada) compiler,
so 6.0.3 — the last release with it — is the only version that works. One
install serves `vue-tsc`, the ESLint parser, the Web Worker, and the CI
compiler-truth suite.

Do not add `@typescript/native-preview`, and do not "helpfully" widen the pin
to a range.

## Security posture

- `typescript` is imported only inside the worker, never in the main bundle.
- The compiler host is first-party; lib `.d.ts` files are served same-origin
  from `public/ts-lib/`, never from a CDN.
- No `eval`, no `new Function`, no code execution, no runtime network. ESLint
  enforces this.
- Lesson code is plain text rendered into `<textarea>`/`<pre>` — no `v-html`
  anywhere in the lesson pipeline (`vue/no-v-html` is an error).
- `index.html` carries a strict Content-Security-Policy; `tests/unit/csp.spec.ts`
  fails if a directive is widened. `style-src` is the single concession —
  Vue scoped styles and vd3's runtime theming emit inline styles, and a static
  site has no server to mint a nonce. `frame-ancestors` is deliberately absent:
  browsers ignore it in a `<meta>` policy, so a server fronting the built files
  must send `Content-Security-Policy: frame-ancestors 'none'` as a header.
- `.npmrc` blocks lifecycle scripts, delays newly published packages, refuses
  trust downgrades, and pins the registry.

## Workflow

Development is spec-driven through [OpenSpec](https://github.com/Fission-AI/OpenSpec).
Every unit of work lands as a change proposal (`proposal.md` with a Non-goals
section, Given/When/Then specs, `tasks.md`), is implemented, validated with
`openspec validate`, and archived. House rules live in `openspec/config.yaml`.
