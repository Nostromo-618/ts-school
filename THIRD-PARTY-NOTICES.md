# Third-party notices

TypeScript School is MIT-licensed (see [`LICENSE`](./LICENSE)). This file lists
third-party software and model terms that apply when you build, run, or use
optional local AI features.

## UI — `@vanduo-oss/vd3` / `@vanduo-oss/vd3-cbun`

The design system packages are MIT-licensed. Bundled attributions (fonts/icons
and related assets) ship with the package as `THIRD-PARTY-LICENSES` and include
at least:

- **Open Color** — MIT
- **Phosphor Icons** — MIT

Fonts are self-hosted via vd3 (`font-src 'self'`); no CDN fonts are loaded at
runtime.

## On-device AI runtime — `@litert-lm/core`

LiteRT / LiteRT-LM Web bindings used to run local Gemma weights in the browser.
Follow the license terms of the `@litert-lm/core` package as published on npm.

## Gemma model weights (optional, not shipped in `dist/`)

Opt-in weights are fetched into `.models/` (gitignored) via `pnpm models:fetch`
from Hugging Face `litert-community` repositories, for example:

- `litert-community/gemma-4-E2B-it-litert-lm`
- `litert-community/gemma-4-E4B-it-litert-lm`

Gemma models are subject to Google’s Gemma terms of use / model license as
published on the Hugging Face model cards and Google’s Gemma site. Weights are
**not** redistributed in this repository’s release artifacts.

## Search index embeddings (build-time only)

`@huggingface/transformers` (devDependency) may download an embedding model at
**build time** to generate `public/search/vectors.json`. That model’s license
applies to the downloaded weights; the generated vectors are site data. The
browser search path does not load Transformers.js unless a future feature
explicitly does so.

## TypeScript compilers

- `typescript` (7.x) — Apache-2.0 (Microsoft)
- `typescript-strada` (npm alias of `typescript@6.0.3`) — Apache-2.0 (Microsoft)

Microsoft’s published compatibility package name is `@typescript/typescript6`;
this repo uses the local alias `typescript-strada` for the same Strada API line.

## Other runtime dependencies

See `package.json` / `pnpm-lock.yaml` for the full dependency tree. Notable MIT
packages include Vue, Vite-related tooling, Pinia, Fuse.js, and related
ecosystem libraries.
