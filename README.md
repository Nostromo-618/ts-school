# TypeScript School

A static teaching site for TypeScript. Every lesson is a **pair**: the
idiomatic-but-fragile JavaScript on the left, the TypeScript that fixes it on
the right. Diagnostics under the TypeScript pane are produced at **build time**
by the Strada (JS) Compiler API (`typescript-strada@6.0.3`, alias of the
Microsoft Strada / `@typescript/typescript6` line) and shipped as static data.
A Vitest suite runs the same checker over every lesson in CI, so a lesson
cannot claim "TypeScript catches this" unless the compiler actually says so.

Primary `typescript` is **7.0.2** (native CLI). Exercises pass when normalized
editor text matches the authored solution.

Public static site: clone, install, and run locally, or enable **GitHub Pages**
(workflow `.github/workflows/pages.yml`) to deploy the `vite-ssg` `dist/` output.
On-device AI model weights stay local (`.models/` is gitignored) — Pages builds
do not ship multi-GB LiteRT files.

## License

MIT — see [`LICENSE`](./LICENSE). Third-party and model attributions:
[`THIRD-PARTY-NOTICES.md`](./THIRD-PARTY-NOTICES.md) (also served at `/LICENSE`
and `/THIRD-PARTY-NOTICES.md` from `public/`). Keep `public/` copies in sync
with the repo root when either file changes.

## Status

Curriculum and shell are in place (Profile, notes, progress, Ask assistant).
Development is OpenSpec-driven — see `openspec/changes/` and
`openspec/changes/archive/`.

## GitHub Pages

1. Push to `main` (or run the **pages** workflow manually).
2. In the GitHub repo: **Settings → Pages → Build and deployment → Source:
   GitHub Actions**.
3. Expected URL for a project site:
   `https://<owner>.github.io/<repo>/`  
   Example placeholder: `https://<your-org-or-user>.github.io/ts-school/`

Base path: Vite reads `VITE_BASE` (see `vite.config.ts`). The Pages workflow
sets `VITE_BASE=/<repo>/` for project sites, or `/` when the repo name is
`<owner>.github.io`. Local `pnpm dev` / `pnpm preview` / Playwright keep the
default `/`.

**CSP note:** GitHub Pages serves static files and does not easily attach a
custom `Content-Security-Policy: frame-ancestors 'none'` response header. The
meta CSP in `index.html` still applies; `frame-ancestors` remains a documented
limitation on Pages (use a header-capable host if you need that directive).

**Models:** Optional Ask / Gemma chat downloads weights into the visitor’s
browser (or uses a local `.models/` cache in dev). Do not commit `.models/`.

## Release checklist

Before treating a build as release-ready:

```bash
mise exec -- pnpm gate:release
```

That runs lint, stylelint, format check, typecheck, unit tests, production
build, Playwright Chromium Desktop, and Chromium Mobile responsive smoke.
Optional: `pnpm test:e2e:full` (Firefox/WebKit) and `pnpm test:e2e:llm`
(local Gemma + WebGPU).

CI on `main` runs the same static checks plus Chromium Desktop and Mobile
Playwright after `pnpm build`. Pages deploy is a separate workflow.

## Stack

Vue 3.5 · Vite 8 · `vite-ssg` 28 (prerenders every route) · vue-router 5 ·
Pinia 4 · `@unhead/vue` 3, consuming the published
[`@vanduo-oss/vd3`](https://www.npmjs.com/package/@vanduo-oss/vd3) 1.2.2 and
[`@vanduo-oss/vd3-cbun`](https://www.npmjs.com/package/@vanduo-oss/vd3-cbun)
1.3.1 design-system packages. Search / AI engines come from
`@vanduo-oss/vdl-ai-chat` and `@vanduo-oss/vdl-hybrid-search` (see blocker note below).

## Getting started

The toolchain is pinned in `mise.toml` (node 24.17.0, pnpm 11.18.0). A bare
shell may resolve a different node, so run through mise.

**Prerequisite:** clone the private VDL packages as siblings at
`../0_vanduo/vdl-ai-chat` and `../0_vanduo/vdl-hybrid-search` (same layout CI
uses), until they are published to npm.

```bash
# from Documents/GitHub (example)
git clone https://github.com/<you>/ts-school.git
git clone https://github.com/vanduo-oss/vdl-ai-chat.git 0_vanduo/vdl-ai-chat
git clone https://github.com/vanduo-oss/vdl-hybrid-search.git 0_vanduo/vdl-hybrid-search

cd ts-school
mise trust
# Build sibling packages once (dist/ is gitignored)
(cd ../0_vanduo/vdl-ai-chat && pnpm install && pnpm build)
(cd ../0_vanduo/vdl-hybrid-search && pnpm install && pnpm build)
mise exec -- pnpm install
mise exec -- pnpm dev
```

| Script                     | What it does                                      |
| -------------------------- | ------------------------------------------------- |
| `pnpm dev`                 | Vite dev server (diagnostics + search index first)|
| `pnpm build`               | `vite-ssg build` — prerenders every route         |
| `pnpm preview`             | Serve the built site on port 8787                 |
| `pnpm generate:diagnostics`| Rebuild `src/curriculum/generated/diagnostics.ts` |
| `pnpm generate:search-index`| Rebuild Neptune `public/search/*` embeddings     |
| `pnpm models:fetch`        | Prefetch Gemma LiteRT into `.models/` (dev cache) |
| `pnpm models:compare`      | Score E2B/E4B school tutoring fixtures → `data/model-compare/` |
| `pnpm models:compare:live` | Same against localhost:5173 (needs weights + WebGPU) |
| `pnpm typecheck`           | `vue-tsc` via Strada wrapper (`--noEmit`)         |
| `pnpm lint` / `:fix`       | ESLint via Strada wrapper (parser needs TS 6 API) |
| `pnpm stylelint`           | Stylelint over `src/**/*.css`                     |
| `pnpm format` / `:check`   | Prettier over `src`                               |
| `pnpm test`                | Vitest unit suites in `tests/unit/`               |
| `pnpm test:e2e`            | Playwright, Chromium Desktop, from `tests/e2e/`   |
| `pnpm test:e2e:mobile`     | Chromium Mobile responsive critical paths         |
| `pnpm test:e2e:llm`        | Same + gated Gemma chat (needs `.models/` + WebGPU) |
| `pnpm gate:release`        | Full release readiness gate (see above)           |

## Theme localStorage keys

`@vanduo-oss/vd3` 1.2.2 hardcodes theme preference keys with a `vanduo-`
prefix (`VanduoVue` / `themeDefaults` expose no storage-prefix option). This
site remaps those keys to `ts-school-*` via
[`src/lib/vd3-theme-storage.ts`](./src/lib/vd3-theme-storage.ts) so prefs do
not collide with other vd3 apps on the same origin:

| vd3 key (hardcoded) | TypeScript School key |
| ------------------- | --------------------- |
| `vanduo-theme-preference` | `ts-school-theme-preference` |
| `vanduo-palette` | `ts-school-palette` |
| `vanduo-primary-color` | `ts-school-primary-color` |
| `vanduo-neutral-color` | `ts-school-neutral-color` |
| `vanduo-radius` | `ts-school-radius` |
| `vanduo-font-preference` | `ts-school-font-preference` |

On first load, any existing `vanduo-*` theme values are copied to the
`ts-school-*` keys and the legacy keys are removed. Profile clear-all removes
both. If upstream vd3 adds an official storage prefix, prefer that and retire
the remapper.

Site theme defaults (unchanged): violet primary, stone / charcoal neutrals,
radius `0.375`, font `lato`.

## TypeScript dual install

| Package               | Version | Role |
| --------------------- | ------- | ---- |
| `typescript`          | 7.0.2   | Native CLI / primary package |
| `typescript-strada`   | 6.0.3   | Programmatic `createProgram` for diagnostic generation, compiler-truth, and `vue-tsc` |

Microsoft publishes the Strada API compatibility line as
`@typescript/typescript6`. This repo aliases it `typescript-strada` for the
same purpose.

`vue-tsc` still needs the Strada API (`./lib/tsc` is gone from the native
package). `pnpm typecheck` runs `scripts/vue-tsc-strada.mjs`, which redirects
`typescript` imports to `typescript-strada`.

Do not add `@typescript/native-preview` as a second native line without updating
this table and the generator.

## Security posture

- Neither `typescript` nor `typescript-strada` is imported as a value in
  browser source; the compiler stays in Node scripts and unit tests.
- No `eval`, no `new Function`, no learner code execution. ESLint enforces this.
- Lesson code is plain text rendered into `<textarea>`/`<pre>` — no `v-html`
  anywhere in the lesson pipeline (`vue/no-v-html` is an error).
- `index.html` CSP keeps `script-src` on `'self'` (+ `'wasm-unsafe-eval'` for
  WebAssembly). Opt-in hybrid search and Gemma chat may fetch model weights
  (`connect-src` includes Hugging Face / CDN hosts) and use `worker-src`
  `blob:`; core curriculum browsing does not require those paths.
  `tests/unit/csp.spec.ts` pins the policy. `style-src` allows `'unsafe-inline'`
  for Vue scoped styles and vd3 theming. Production deploys MUST also send
  `Content-Security-Policy: frame-ancestors 'none'` as a **response header**
  (meta cannot set `frame-ancestors`).
- Site terms are a mandatory first-visit gate. Opening **Ask** shows an
  additional versioned **AI risk** modal (local RAM/GPU use, hallucinations,
  no professional advice, edit Accept required, EU AI Act transparency) before
  the sidebar is usable.
- Chat loads `@litert-lm/core` from npm (bundled) — not a CDN `import()`. Prefetch
  weights with `pnpm models:fetch` (or `--from-labs`); `pnpm dev` / `pnpm preview`
  serve them at `/models/<id>/` and AiChat prefers that path before Hugging Face.
  After the first successful Hugging Face download, LiteRT weights are stored in
  the origin Cache Storage bucket `vdl-litert-models` so refresh + Load uses
  **From cache** instead of re-downloading (Profile clear-all removes it).
  Assistant bubbles render Labs markdown (`v-html` from escaped markdown only).
  Run `pnpm test:e2e:llm` locally to exercise Load → starter chat when weights exist.
- Chat editor tools never silently overwrite panes — Accept/Reject is required.
- `.npmrc` blocks lifecycle scripts, delays newly published packages, refuses
  trust downgrades, and pins the registry. `@vanduo-oss/*` is excluded from the
  minimum-release-age gate (and may use `--safe-chain-skip-minimum-package-age`).
- Local engine packages: `@vanduo-oss/vdl-ai-chat` and
  `@vanduo-oss/vdl-hybrid-search` are **not on npm yet**. This repo depends on
  `file:../0_vanduo/vdl-ai-chat` and `file:../0_vanduo/vdl-hybrid-search`.
  CI/Pages clone those private repos and symlink them into place. Publishing
  either package to npm removes the sibling-clone requirement for that engine.

## Workflow

Development is spec-driven through [OpenSpec](https://github.com/Fission-AI/OpenSpec).
Every unit of work lands as a change proposal (`proposal.md` with a Non-goals
section, Given/When/Then specs, `tasks.md`), is implemented, validated with
`openspec validate`, and archived. House rules live in `openspec/config.yaml`.
